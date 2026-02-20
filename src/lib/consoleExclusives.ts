import { consoleExclusiveNintendo } from '../data/consoleExclusiveNintendo'
import { consoleExclusivePlaystation } from '../data/consoleExclusivePlaystation'
import { consoleExclusiveXbox } from '../data/consoleExclusiveXbox'
import type { PlatformFamily } from './platformTheme'

export interface ConsoleExclusiveGame {
  slug: string
  title: string
  release_year: number
  platforms: readonly string[]
  platform_family: PlatformFamily
  is_exclusive: true
  exclusive_type: 'full' | 'console' | 'timed' | 'platform'
  exclusive_until: string | null
  image_url: string | null
  sources: readonly string[]
}

export const allConsoleExclusiveGames: ConsoleExclusiveGame[] = [
  ...consoleExclusivePlaystation,
  ...consoleExclusiveXbox,
  ...consoleExclusiveNintendo,
] as ConsoleExclusiveGame[]

export function getConsoleExclusiveGamesByPlatform(platformFamily: PlatformFamily) {
  return allConsoleExclusiveGames
    .filter((game) => game.platform_family === platformFamily && game.is_exclusive === true)
    .sort((a, b) => a.release_year - b.release_year || a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))
}
