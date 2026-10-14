# API reference

Base path `/v1`. Request and response JSON is camelCase; the database is snake_case.

Deployed base URL (Cloud Functions 1st gen, us-central1):

```
https://us-central1-divacast.cloudfunctions.net/divacast-api
```

Interactive docs are served at `/docs`, the generated schema at `/openapi.json`. This page is the
prose version — the generated schema is authoritative if the two ever disagree.

## For client developers

New to this API? Start with the [front-end integration guide](frontend-guide.md) — token
flow, first call, and the gotchas. This page is the endpoint reference.

| File | What it is |
|---|---|
| [`openapi.json`](openapi.json) | OpenAPI 3.1, 37 operations. Import into Postman/Insomnia or run codegen. |
| [`divacast-api.ts`](divacast-api.ts) | Every request/response type plus a typed `fetch` client. Compiles under `--strict`, no dependencies. |

Both are generated from the application, so they cannot drift from the routes. Regenerate with
`make openapi` after changing any router or model.

> **CORS is not configured.** The API sends no `Access-Control-Allow-Origin` header, and a
> preflight `OPTIONS /v1/users` answers 405 — verified against the deployed function on
> 2026-10-10. **Every cross-origin browser request will fail at the preflight**, including
> `/v1/healthz`. `curl`, Postman and server-side `fetch` are unaffected. Fixing it means adding
> `CORSMiddleware` in `divacast.app.create_app` with an explicit origin allowlist, then
> redeploying.
>
> **There is also no Firebase Web App in the project**, so there is no Web API key with which a
> browser client can obtain an ID token. One has to be registered in the Firebase console before
> any front end can authenticate.

> **Authentication required.** Every endpoint below except `/v1/healthz` and `/v1` needs a Firebase
> ID token: `Authorization: Bearer <token>`. Ownership rules are summarised in the
> [README](../README.md#authentication).

## Envelopes

Single resource:

```json
{ "data": { "id": "...", "...": "..." } }
```

List:

```json
{ "data": [ ... ], "page": { "limit": 20, "offset": 0, "total": 137 } }
```

`total` is the count matching the filters, not the page size. Errors:

```json
{ "error": { "code": "not_found", "message": "Article not found", "details": [], "requestId": "req_252ffc0be29d4362" } }
```

`details` is a possibly-empty list of `{"field", "message"}`. `requestId` is echoed in the
`x-request-id` response header; supply that header yourself and it is honoured, which is how you tie
a client-side trace to a server log line.

| Code | Status | Meaning |
|---|---|---|
| `validation_error` | 400 | Malformed body, unknown field, bad UUID, out-of-range or non-allowlisted parameter. |
| `unauthenticated` | 401 | Missing, malformed, expired or revoked ID token. Refresh and retry. |
| `forbidden` | 403 | Verified, but not permitted: another account's row, or an admin-only route. |
| `not_found` | 404 | No such row, or no such route. |
| `method_not_allowed` | 405 | The method is not defined for that resource. |
| `conflict` | 409 | A unique value is already taken. |
| `unprocessable_entity` | 422 | A referenced row does not exist, or a delete is blocked by a reference. |
| `internal_error` | 500 | Unexpected. The body carries no detail; the `requestId` locates it in the log. |

## Common conventions

Writes are restricted to the caller's own rows; see [Authentication](../README.md#authentication).
A missing row answers `404` **before** ownership is considered, so a `403` never confirms that an id
exists.

**Creates** return `201` with a `Location` header. **Deletes** return `204` with no body, or `404`
if the row did not exist. **Patches** are partial: an omitted field is left alone, an explicit
`null` sets the column to NULL, and an empty body is a `400`. Sending `null` for a `NOT NULL` column
is a `400`, not a `500`. Unknown body fields are rejected.

Every list endpoint accepts:

| Parameter | Default | Notes |
|---|---|---|
| `limit` | 20 | 1–100. |
| `offset` | 0 | ≥ 0. |
| `sort` | per entity | Must be one of that entity's sortable keys. |
| `order` | `desc` | `asc` or `desc`. |

Results carry a secondary sort on the primary key, so paging over rows with equal sort keys does not
repeat or skip.

## Endpoints

### Meta

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1` | Resource index. |
| `GET` | `/v1/healthz` | Round-trips to the database. `200` with `{"status":"ok"}`, or `503`. |

### Users — `/v1/users`

Sortable: `username`, `email` (default `username`).

| Field | Type | Constraints |
|---|---|---|
| `username` | string | required, 1–50, trimmed, unique |
| `email` | string | required, ≤ 320, lowercased on write, unique case-insensitively |
| `isArtist` | boolean | required |
| — | — | `firebaseUid` is **not** a body field: it is taken from the verified token. Sending it is a `400`. |
| `bio` | string? | ≤ 2000 |
| `profilePictureUrl` | string? | ≤ 2048 |
| `socialLinks` | string? | ≤ 2048 |

List filters: `isArtist`, `q` (case-insensitive substring of `username`).

Deleting a user cascades to their music, posts, articles, engagements and follow edges — every
foreign key into `"user"` is a required reference, which Data Connect generates as
`ON DELETE CASCADE`.

### Music — `/v1/music`

Sortable: `title`.

| Field | Type | Constraints |
|---|---|---|
| `title` | string | required, 1–300 |
| `audioUrl` | string | required, ≤ 2048 |
| `singerId` | uuid | required, must exist |
| `duration` | int? | 0–86400 seconds |
| `albumArtUrl` | string? | ≤ 2048 |

List filters: `singerId`, `q` (on `title`). `GET /v1/music/{id}` embeds `singer`;
`?expand=none` returns the flat row with `singerId` only.

### Posts — `/v1/posts`

Sortable: `createdAt` (default), `title`.

| Field | Type | Constraints |
|---|---|---|
| `type` | string | required, ≤ 50, lowercased |
| `contentUrl` | string | required, ≤ 2048 |
| `authorId` | uuid | required, must exist |
| `title` | string? | ≤ 300 |
| `description` | string? | ≤ 5000 |
| `createdAt` | timestamp? | defaults to the database's `now()` on create |

List filters: `authorId`, `type`, `createdFrom`, `createdTo`. `GET /v1/posts/{id}` embeds `author`;
`?expand=none` for the flat form. Deleting a post cascades to its engagements.

### Follows — `/v1/follows`

A follow edge is its own primary key: `(followerId, followedId)`, with no `id`.

| Method | Path |
|---|---|
| `GET` | `/v1/follows` — filters `followerId`, `followedId` |
| `POST` | `/v1/follows` — body `{followerId, followedId}` |
| `GET` | `/v1/follows/{followerId}/{followedId}` |
| `DELETE` | `/v1/follows/{followerId}/{followedId}` |

There is no `PATCH`: an edge has nothing to update, so `PATCH` returns `405`. Re-creating an
existing edge is `409`. Following yourself is `400`. Reads embed both endpoint users.

### Engagements — `/v1/engagements`

Sortable: `id` (default), `type`, `userId`, `postId`.

| Field | Type | Constraints |
|---|---|---|
| `type` | string | required, ≤ 50, lowercased |
| `userId` | uuid | required, must exist |
| `postId` | uuid | required, must exist |
| `commentText` | string? | ≤ 5000 |

One cross-field rule, enforced by the API and not by the schema: `commentText` is **required** when
`type` is `comment`, and must be absent otherwise. A patch touching either field is judged against
the stored value of the other under `SELECT ... FOR UPDATE`, so two concurrent patches cannot leave
the pair inconsistent.

List filters: `postId`, `userId`, `type`.

### Article types — `/v1/article-types`

Sortable: `name`.

| Field | Type | Constraints |
|---|---|---|
| `name` | string | required, ≤ 100, unique |
| `description` | string? | ≤ 5000 |

Writes are administrator-only (the `admin` custom claim); reads are open to any signed-in user.

Deleting a type that still has articles returns `422`, not a cascade. Deleting a *classification* is
not a request to delete everything filed under it — the opposite choice to deleting a user.

`GET /v1/article-types/{id}/articles` is documented under Articles.

### Articles — `/v1/articles`

Sortable: `publishedAt` (default), `title`.

| Field | Type | Constraints |
|---|---|---|
| `title` | string | required, 1–300 |
| `body` | string | required, ≤ 100000 (leading whitespace preserved) |
| `authorId` | uuid | required, must exist |
| `articleTypeId` | uuid | required, must exist |
| `mediaUrl` | string? | ≤ 2048 |
| `thumbnailImageUrl` | string? | ≤ 2048 |
| `publishedAt` | timestamp? | absent or null means draft |

List filters:

| Parameter | Effect |
|---|---|
| `authorId` | Articles by one author. |
| `articleTypeId` | Articles of one type. |
| `q` | Case-insensitive substring of `title`. Wildcards are matched literally. |
| `publishedFrom`, `publishedTo` | Bound `publishedAt`. |
| `status` | `published` → `publishedAt IS NOT NULL AND publishedAt <= now()`; `draft` → `publishedAt IS NULL`. |

An article dated in the future is in **neither** bucket: it is not a draft, but reporting it as
published would leak it early.

**List rows omit `body`.** It is unbounded text, and returning twenty full articles to render twenty
titles is a self-inflicted denial of service. `GET /v1/articles/{id}` returns it in full.

`GET /v1/article-types/{id}/articles` applies the same list contract scoped to one type, and accepts
the same filters. An unknown type is `404`, not an empty page — a client cannot otherwise tell "no
such type" from "type with no articles".

## Worked example

```bash
curl -s localhost:8080/v1/articles/1ca40393-f487-4b65-a200-f3481a9c51ff
```

```json
{
  "data": {
    "id": "1ca40393-f487-4b65-a200-f3481a9c51ff",
    "title": "Nova at the Roundhouse",
    "body": "The set opened with...",
    "mediaUrl": null,
    "thumbnailImageUrl": null,
    "publishedAt": "2026-08-01T20:00:00Z",
    "authorId": "06e81078-a59e-484d-a984-3c335e2cf3f2",
    "articleTypeId": "f9ca3b6f-d83d-40d1-87cc-3e0517e8e413",
    "author": {
      "id": "06e81078-a59e-484d-a984-3c335e2cf3f2",
      "username": "nova",
      "isArtist": true,
      "profilePictureUrl": "https://cdn.divacast.example/nova.jpg"
    },
    "articleType": {
      "id": "f9ca3b6f-d83d-40d1-87cc-3e0517e8e413",
      "name": "review",
      "description": "Critical assessment of a release, performance or venue."
    }
  }
}
```

The embedded `author` carries no `email`: an embedded author is shown to every reader of the
article, and a contact address is not part of that.

Filtered list:

```bash
curl -s 'localhost:8080/v1/articles?articleTypeId=f9ca3b6f-d83d-40d1-87cc-3e0517e8e413&status=published&limit=1'
```

```json
{
  "data": [
    {
      "id": "1ca40393-f487-4b65-a200-f3481a9c51ff",
      "title": "Nova at the Roundhouse",
      "mediaUrl": null,
      "thumbnailImageUrl": null,
      "publishedAt": "2026-08-01T20:00:00Z",
      "authorId": "06e81078-a59e-484d-a984-3c335e2cf3f2",
      "articleTypeId": "f9ca3b6f-d83d-40d1-87cc-3e0517e8e413",
      "author": {
        "id": "06e81078-a59e-484d-a984-3c335e2cf3f2",
        "username": "nova",
        "isArtist": true,
        "profilePictureUrl": "https://cdn.divacast.example/nova.jpg"
      },
      "articleType": {
        "id": "f9ca3b6f-d83d-40d1-87cc-3e0517e8e413",
        "name": "review",
        "description": "Critical assessment of a release, performance or venue."
      }
    }
  ],
  "page": { "limit": 1, "offset": 0, "total": 1 }
}
```

Note the absent `body` in the list row, and that `total` reflects the filter.
