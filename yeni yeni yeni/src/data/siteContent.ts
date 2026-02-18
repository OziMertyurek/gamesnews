import { gameExternalData } from './gameExternalData'

export type Platform = 'pc' | 'ps' | 'xbox' | 'nintendo'
export type StoreSlug = 'steam' | 'epic' | 'xbox'

export interface NewsItem {
  id: string
  title: string
  summary: string
  platform: Platform
  date: string
  source: string
  link: string
}

export interface StoreDeal {
  id: string
  store: StoreSlug
  gameTitle: string
  discountPercent: number
  salePriceTry: number
  originalPriceTry: number
  endsAt: string
  link: string
}

export interface GameItem {
  slug: string
  title: string
  genre: string
  platforms: Platform[]
  releaseYear: number
  score: number
  summary: string
  metacriticScore: number | null
  howLongToBeatMainHours: number | null
  howLongToBeatMainExtraHours: number | null
  howLongToBeatCompletionistHours: number | null
  metacriticUrl: string
  howLongToBeatUrl: string
  gamespotArticleUrl: string
  youtubeTrailerUrl: string
  youtubeGameplayUrl: string
}

type BaseGameItem = Omit<
  GameItem,
  | 'metacriticScore'
  | 'howLongToBeatMainHours'
  | 'howLongToBeatMainExtraHours'
  | 'howLongToBeatCompletionistHours'
  | 'metacriticUrl'
  | 'howLongToBeatUrl'
  | 'gamespotArticleUrl'
  | 'youtubeTrailerUrl'
  | 'youtubeGameplayUrl'
>

export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'Yeni sezon yama notlari yayinlandi',
    summary: 'Denge degisiklikleri, yeni harita rotasyonu ve performans iyilestirmeleri aciklandi.',
    platform: 'pc',
    date: '2026-02-14',
    source: 'GamesNews Editor',
    link: '#',
  },
]

export const storeDeals: StoreDeal[] = [
  {
    id: 's1',
    store: 'steam',
    gameTitle: 'Cyberpunk 2077',
    discountPercent: 55,
    salePriceTry: 539,
    originalPriceTry: 1199,
    endsAt: '2026-02-20',
    link: '#',
  },
]

const platformSets: Platform[][] = [
  ['pc', 'ps', 'xbox'],
  ['pc', 'xbox'],
  ['pc', 'ps'],
  ['pc', 'ps', 'xbox', 'nintendo'],
  ['ps', 'xbox', 'nintendo'],
  ['pc'],
]

const genreTitlePools: Record<string, string[]> = {
  action: [
    "God of War Ragnarok",
    "Devil May Cry 5",
    "Sekiro Shadows Die Twice",
    "Ghostrunner 2",
    "Marvel's Spider-Man 2",
    "Hi-Fi Rush",
    "Armored Core VI Fires of Rubicon",
    "Nier Automata",
    "Bayonetta 3",
    "Stellar Blade",
    "Sifu",
    "Metal Gear Rising Revengeance",
    "Batman Arkham Knight",
    "Assassin's Creed Mirage",
    "Star Wars Jedi Survivor",
    "Hades",
    "Hades II",
    "Control",
    "Sunset Overdrive",
    "Lies of P",
    "Ninja Gaiden Master Collection",
    "Doom Eternal",
    "Remnant II",
    "Ratchet and Clank Rift Apart",
    "Monster Hunter Rise",
    "Monster Hunter World",
    "Darksiders III",
    "Middle-earth Shadow of War",
    "Prince of Persia The Lost Crown",
    "Returnal",
  ],
  rpg: [
    "Baldur's Gate 3",
    "The Witcher 3 Wild Hunt",
    "Cyberpunk 2077",
    "Persona 5 Royal",
    "Divinity Original Sin 2",
    "Dragon Age Inquisition",
    "Kingdom Come Deliverance",
    "Final Fantasy VII Rebirth",
    "The Elder Scrolls V Skyrim",
    "Disco Elysium",
    "Elden Ring",
    "Mass Effect Legendary Edition",
    "Pathfinder Wrath of the Righteous",
    "Pillars of Eternity II Deadfire",
    "Dragon's Dogma 2",
    "Starfield",
    "Octopath Traveler II",
    "Xenoblade Chronicles 3",
    "Yakuza Like a Dragon",
    "Like a Dragon Infinite Wealth",
    "Diablo IV",
    "Grim Dawn",
    "Wasteland 3",
    "Fallout New Vegas",
    "Fallout 4",
    "Chrono Trigger",
    "Sea of Stars",
    "Tales of Arise",
    "Metaphor ReFantazio",
    "Kingdom Hearts III",
  ],
  strategy: [
    "Civilization VI",
    "Total War Warhammer III",
    "Age of Empires IV",
    "XCOM 2",
    "Crusader Kings III",
    "Stellaris",
    "Company of Heroes 3",
    "Frostpunk",
    "StarCraft II",
    "Into the Breach",
    "Hearts of Iron IV",
    "Europa Universalis IV",
    "Warcraft III Reforged",
    "Northgard",
    "Endless Legend",
    "Age of Wonders 4",
    "Phoenix Point",
    "Desperados III",
    "Shadow Tactics Blades of the Shogun",
    "Command and Conquer Remastered Collection",
    "Anno 1800",
    "Factorio",
    "RimWorld",
    "Dune Spice Wars",
    "Iron Harvest",
    "They Are Billions",
    "Total War Three Kingdoms",
    "Stronghold Definitive Edition",
    "Battle Brothers",
    "Against the Storm",
  ],
  sports: [
    "EA Sports FC 25",
    "NBA 2K25",
    "WWE 2K24",
    "F1 24",
    "PGA Tour 2K23",
    "TopSpin 2K25",
    "MLB The Show 24",
    "NHL 24",
    "Madden NFL 25",
    "eFootball 2025",
    "Rocket League",
    "Riders Republic",
    "Tony Hawk's Pro Skater 1+2",
    "Steep",
    "UFC 5",
    "Cricket 24",
    "Super Mega Baseball 4",
    "AO Tennis 2",
    "Tennis World Tour 2",
    "Golf With Your Friends",
    "Session Skate Sim",
    "Skater XL",
    "FIFA 23",
    "F1 Manager 2024",
    "Football Manager 2024",
    "Pro Cycling Manager 2024",
    "Descenders",
    "OlliOlli World",
    "PES 2021 Season Update",
    "NBA 2K24",
  ],
  racing: [
    "Forza Horizon 5",
    "Gran Turismo 7",
    "Need for Speed Unbound",
    "Forza Motorsport",
    "DiRT Rally 2.0",
    "Assetto Corsa Competizione",
    "The Crew Motorfest",
    "Mario Kart 8 Deluxe",
    "F1 23",
    "Hot Wheels Unleashed 2",
    "WRC Generations",
    "EA Sports WRC",
    "GRID Legends",
    "Project CARS 2",
    "Need for Speed Heat",
    "Burnout Paradise Remastered",
    "Trackmania",
    "Ride 5",
    "MotoGP 24",
    "KartRider Drift",
    "Test Drive Unlimited Solar Crown",
    "NASCAR Heat 5",
    "BeamNG.drive",
    "Automobilista 2",
    "iRacing",
    "Wreckfest",
    "Split Second",
    "Blur",
    "Sonic and All-Stars Racing Transformed",
    "Art of Rally",
  ],
  horror: [
    "Resident Evil 4",
    "Alan Wake 2",
    "Dead Space",
    "Amnesia The Bunker",
    "The Outlast Trials",
    "Phasmophobia",
    "Sons of the Forest",
    "Layers of Fear",
    "The Evil Within 2",
    "Silent Hill 2",
    "Resident Evil 2",
    "Resident Evil 7 Biohazard",
    "Resident Evil Village",
    "Fatal Frame Maiden of Black Water",
    "Alien Isolation",
    "Little Nightmares II",
    "Signalis",
    "Visage",
    "Madison",
    "Darkwood",
    "The Mortuary Assistant",
    "Until Dawn",
    "The Quarry",
    "Dying Light 2 Stay Human",
    "Left 4 Dead 2",
    "Dead by Daylight",
    "Killing Floor 2",
    "Scorn",
    "Martha Is Dead",
    "Outlast 2",
  ],
  shooter: [
    "Call of Duty Black Ops 6",
    "Counter-Strike 2",
    "Valorant",
    "Rainbow Six Siege",
    "DOOM Eternal",
    "Battlefield 2042",
    "Apex Legends",
    "Destiny 2",
    "Helldivers 2",
    "The Finals",
    "Overwatch 2",
    "Titanfall 2",
    "Escape from Tarkov",
    "Ready or Not",
    "PUBG Battlegrounds",
    "Fortnite",
    "Warframe",
    "Halo Infinite",
    "Wolfenstein II The New Colossus",
    "Far Cry 6",
    "Borderlands 3",
    "Deep Rock Galactic",
    "Arma 3",
    "Insurgency Sandstorm",
    "Quake Champions",
    "Splitgate",
    "Paladins",
    "XDefiant",
    "Payday 3",
    "Remnant From the Ashes",
  ],
  puzzle: [
    "Portal 2",
    "The Talos Principle 2",
    "Baba Is You",
    "The Witness",
    "Tetris Effect Connected",
    "HUMANITY",
    "Superliminal",
    "Unpacking",
    "Viewfinder",
    "Cocoon",
    "The Gardens Between",
    "Gorogoa",
    "Return of the Obra Dinn",
    "The Pedestrian",
    "Patrick's Parabox",
    "Q.U.B.E. 2",
    "The Turing Test",
    "Manifold Garden",
    "Monument Valley 2",
    "Dorfromantik",
    "World of Goo",
    "Mini Motorways",
    "Mini Metro",
    "Fez",
    "Braid Anniversary Edition",
    "The Swapper",
    "Inside",
    "Limbo",
    "We Were Here Forever",
    "It Takes Two",
  ],
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeLookup(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const legacySlugAliases: Record<string, string> = {
  'resident-evil-4': 'resident-evil-4-remake',
  'silent-hill-2': 'silent-hill-2-remake',
  'the-elder-scrolls-v-skyrim': 'skyrim-special-edition',
  'armored-core-vi-fires-of-rubicon': 'armored-core-vi',
}

const externalDataEntries = Object.entries(gameExternalData)

function resolveExternalData(game: BaseGameItem) {
  const titleSlug = slugify(game.title)
  const aliasSlug = legacySlugAliases[titleSlug]

  const direct =
    gameExternalData[game.slug] ??
    gameExternalData[titleSlug] ??
    (aliasSlug ? gameExternalData[aliasSlug] : undefined)

  if (direct) return direct

  const normalizedTitle = normalizeLookup(titleSlug)
  const normalizedGameSlug = normalizeLookup(game.slug)
  const fuzzyMatch = externalDataEntries.find(([key]) => {
    const normalizedKey = normalizeLookup(key)
    return (
      normalizedKey === normalizedTitle ||
      normalizedKey === normalizedGameSlug ||
      normalizedKey.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedKey)
    )
  })

  return fuzzyMatch?.[1]
}

function createGenreGames(genre: string, label: string, startYear: number, baseScore: number, titles: string[]): BaseGameItem[] {
  return titles.map((title, idx) => {
    const n = idx + 1
    return {
      slug: `${genre}-${String(n).padStart(2, '0')}-${slugify(title)}`,
      title,
      genre,
      platforms: platformSets[idx % platformSets.length],
      releaseYear: startYear - (idx % 8),
      score: Number((baseScore + ((idx % 5) * 0.2)).toFixed(1)),
      summary: `${title}, ${label.toLowerCase()} turunde oneri listesine eklenen populer yapimlardan biri.`,
    }
  })
}

const baseGames: BaseGameItem[] = [
  ...createGenreGames('action', 'Aksiyon', 2026, 7.8, genreTitlePools.action),
  ...createGenreGames('rpg', 'RPG', 2026, 8.0, genreTitlePools.rpg),
  ...createGenreGames('strategy', 'Strateji', 2025, 7.7, genreTitlePools.strategy),
  ...createGenreGames('sports', 'Spor', 2026, 7.6, genreTitlePools.sports),
  ...createGenreGames('racing', 'Yaris', 2025, 7.5, genreTitlePools.racing),
  ...createGenreGames('horror', 'Korku', 2025, 7.4, genreTitlePools.horror),
  ...createGenreGames('shooter', 'Nisanci', 2026, 7.7, genreTitlePools.shooter),
  ...createGenreGames('puzzle', 'Bulmaca', 2024, 7.3, genreTitlePools.puzzle),
]

export const games: GameItem[] = baseGames.map((game) => ({
  ...game,
  ...(resolveExternalData(game) ?? {
    metacriticScore: null,
    howLongToBeatMainHours: null,
    howLongToBeatMainExtraHours: null,
    howLongToBeatCompletionistHours: null,
    metacriticUrl: `https://www.metacritic.com/search/${encodeURIComponent(game.title)}/`,
    howLongToBeatUrl: `https://howlongtobeat.com/?q=${encodeURIComponent(game.title)}`,
    gamespotArticleUrl: `https://www.gamespot.com/search/?q=${encodeURIComponent(game.title)}`,
  }),
  youtubeTrailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${game.title} trailer`)}`,
  youtubeGameplayUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${game.title} gameplay`)}`,
}))
