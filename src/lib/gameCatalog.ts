import type { GameGenre, GameItem } from '../data/siteContent'
import type { PlatformFamily } from './platformTheme'

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function rankGame(game: GameItem) {
  return (
    (game.metacriticScore ?? 0) * 100 +
    game.releaseYear * 10 +
    Math.round(game.score * 10)
  )
}

export function dedupeGamesByTitle(items: GameItem[]) {
  const map = new Map<string, GameItem>()

  for (const game of items) {
    const key = normalizeTitle(game.title)
    const current = map.get(key)
    if (!current || rankGame(game) > rankGame(current)) {
      map.set(key, game)
    }
  }

  return [...map.values()]
}

export function filterGenresWithGames(genres: GameGenre[], items: GameItem[]) {
  const genresWithGames = new Set(items.map((game) => game.genre))
  return genres.filter((genre) => genresWithGames.has(genre.slug))
}

export function getExclusiveGamesByPlatform(items: GameItem[], platformFamily: PlatformFamily) {
  return dedupeGamesByTitle(
    items
      .filter((game) => game.is_exclusive === true && game.platform_family === platformFamily)
      .sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' })),
  )
}
