import { tgaCurrentAwardsYear, tgaCurrentCategoryAwards, tgaYearRecords } from '../data/tgaAwards'

export interface GameAwardTag {
  year: number
  category: string
}

export interface GameAwardSummary {
  gotyWinnerYears: number[]
  gotyNomineeYears: number[]
  categoryWins: GameAwardTag[]
  categoryNominations: GameAwardTag[]
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function titleMatch(candidate: string, title: string) {
  const a = normalize(candidate)
  const b = normalize(title)
  if (!a || !b) return false
  return a === b || a.includes(b) || b.includes(a)
}

function isGameCategory(category: string) {
  const key = normalize(category)
  const blocked = [
    'esports',
    'contentcreator',
    'bestperformance',
    'adaptation',
    'playersvoice',
    'studentgame',
    'host',
    'moment',
    'player',
  ]
  if (blocked.some((item) => key.includes(item))) return false

  const allowed = [
    'gameoftheyear',
    'gamedirection',
    'narrative',
    'artdirection',
    'scoreandmusic',
    'audiodesign',
    'innovationinaccessibility',
    'gamesforimpact',
    'ongoing',
    'communitysupport',
    'indie',
    'debutindie',
    'mobile',
    'vrar',
    'actionadventure',
    'action',
    'rpg',
    'fighting',
    'family',
    'simstrategy',
    'sportsracing',
    'multiplayer',
    'anticipated',
  ]
  return allowed.some((item) => key.includes(item))
}

export function getGameAwardSummary(title: string): GameAwardSummary {
  const summary: GameAwardSummary = {
    gotyWinnerYears: [],
    gotyNomineeYears: [],
    categoryWins: [],
    categoryNominations: [],
  }

  for (const yearRecord of tgaYearRecords) {
    if (yearRecord.gameOfTheYear.winner && titleMatch(yearRecord.gameOfTheYear.winner, title)) {
      summary.gotyWinnerYears.push(yearRecord.year)
    }

    if (yearRecord.gameOfTheYear.nominees.some((nominee) => titleMatch(nominee, title))) {
      summary.gotyNomineeYears.push(yearRecord.year)
    }

    for (const winner of yearRecord.categoryWinners) {
      if (!isGameCategory(winner.category)) continue
      if (titleMatch(winner.game, title)) {
        summary.categoryWins.push({
          year: yearRecord.year,
          category: winner.category,
        })
      }
    }
  }

  for (const category of tgaCurrentCategoryAwards) {
    if (!isGameCategory(category.category)) continue
    if (category.winner && titleMatch(category.winner, title)) {
      summary.categoryWins.push({ year: tgaCurrentAwardsYear, category: category.category })
    }
    for (const nominee of category.nominees) {
      if (titleMatch(nominee, title)) {
        summary.categoryNominations.push({ year: tgaCurrentAwardsYear, category: category.category })
      }
    }
  }

  return summary
}

export function getAwardedGamesLeaderboard(limit = 10) {
  const counter = new Map<string, { title: string; wins: number }>()

  for (const yearRecord of tgaYearRecords) {
    for (const winner of yearRecord.categoryWinners) {
      if (!isGameCategory(winner.category)) continue
      const key = normalize(winner.game)
      if (!key) continue
      const current = counter.get(key)
      if (current) {
        current.wins += 1
      } else {
        counter.set(key, { title: winner.game, wins: 1 })
      }
    }
  }

  for (const category of tgaCurrentCategoryAwards) {
    if (!isGameCategory(category.category)) continue
    if (!category.winner) continue
    const key = normalize(category.winner)
    if (!key) continue
    const current = counter.get(key)
    if (current) {
      current.wins += 1
    } else {
      counter.set(key, { title: category.winner, wins: 1 })
    }
  }

  return [...counter.values()].sort((a, b) => b.wins - a.wins).slice(0, limit)
}

export interface TgaCatalogItem {
  title: string
  wins: number
  nominations: number
}

export function getAllTgaGamesCatalog() {
  const map = new Map<string, TgaCatalogItem>()

  const touch = (title: string, isWin: boolean) => {
    const key = normalize(title)
    if (!key) return
    const current = map.get(key)
    if (current) {
      current.wins += isWin ? 1 : 0
      current.nominations += isWin ? 0 : 1
      return
    }
    map.set(key, {
      title: title.trim(),
      wins: isWin ? 1 : 0,
      nominations: isWin ? 0 : 1,
    })
  }

  for (const yearRecord of tgaYearRecords) {
    if (yearRecord.gameOfTheYear.winner) touch(yearRecord.gameOfTheYear.winner, true)
    for (const nominee of yearRecord.gameOfTheYear.nominees) touch(nominee, false)
    for (const winner of yearRecord.categoryWinners) {
      if (!isGameCategory(winner.category)) continue
      touch(winner.game, true)
    }
  }

  for (const category of tgaCurrentCategoryAwards) {
    if (!isGameCategory(category.category)) continue
    if (category.winner) touch(category.winner, true)
    for (const nominee of category.nominees) touch(nominee, false)
  }

  return [...map.values()].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.nominations !== a.nominations) return b.nominations - a.nominations
    return a.title.localeCompare(b.title)
  })
}
