/**
 * divacast API — types and a minimal typed client.
 *
 * The interfaces below are GENERATED from docs/openapi.json. Regenerate them
 * rather than editing by hand:
 *
 *     make openapi      # re-exports docs/openapi.json + these types
 *
 * Base URL (Cloud Functions 1st gen, us-central1):
 *     https://us-central1-divacast.cloudfunctions.net/divacast-api
 *
 * Every path below except /v1 and /v1/healthz needs a Firebase ID token.
 */

// ---------------------------------------------------------------- envelopes

/** Single-resource response: every 200/201 body. */
export interface ItemResponse<T> {
  data: T;
}

/** Collection response: every list body. */
export interface ListResponse<T> {
  data: T[];
  page: PageMeta;
}

export interface PageMeta {
  limit: number;
  offset: number;
  /** Rows matching the filter, not the page size. */
  total: number;
}

/** One field-level problem inside an error body. */
export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorBody {
  code: ErrorCode;
  message: string;
  details: ErrorDetail[];
  /** Echoed in the x-request-id header; quote it in a bug report. */
  requestId: string | null;
}

/** Every non-2xx body. */
export interface ErrorResponse {
  error: ErrorBody;
}

export type ErrorCode =
  | "validation_error"      // 400
  | "unauthenticated"       // 401 — refresh the ID token and retry
  | "forbidden"             // 403 — token is fine, the answer will not change
  | "not_found"             // 404
  | "method_not_allowed"    // 405
  | "conflict"              // 409 — a unique value is taken
  | "unprocessable_entity"  // 422 — referenced row missing, or delete blocked
  | "internal_error"        // 500
  | "service_unavailable";  // 503 — database unreachable

// ------------------------------------------------------------- list params

export type SortOrder = "asc" | "desc";

/** Accepted by every list endpoint. */
export interface PageQuery {
  /** 1–100. Default 20. */
  limit?: number;
  /** >= 0. Default 0. */
  offset?: number;
  /** Must be one of that entity's sortable keys. */
  sort?: string;
  /** Default "desc". */
  order?: SortOrder;
}

/** Articles scheduled for the future are in NEITHER bucket. */
export type PublishStatus = "published" | "draft";

// --------------------------------------------------------- generated types

export interface ArticleCreate {
  title: string;
  body: string;
  authorId: string;
  articleTypeId: string;
  mediaUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: string | null;
}

export interface ArticleDetail {
  id: string;
  title: string;
  body: string;
  mediaUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: string | null;
  authorId: string;
  articleTypeId: string;
  author: UserSummary;
  articleType: ArticleTypeSummary;
}

export interface ArticleListItem {
  id: string;
  title: string;
  mediaUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: string | null;
  authorId: string;
  articleTypeId: string;
  author: UserSummary;
  articleType: ArticleTypeSummary;
}

export interface ArticleOut {
  id: string;
  title: string;
  body: string;
  mediaUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: string | null;
  authorId: string;
  articleTypeId: string;
}

export interface ArticlePatch {
  title?: string | null;
  body?: string | null;
  authorId?: string | null;
  articleTypeId?: string | null;
  mediaUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: string | null;
}

export interface ArticleTypeCreate {
  name: string;
  description?: string | null;
}

export interface ArticleTypeOut {
  id: string;
  name: string;
  description?: string | null;
}

export interface ArticleTypePatch {
  name?: string | null;
  description?: string | null;
}

export interface ArticleTypeSummary {
  id: string;
  name: string;
  description?: string | null;
}

export interface EngagementCreate {
  type: string;
  commentText?: string | null;
  userId: string;
  postId: string;
}

export interface EngagementOut {
  id: string;
  type: string;
  commentText: string | null;
  userId: string;
  postId: string;
}

export interface EngagementPatch {
  type?: string | null;
  commentText?: string | null;
}

export interface FollowCreate {
  followerId: string;
  followedId: string;
}

export interface FollowOut {
  followerId: string;
  followedId: string;
  follower: UserSummary;
  followed: UserSummary;
}

export interface MusicCreate {
  title: string;
  audioUrl: string;
  singerId: string;
  duration?: number | null;
  albumArtUrl?: string | null;
}

export interface MusicDetail {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number | null;
  albumArtUrl?: string | null;
  singerId: string;
  singer: UserSummary;
}

export interface MusicOut {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number | null;
  albumArtUrl?: string | null;
  singerId: string;
}

export interface MusicPatch {
  title?: string | null;
  audioUrl?: string | null;
  singerId?: string | null;
  duration?: number | null;
  albumArtUrl?: string | null;
}

export interface PostCreate {
  type: string;
  contentUrl: string;
  authorId: string;
  title?: string | null;
  description?: string | null;
  createdAt?: string | null;
}

export interface PostDetail {
  id: string;
  type: string;
  contentUrl: string;
  title?: string | null;
  description?: string | null;
  createdAt?: string | null;
  authorId: string;
  author: UserSummary;
}

export interface PostOut {
  id: string;
  type: string;
  contentUrl: string;
  title?: string | null;
  description?: string | null;
  createdAt?: string | null;
  authorId: string;
}

export interface PostPatch {
  type?: string | null;
  contentUrl?: string | null;
  authorId?: string | null;
  title?: string | null;
  description?: string | null;
  createdAt?: string | null;
}

export interface UserCreate {
  username: string;
  email: string;
  isArtist: boolean;
  bio?: string | null;
  profilePictureUrl?: string | null;
  socialLinks?: string | null;
}

export interface UserOut {
  id: string;
  username: string;
  isArtist: boolean;
  profilePictureUrl?: string | null;
  email: string;
  bio?: string | null;
  socialLinks?: string | null;
}

export interface UserPatch {
  username?: string | null;
  email?: string | null;
  isArtist?: boolean | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  socialLinks?: string | null;
}

export interface UserSummary {
  id: string;
  username: string;
  isArtist: boolean;
  profilePictureUrl?: string | null;
}

// ------------------------------------------------------------------ client

export const DIVACAST_BASE_URL =
  "https://us-central1-divacast.cloudfunctions.net/divacast-api";

/** Thrown for every non-2xx response, carrying the parsed error envelope. */
export class DivacastError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details: ErrorDetail[];
  readonly requestId: string | null;

  constructor(status: number, body: ErrorBody) {
    super(body.message);
    this.name = "DivacastError";
    this.status = status;
    this.code = body.code;
    this.details = body.details ?? [];
    this.requestId = body.requestId ?? null;
  }

  /** True when retrying with a fresh ID token is worth it. */
  get isRetryableAuth(): boolean {
    return this.code === "unauthenticated";
  }
}

export interface DivacastClientOptions {
  baseUrl?: string;
  /**
   * Returns a current Firebase ID token, or null when signed out.
   * Pass `() => getAuth().currentUser?.getIdToken() ?? null` — the Firebase SDK
   * refreshes a token that is close to expiry, so call it per request rather
   * than caching the string yourself.
   */
  getIdToken: () => Promise<string | null>;
}

/**
 * Internal: any object of query parameters. Deliberately `object` rather than
 * `Record<string, ...>` — TypeScript gives interfaces no implicit index
 * signature, so the typed `PageQuery & {...}` arguments below would not be
 * assignable to a Record. Values are stringified; null and undefined dropped.
 */
type QueryParams = object;

function queryString(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.append(key, String(value));
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

export class DivacastClient {
  private readonly baseUrl: string;
  private readonly getIdToken: () => Promise<string | null>;

  constructor(options: DivacastClientOptions) {
    this.baseUrl = (options.baseUrl ?? DIVACAST_BASE_URL).replace(/\/$/, "");
    this.getIdToken = options.getIdToken;
  }

  async request<T>(
    method: string,
    path: string,
    init: { query?: QueryParams; body?: unknown } = {},
  ): Promise<T> {
    const token = await this.getIdToken();
    const headers: Record<string, string> = {};
    if (token) headers["authorization"] = `Bearer ${token}`;
    if (init.body !== undefined) headers["content-type"] = "application/json";

    const response = await fetch(
      `${this.baseUrl}${path}${queryString(init.query)}`,
      {
        method,
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
      },
    );

    // 204 No Content: every successful DELETE.
    if (response.status === 204) return undefined as T;

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const body = (payload as ErrorResponse | null)?.error;
      throw new DivacastError(
        response.status,
        body ?? {
          code: "internal_error",
          message: `HTTP ${response.status}`,
          details: [],
          requestId: response.headers.get("x-request-id"),
        },
      );
    }
    return payload as T;
  }

  // -- users ---------------------------------------------------------------
  listUsers = (q?: PageQuery & { isArtist?: boolean; q?: string }) =>
    this.request<ListResponse<UserOut>>("GET", "/v1/users", { query: q });
  getUser = (id: string) =>
    this.request<ItemResponse<UserOut>>("GET", `/v1/users/${id}`);
  /** Creates YOUR profile — firebaseUid comes from the token, never the body. */
  createUser = (body: UserCreate) =>
    this.request<ItemResponse<UserOut>>("POST", "/v1/users", { body });
  updateUser = (id: string, body: UserPatch) =>
    this.request<ItemResponse<UserOut>>("PATCH", `/v1/users/${id}`, { body });
  /** Cascades: removes your music, posts, articles, engagements and follows. */
  deleteUser = (id: string) => this.request<void>("DELETE", `/v1/users/${id}`);

  // -- music ---------------------------------------------------------------
  listMusic = (q?: PageQuery & { singerId?: string; q?: string }) =>
    this.request<ListResponse<MusicDetail>>("GET", "/v1/music", { query: q });
  getMusic = (id: string, expand: "singer" | "none" = "singer") =>
    this.request<ItemResponse<MusicDetail | MusicOut>>("GET", `/v1/music/${id}`, {
      query: { expand },
    });
  createMusic = (body: MusicCreate) =>
    this.request<ItemResponse<MusicOut>>("POST", "/v1/music", { body });
  updateMusic = (id: string, body: MusicPatch) =>
    this.request<ItemResponse<MusicOut>>("PATCH", `/v1/music/${id}`, { body });
  deleteMusic = (id: string) => this.request<void>("DELETE", `/v1/music/${id}`);

  // -- posts ---------------------------------------------------------------
  listPosts = (
    q?: PageQuery & {
      authorId?: string;
      type?: string;
      createdFrom?: string;
      createdTo?: string;
    },
  ) => this.request<ListResponse<PostDetail>>("GET", "/v1/posts", { query: q });
  getPost = (id: string, expand: "author" | "none" = "author") =>
    this.request<ItemResponse<PostDetail | PostOut>>("GET", `/v1/posts/${id}`, {
      query: { expand },
    });
  createPost = (body: PostCreate) =>
    this.request<ItemResponse<PostOut>>("POST", "/v1/posts", { body });
  updatePost = (id: string, body: PostPatch) =>
    this.request<ItemResponse<PostOut>>("PATCH", `/v1/posts/${id}`, { body });
  deletePost = (id: string) => this.request<void>("DELETE", `/v1/posts/${id}`);

  // -- follows -------------------------------------------------------------
  listFollows = (q?: PageQuery & { followerId?: string; followedId?: string }) =>
    this.request<ListResponse<FollowOut>>("GET", "/v1/follows", { query: q });
  getFollow = (followerId: string, followedId: string) =>
    this.request<ItemResponse<FollowOut>>(
      "GET",
      `/v1/follows/${followerId}/${followedId}`,
    );
  /** followerId must be you. Following yourself is a 400. */
  createFollow = (body: FollowCreate) =>
    this.request<ItemResponse<FollowOut>>("POST", "/v1/follows", { body });
  deleteFollow = (followerId: string, followedId: string) =>
    this.request<void>("DELETE", `/v1/follows/${followerId}/${followedId}`);

  // -- engagements ---------------------------------------------------------
  listEngagements = (
    q?: PageQuery & { postId?: string; userId?: string; type?: string },
  ) =>
    this.request<ListResponse<EngagementOut>>("GET", "/v1/engagements", {
      query: q,
    });
  getEngagement = (id: string) =>
    this.request<ItemResponse<EngagementOut>>("GET", `/v1/engagements/${id}`);
  /** commentText is required when type === "comment", forbidden otherwise. */
  createEngagement = (body: EngagementCreate) =>
    this.request<ItemResponse<EngagementOut>>("POST", "/v1/engagements", { body });
  updateEngagement = (id: string, body: EngagementPatch) =>
    this.request<ItemResponse<EngagementOut>>("PATCH", `/v1/engagements/${id}`, {
      body,
    });
  deleteEngagement = (id: string) =>
    this.request<void>("DELETE", `/v1/engagements/${id}`);

  // -- article types -------------------------------------------------------
  listArticleTypes = (q?: PageQuery) =>
    this.request<ListResponse<ArticleTypeOut>>("GET", "/v1/article-types", {
      query: q,
    });
  getArticleType = (id: string) =>
    this.request<ItemResponse<ArticleTypeOut>>("GET", `/v1/article-types/${id}`);
  /** Admin only (the `admin` custom claim). Reads are open to any signed-in user. */
  createArticleType = (body: ArticleTypeCreate) =>
    this.request<ItemResponse<ArticleTypeOut>>("POST", "/v1/article-types", {
      body,
    });
  updateArticleType = (id: string, body: ArticleTypePatch) =>
    this.request<ItemResponse<ArticleTypeOut>>(
      "PATCH",
      `/v1/article-types/${id}`,
      { body },
    );
  deleteArticleType = (id: string) =>
    this.request<void>("DELETE", `/v1/article-types/${id}`);

  // -- articles ------------------------------------------------------------
  /** List rows carry NO `body` — fetch one article to read it. */
  listArticles = (
    q?: PageQuery & {
      authorId?: string;
      articleTypeId?: string;
      q?: string;
      publishedFrom?: string;
      publishedTo?: string;
      status?: PublishStatus;
    },
  ) =>
    this.request<ListResponse<ArticleListItem>>("GET", "/v1/articles", {
      query: q,
    });
  getArticle = (id: string, expand: "all" | "none" = "all") =>
    this.request<ItemResponse<ArticleDetail | ArticleOut>>(
      "GET",
      `/v1/articles/${id}`,
      { query: { expand } },
    );
  createArticle = (body: ArticleCreate) =>
    this.request<ItemResponse<ArticleOut>>("POST", "/v1/articles", { body });
  updateArticle = (id: string, body: ArticlePatch) =>
    this.request<ItemResponse<ArticleOut>>("PATCH", `/v1/articles/${id}`, { body });
  deleteArticle = (id: string) =>
    this.request<void>("DELETE", `/v1/articles/${id}`);

  /** Same list contract as listArticles, scoped to one type. Unknown type => 404. */
  listArticlesOfType = (
    articleTypeId: string,
    q?: PageQuery & {
      authorId?: string;
      q?: string;
      publishedFrom?: string;
      publishedTo?: string;
      status?: PublishStatus;
    },
  ) =>
    this.request<ListResponse<ArticleListItem>>(
      "GET",
      `/v1/article-types/${articleTypeId}/articles`,
      { query: q },
    );

  // -- meta ----------------------------------------------------------------
  /** No token required. Round-trips to the database; 503 when it is unreachable. */
  healthz = () =>
    this.request<ItemResponse<{ status: "ok" }>>("GET", "/v1/healthz");
}
