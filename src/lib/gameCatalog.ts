import type { GameItem } from '../data/siteContent'

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
