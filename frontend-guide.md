# Front-end integration guide

How to call the divacast API from a client. The endpoint-by-endpoint reference is
[api.md](api.md); the machine-readable contract is [openapi.json](openapi.json) and
[divacast-api.ts](divacast-api.ts). This page is the part that is not in either: how to get a
token, what to call first, and what will go wrong.

```
https://us-central1-divacast.cloudfunctions.net/divacast-api
```

---

## Read this before writing any client code

Two server-side blockers stop a **browser** client. Neither is fixable in front-end code, and
neither shows up in the test suite or in `curl`.

### 1. CORS is not configured

The API sends no `Access-Control-Allow-Origin` header, and a preflight `OPTIONS /v1/users`
answers **405**. Every cross-origin browser request therefore fails at the preflight — before your
request is sent — including `/v1/healthz`.

Verified against the deployed function on 2026-10-10 by sending a real preflight from outside the
project network. `curl`, Postman and server-side `fetch` are unaffected: this is a browser rule,
not an API rule, which is why 200 passing tests say nothing about it.

**Fix:** add `CORSMiddleware` in `divacast.app.create_app` with an explicit origin allowlist
(not `*` — the API takes credentials), then redeploy. Until then, develop against a local server
(`make dev`) or proxy through your own backend.

### 2. There is no Firebase Web App in the project

Authentication needs a Firebase **ID token**, which a browser gets from the Firebase JS SDK, which
needs a Web API key from a registered Web App. The project has none, so there is no
`firebaseConfig` to initialise the SDK with.

**Fix:** register a Web App in the Firebase console. It takes a minute and emits the config object
below.

### 3. A Firebase account is not yet a divacast user

Not a blocker, but it bites exactly once. Signing in gives you a verified identity with no profile
attached. Until you call `POST /v1/users`, every write answers `403` with *"No divacast profile is
linked to this account"*. See [First run](#first-run).

---

## Authentication

Every route except `GET /v1` and `GET /v1/healthz` requires:

```
Authorization: Bearer <firebase-id-token>
```

That is the token from the client SDK's `getIdToken()` — **not** a Firebase Web API key, and not a
Google Cloud access token. The server verifies signature, issuer, audience and expiry against the
`divacast` project.

```ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = initializeApp({
  apiKey: "...",                        // from the Web App registration
  authDomain: "divacast.firebaseapp.com",
  projectId: "divacast",
});
const auth = getAuth(app);

await signInWithEmailAndPassword(auth, email, password);

// Call this per request. The SDK refreshes a token that is near expiry,
// so never cache the string yourself.
const token = await auth.currentUser.getIdToken();
```

ID tokens last one hour. The API verifies with `check_revoked` enabled, so signing a user out
everywhere ends their session immediately rather than leaving the token usable until it expires.
That costs a lookup on every request — account for it in your latency budget.

### 401 and 403 mean different things

| Status | Meaning | What to do |
|---|---|---|
| `401` | We do not know who you are — missing, malformed, expired or revoked token. | Refresh the token, retry **once**. Still failing: send them to sign-in. |
| `403` | We know who you are and the answer will not change — another account's row, an admin-only route, or no linked profile. | Do not retry. Show the user why. |

Collapsing these into one branch is the mistake this API is shaped to let you avoid.

### Ownership

Reads are open to any signed-in user. Writes are restricted to your own rows:

- **On create**, the owner field in the body must be your own user id — `authorId`, `singerId`,
  `userId` or `followerId`. Naming someone else is `403`.
- **On update and delete**, you must own the row. A missing row answers `404` **before** ownership
  is considered, so a `403` never confirms that an id exists.
- **Article types** need the `admin` custom claim to write; anyone signed in can read them.

Deleting a user cascades to their music, posts, articles, engagements and follow edges.

---

## First run

```ts
// 1. Sign in with Firebase. You now have a token but no divacast profile.
// 2. Create the profile. firebaseUid comes from the token —
//    sending it in the body is a 400.
const me = await client.createUser({
  username: "nova",
  email: "nova@example.com",
  isArtist: true,
});

// 3. Keep me.data.id. Every create you make must name it as the owner.
await client.createArticle({
  title: "Nova at the Roundhouse",
  body: "The set opened with...",
  authorId: me.data.id,
  articleTypeId: someTypeId,
});
```

To find out whether a signed-in account already has a profile, list users filtered by the username
you stored, or keep the id yourself after creating it. There is no `GET /v1/users/me`.

---

## Using the typed client

[`divacast-api.ts`](divacast-api.ts) has every request and response type plus a small `fetch`
client. No dependencies, compiles under `--strict`.

```ts
import { DivacastClient, DivacastError } from "./divacast-api";

const client = new DivacastClient({
  getIdToken: async () => getAuth().currentUser?.getIdToken() ?? null,
});

try {
  const { data, page } = await client.listArticles({
    status: "published", limit: 20, sort: "publishedAt", order: "desc",
  });
  console.log(`${data.length} of ${page.total}`);
} catch (err) {
  if (err instanceof DivacastError && err.isRetryableAuth) {
    // 401 — refresh the token and try once more.
  }
}
```

Every non-2xx becomes a `DivacastError` carrying `status`, `code`, `details` and `requestId`.
A successful `DELETE` returns `204`, which the client surfaces as `undefined`.

Regenerate the types after any router or model change:

```bash
make openapi
```

That rewrites `openapi.json` and the interface block in `divacast-api.ts`. The client below the
`// ---- client` marker is hand-written and preserved.

---

## Things that will surprise you

**Unknown body fields are rejected**, not ignored. Do not spread a response object back into a
`PATCH` — the read-only fields it carries (`id`, embedded `author`, …) will each produce a `400`.
Send only what you are changing.

**`PATCH` distinguishes absent from null.** Omitting a field leaves it alone; sending explicit
`null` clears the column. An empty body is a `400`. `{"publishedAt": null}` is how an article is
unpublished back to draft.

**Article list rows carry no `body`.** It is unbounded text, so lists omit it and
`GET /v1/articles/{id}` returns it. In TypeScript that is `ArticleListItem` versus `ArticleDetail`
— the compiler will catch you reaching for the wrong one.

**A future-dated article is neither `published` nor `draft`.** `status=published` means
`publishedAt` is set *and* at or before now. Reporting a scheduled article as published would leak
it early. For a scheduling UI, filter on `publishedFrom` instead.

**Embedded users carry no `email`.** An embedded author is shown to every reader of the article, so
the summary is `id`, `username`, `isArtist`, `profilePictureUrl` only. Fetch the user directly if
you need the address.

**Strings are normalised on write.** Everything is trimmed; `email` and the various `type` fields
are also lowercased. `A@X.COM` comes back as `a@x.com`, so compare against the response rather than
your input.

**`commentText` is required exactly when an engagement's `type` is `"comment"`** and must be absent
otherwise — both directions are a `400`.

**Follows have no `id`.** The edge is keyed `(followerId, followedId)` and addressed as
`/v1/follows/{followerId}/{followedId}`. There is no `PATCH`; re-creating an edge is `409`, and
following yourself is `400`.

**Cold starts cost about 1.3 s.** This runs on Cloud Functions 1st gen, which serves one request
per instance and scales out rather than up. Parallel requests land on separate instances, so fire
them freely — but a single instance will not pipeline them.

**Quote `requestId` in bug reports.** Every response carries an `x-request-id` header, echoed as
`error.requestId`. Send your own and it is honoured, which is how a client trace ties to a server
log line.

---

## Interactive docs

FastAPI serves Swagger UI at `/docs` and the live schema at `/openapi.json`. The *deployed* schema
does not yet advertise the bearer scheme, so its **Authorize** button will not work until the
function is redeployed; the checked-in `openapi.json` already declares it.
