import { create } from 'zustand'

import { divacast } from '@/api/client'
import {
  DivacastError,
  type ArticleCreate,
  type ArticleListItem,
  type ArticleOut,
  type ArticlePatch,
  type ArticleTypeOut,
  type EngagementCreate,
  type EngagementOut,
  type EngagementPatch,
  type FollowCreate,
  type FollowOut,
  type ListResponse,
  type MusicCreate,
  type MusicDetail,
  type MusicOut,
  type MusicPatch,
  type PageMeta,
  type PageQuery,
  type PostCreate,
  type PostDetail,
  type PostOut,
  type PostPatch,
  type PublishStatus,
  type UserCreate,
  type UserOut,
  type UserPatch,
} from '@/api/divacast-api'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface ListSlice<T> {
  items: T[]
  page: PageMeta | null
  status: Status
  error: string | null
}

interface ItemSlice<T> {
  data: T | null
  status: Status
  error: string | null
}

type MusicQuery = PageQuery & { singerId?: string; q?: string }

type UserQuery = PageQuery & { isArtist?: boolean; q?: string }

type PostQuery = PageQuery & {
  authorId?: string
  type?: string
  createdFrom?: string
  createdTo?: string
}

type ArticleQuery = PageQuery & {
  authorId?: string
  articleTypeId?: string
  q?: string
  publishedFrom?: string
  publishedTo?: string
  status?: PublishStatus
}

const errorMessage = (error: unknown): string =>
  error instanceof DivacastError ? error.message : 'Unexpected error'

const listLoading = <T,>(slice: ListSlice<T>): ListSlice<T> => ({
  ...slice,
  status: 'loading',
  error: null,
})

const listFailed = <T,>(slice: ListSlice<T>, error: unknown): ListSlice<T> => ({
  ...slice,
  status: 'error',
  error: errorMessage(error),
})

const listLoaded = <T,>(
  slice: ListSlice<T>,
  response: ListResponse<T>,
): ListSlice<T> => ({
  items: response.data,
  page: response.page,
  status: 'success',
  error: null,
})

const itemLoading = <T,>(slice: ItemSlice<T>): ItemSlice<T> => ({
  ...slice,
  status: 'loading',
  error: null,
})

const itemFailed = <T,>(slice: ItemSlice<T>, error: unknown): ItemSlice<T> => ({
  ...slice,
  status: 'error',
  error: errorMessage(error),
})

const itemLoaded = <T,>(slice: ItemSlice<T>, data: T): ItemSlice<T> => ({
  data,
  status: 'success',
  error: null,
})

const listSlice = <T,>(): ListSlice<T> => ({
  items: [],
  page: null,
  status: 'idle',
  error: null,
})

const itemSlice = <T,>(): ItemSlice<T> => ({
  data: null,
  status: 'idle',
  error: null,
})

interface ApiState {
  music: ListSlice<MusicDetail>
  musicDetail: ItemSlice<MusicDetail>
  users: ListSlice<UserOut>
  user: ItemSlice<UserOut>
  posts: ListSlice<PostDetail>
  postDetail: ItemSlice<PostDetail>
  articleTypes: ListSlice<ArticleTypeOut>
  articles: ListSlice<ArticleListItem>
  follows: ListSlice<FollowOut>
  engagements: ListSlice<EngagementOut>
  /** Latest mutation failure, surfaced as a toast. */
  error: string | null

  clearError: () => void
  /** Clears every slice back to idle — call it on sign-out. */
  reset: () => void

  // -- music ---------------------------------------------------------------
  fetchMusic: (query?: MusicQuery) => Promise<void>
  fetchMusicTrack: (id: string) => Promise<void>
  createMusic: (body: MusicCreate) => Promise<MusicOut | null>
  updateMusic: (id: string, body: MusicPatch) => Promise<MusicOut | null>
  deleteMusic: (id: string) => Promise<boolean>

  // -- users ---------------------------------------------------------------
  fetchUsers: (query?: UserQuery) => Promise<void>
  fetchUser: (id: string) => Promise<void>
  /** Creates YOUR profile — firebaseUid comes from the token, never the body. */
  createUser: (body: UserCreate) => Promise<UserOut | null>
  updateUser: (id: string, body: UserPatch) => Promise<UserOut | null>
  deleteUser: (id: string) => Promise<boolean>

  // -- posts ---------------------------------------------------------------
  fetchPosts: (query?: PostQuery) => Promise<void>
  fetchPost: (id: string) => Promise<void>
  createPost: (body: PostCreate) => Promise<PostOut | null>
  updatePost: (id: string, body: PostPatch) => Promise<PostOut | null>
  deletePost: (id: string) => Promise<boolean>

  // -- follows -------------------------------------------------------------
  fetchFollows: (followerId: string) => Promise<void>
  follow: (body: FollowCreate) => Promise<FollowOut | null>
  unfollow: (followerId: string, followedId: string) => Promise<boolean>

  // -- engagements ---------------------------------------------------------
  fetchEngagements: (postId: string) => Promise<void>
  like: (postId: string, userId: string) => Promise<EngagementOut | null>
  comment: (
    postId: string,
    userId: string,
    commentText: string,
  ) => Promise<EngagementOut | null>
  updateEngagement: (
    id: string,
    body: EngagementPatch,
  ) => Promise<EngagementOut | null>
  deleteEngagement: (id: string) => Promise<boolean>

  // -- article types -------------------------------------------------------
  fetchArticleTypes: () => Promise<void>

  // -- articles ------------------------------------------------------------
  fetchArticles: (query?: ArticleQuery) => Promise<void>
  /** Returns the created row; articles lists carry author/type summaries. */
  createArticle: (body: ArticleCreate) => Promise<ArticleOut | null>
  updateArticle: (id: string, body: ArticlePatch) => Promise<ArticleOut | null>
  deleteArticle: (id: string) => Promise<boolean>
}

const initialState = {
  music: listSlice<MusicDetail>(),
  musicDetail: itemSlice<MusicDetail>(),
  users: listSlice<UserOut>(),
  user: itemSlice<UserOut>(),
  posts: listSlice<PostDetail>(),
  postDetail: itemSlice<PostDetail>(),
  articleTypes: listSlice<ArticleTypeOut>(),
  articles: listSlice<ArticleListItem>(),
  follows: listSlice<FollowOut>(),
  engagements: listSlice<EngagementOut>(),
  error: null,
}

export const useApiStore = create<ApiState>()((set) => ({
  ...initialState,

  clearError: () => set({ error: null }),

  reset: () => set(initialState),

  // -- music ---------------------------------------------------------------
  fetchMusic: async (query) => {
    set((state) => ({ music: listLoading(state.music) }))
    try {
      const response = await divacast.listMusic(query)
      set((state) => ({ music: listLoaded(state.music, response) }))
    } catch (error) {
      set((state) => ({ music: listFailed(state.music, error) }))
    }
  },

  fetchMusicTrack: async (id) => {
    set((state) => ({ musicDetail: itemLoading(state.musicDetail) }))
    try {
      // expand defaults to "singer", so the body is a MusicDetail at runtime.
      const { data } = await divacast.getMusic(id)
      set((state) => ({
        musicDetail: itemLoaded(state.musicDetail, data as MusicDetail),
      }))
    } catch (error) {
      set((state) => ({ musicDetail: itemFailed(state.musicDetail, error) }))
    }
  },

  createMusic: async (body) => {
    try {
      const { data } = await divacast.createMusic(body)
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  updateMusic: async (id, body) => {
    try {
      const { data } = await divacast.updateMusic(id, body)
      set((state) => ({
        music: {
          ...state.music,
          items: state.music.items.map((track) =>
            track.id === id ? { ...track, ...data } : track,
          ),
        },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  deleteMusic: async (id) => {
    try {
      await divacast.deleteMusic(id)
      set((state) => ({
        music: {
          ...state.music,
          items: state.music.items.filter((track) => track.id !== id),
        },
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },

  // -- users ---------------------------------------------------------------
  fetchUsers: async (query) => {
    set((state) => ({ users: listLoading(state.users) }))
    try {
      const response = await divacast.listUsers(query)
      set((state) => ({ users: listLoaded(state.users, response) }))
    } catch (error) {
      set((state) => ({ users: listFailed(state.users, error) }))
    }
  },

  fetchUser: async (id) => {
    set((state) => ({ user: itemLoading(state.user) }))
    try {
      const { data } = await divacast.getUser(id)
      set((state) => ({ user: itemLoaded(state.user, data) }))
    } catch (error) {
      set((state) => ({ user: itemFailed(state.user, error) }))
    }
  },

  createUser: async (body) => {
    try {
      const { data } = await divacast.createUser(body)
      set((state) => ({
        user: itemLoaded(state.user, data),
        users: { ...state.users, items: [data, ...state.users.items] },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  updateUser: async (id, body) => {
    try {
      const { data } = await divacast.updateUser(id, body)
      set((state) => ({
        user: state.user.data?.id === id ? itemLoaded(state.user, data) : state.user,
        users: {
          ...state.users,
          items: state.users.items.map((u) => (u.id === id ? { ...u, ...data } : u)),
        },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  deleteUser: async (id) => {
    try {
      await divacast.deleteUser(id)
      set((state) => ({
        users: {
          ...state.users,
          items: state.users.items.filter((u) => u.id !== id),
        },
        user: state.user.data?.id === id ? itemSlice<UserOut>() : state.user,
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },

  // -- posts ---------------------------------------------------------------
  fetchPosts: async (query) => {
    set((state) => ({ posts: listLoading(state.posts) }))
    try {
      const response = await divacast.listPosts(query)
      set((state) => ({ posts: listLoaded(state.posts, response) }))
    } catch (error) {
      set((state) => ({ posts: listFailed(state.posts, error) }))
    }
  },

  fetchPost: async (id) => {
    set((state) => ({ postDetail: itemLoading(state.postDetail) }))
    try {
      // expand defaults to "author", so the body is a PostDetail at runtime.
      const { data } = await divacast.getPost(id)
      set((state) => ({ postDetail: itemLoaded(state.postDetail, data as PostDetail) }))
    } catch (error) {
      set((state) => ({ postDetail: itemFailed(state.postDetail, error) }))
    }
  },

  createPost: async (body) => {
    try {
      const { data } = await divacast.createPost(body)
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  updatePost: async (id, body) => {
    try {
      const { data } = await divacast.updatePost(id, body)
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  deletePost: async (id) => {
    try {
      await divacast.deletePost(id)
      set((state) => ({
        posts: {
          ...state.posts,
          items: state.posts.items.filter((post) => post.id !== id),
        },
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },

  // -- follows -------------------------------------------------------------
  fetchFollows: async (followerId) => {
    set((state) => ({ follows: listLoading(state.follows) }))
    try {
      const response = await divacast.listFollows({ followerId })
      set((state) => ({ follows: listLoaded(state.follows, response) }))
    } catch (error) {
      set((state) => ({ follows: listFailed(state.follows, error) }))
    }
  },

  follow: async (body) => {
    try {
      const { data } = await divacast.createFollow(body)
      set((state) => ({
        follows: { ...state.follows, items: [...state.follows.items, data] },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  unfollow: async (followerId, followedId) => {
    try {
      await divacast.deleteFollow(followerId, followedId)
      set((state) => ({
        follows: {
          ...state.follows,
          items: state.follows.items.filter(
            (follow) =>
              follow.followerId !== followerId || follow.followedId !== followedId,
          ),
        },
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },

  // -- engagements ---------------------------------------------------------
  fetchEngagements: async (postId) => {
    set((state) => ({ engagements: listLoading(state.engagements) }))
    try {
      const response = await divacast.listEngagements({ postId })
      set((state) => ({ engagements: listLoaded(state.engagements, response) }))
    } catch (error) {
      set((state) => ({ engagements: listFailed(state.engagements, error) }))
    }
  },

  like: async (postId, userId) => {
    const body: EngagementCreate = { type: 'like', userId, postId }
    try {
      const { data } = await divacast.createEngagement(body)
      set((state) => ({
        engagements: { ...state.engagements, items: [...state.engagements.items, data] },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  comment: async (postId, userId, commentText) => {
    const body: EngagementCreate = {
      type: 'comment',
      commentText,
      userId,
      postId,
    }
    try {
      const { data } = await divacast.createEngagement(body)
      set((state) => ({
        engagements: { ...state.engagements, items: [...state.engagements.items, data] },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  updateEngagement: async (id, body) => {
    try {
      const { data } = await divacast.updateEngagement(id, body)
      set((state) => ({
        engagements: {
          ...state.engagements,
          items: state.engagements.items.map((engagement) =>
            engagement.id === id ? { ...engagement, ...data } : engagement,
          ),
        },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  deleteEngagement: async (id) => {
    try {
      await divacast.deleteEngagement(id)
      set((state) => ({
        engagements: {
          ...state.engagements,
          items: state.engagements.items.filter((engagement) => engagement.id !== id),
        },
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },

  // -- article types -------------------------------------------------------
  fetchArticleTypes: async () => {
    set((state) => ({ articleTypes: listLoading(state.articleTypes) }))
    try {
      const response = await divacast.listArticleTypes()
      set((state) => ({ articleTypes: listLoaded(state.articleTypes, response) }))
    } catch (error) {
      set((state) => ({ articleTypes: listFailed(state.articleTypes, error) }))
    }
  },

  // -- articles ------------------------------------------------------------
  fetchArticles: async (query) => {
    set((state) => ({ articles: listLoading(state.articles) }))
    try {
      const response = await divacast.listArticles(query)
      set((state) => ({ articles: listLoaded(state.articles, response) }))
    } catch (error) {
      set((state) => ({ articles: listFailed(state.articles, error) }))
    }
  },

  createArticle: async (body) => {
    try {
      const { data } = await divacast.createArticle(body)
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  updateArticle: async (id, body) => {
    try {
      const { data } = await divacast.updateArticle(id, body)
      set((state) => ({
        articles: {
          ...state.articles,
          items: state.articles.items.map((article) =>
            article.id === id
              ? {
                  ...article,
                  title: data.title,
                  mediaUrl: data.mediaUrl,
                  thumbnailImageUrl: data.thumbnailImageUrl,
                  publishedAt: data.publishedAt,
                }
              : article,
          ),
        },
      }))
      return data
    } catch (error) {
      set({ error: errorMessage(error) })
      return null
    }
  },

  deleteArticle: async (id) => {
    try {
      await divacast.deleteArticle(id)
      set((state) => ({
        articles: {
          ...state.articles,
          items: state.articles.items.filter((article) => article.id !== id),
        },
      }))
      return true
    } catch (error) {
      set({ error: errorMessage(error) })
      return false
    }
  },
}))

export const useApi = () => useApiStore((state) => state)

// Music
export const useMusic = () => useApiStore((state) => state.music)

export const useMusicTrack = () => useApiStore((state) => state.musicDetail)

// Users
export const useUsers = () => useApiStore((state) => state.users)

export const useCurrentUser = () => useApiStore((state) => state.user)

// Posts
export const usePosts = () => useApiStore((state) => state.posts)

export const usePost = () => useApiStore((state) => state.postDetail)

// Follows
export const useFollows = () => useApiStore((state) => state.follows)

// Engagements
export const useEngagements = () => useApiStore((state) => state.engagements)

// Articles
export const useArticleTypes = () => useApiStore((state) => state.articleTypes)

export const useArticles = () => useApiStore((state) => state.articles)
