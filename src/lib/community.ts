export interface SteamOwnedGame {
  appId: number
  name: string
  playtimeHours: number
  iconUrl: string | null
}

export interface UserProfileExtras {
  steamProfileUrl: string
  steamId: string
  steamApiKey: string
  steamGames: SteamOwnedGame[]
  steamLastSyncAt: string | null
  playedGameSlugs: string[]
}

export interface GameComment {
  id: string
  gameSlug: string
  userEmail: string
  userName: string
  rating: number
  content: string
  createdAt: string
}

const PROFILES_KEY = 'gn_user_profiles_v1'
const COMMENTS_KEY = 'gn_game_comments_v1'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function profileDefaults(): UserProfileExtras {
  return {
    steamProfileUrl: '',
    steamId: '',
    steamApiKey: '',
    steamGames: [],
    steamLastSyncAt: null,
    playedGameSlugs: [],
  }
}

type ProfileStore = Record<string, UserProfileExtras>
type CommentStore = Record<string, GameComment[]>

export function getUserProfileExtras(email: string): UserProfileExtras {
  const store = readJson<ProfileStore>(PROFILES_KEY, {})
  return store[email] ?? profileDefaults()
}

function updateUserProfileExtras(email: string, updater: (value: UserProfileExtras) => UserProfileExtras) {
  const store = readJson<ProfileStore>(PROFILES_KEY, {})
  const current = store[email] ?? profileDefaults()
  store[email] = updater(current)
  writeJson(PROFILES_KEY, store)
}

export function saveSteamConnection(email: string, payload: { steamProfileUrl: string; steamId: string; steamApiKey: string }) {
  updateUserProfileExtras(email, (current) => ({
    ...current,
    steamProfileUrl: payload.steamProfileUrl,
    steamId: payload.steamId,
    steamApiKey: payload.steamApiKey,
  }))
}

export function saveSteamGames(email: string, games: SteamOwnedGame[]) {
  updateUserProfileExtras(email, (current) => ({
    ...current,
    steamGames: [...games].sort((a, b) => b.playtimeHours - a.playtimeHours),
    steamLastSyncAt: new Date().toISOString(),
  }))
}

export function isPlayedInSiteGames(email: string, slug: string) {
  return getUserProfileExtras(email).playedGameSlugs.includes(slug)
}

export function togglePlayedInSiteGames(email: string, slug: string) {
  let nextValue = false
  updateUserProfileExtras(email, (current) => {
    const exists = current.playedGameSlugs.includes(slug)
    nextValue = !exists
    return {
      ...current,
      playedGameSlugs: exists
        ? current.playedGameSlugs.filter((value) => value !== slug)
        : [...current.playedGameSlugs, slug],
    }
  })
  return nextValue
}

export function getGameComments(gameSlug: string) {
  const store = readJson<CommentStore>(COMMENTS_KEY, {})
  return [...(store[gameSlug] ?? [])].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function addGameComment(payload: Omit<GameComment, 'id' | 'createdAt'>) {
  const store = readJson<CommentStore>(COMMENTS_KEY, {})
  const comment: GameComment = {
    ...payload,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  }
  store[payload.gameSlug] = [comment, ...(store[payload.gameSlug] ?? [])]
  writeJson(COMMENTS_KEY, store)
  return comment
}

export function deleteGameComment(gameSlug: string, commentId: string, userEmail: string) {
  const store = readJson<CommentStore>(COMMENTS_KEY, {})
  const list = store[gameSlug] ?? []
  store[gameSlug] = list.filter((comment) => !(comment.id === commentId && comment.userEmail === userEmail))
  writeJson(COMMENTS_KEY, store)
}

export function getCommentsByUser(userEmail: string) {
  const normalized = userEmail.trim().toLowerCase()
  if (!normalized) return []

  const store = readJson<CommentStore>(COMMENTS_KEY, {})
  return Object.values(store)
    .flat()
    .filter((comment) => comment.userEmail.toLowerCase() === normalized)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
