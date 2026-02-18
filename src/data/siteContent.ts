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

export interface GameGenre {
  slug: string
  label: string
  badge: string
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
    source: 'AllAroundGame Editor',
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

export const gameGenres: GameGenre[] = [
  { slug: 'pinball', label: 'Pinball', badge: 'PB' },
  { slug: 'platform', label: 'Platform', badge: 'PL' },
  { slug: 'puzzle', label: 'Puzzle', badge: 'PZ' },
  { slug: 'racing-driving', label: 'Racing/Driving', badge: 'RD' },
  { slug: 'roguelike', label: 'Roguelike', badge: 'RG' },
  { slug: 'role-playing', label: 'Role-Playing', badge: 'RP' },
  { slug: 'sandbox', label: 'Sandbox', badge: 'SB' },
  { slug: 'shooter', label: 'Shooter', badge: 'SH' },
  { slug: 'simulation', label: 'Simulation', badge: 'SM' },
  { slug: 'social', label: 'Social', badge: 'SC' },
  { slug: 'sports', label: 'Sports', badge: 'SP' },
  { slug: 'stealth', label: 'Stealth', badge: 'ST' },
  { slug: 'strategy-tactical', label: 'Strategy/Tactical', badge: 'TT' },
  { slug: 'survival', label: 'Survival', badge: 'SV' },
  { slug: 'tower-defense', label: 'Tower Defense', badge: 'TD' },
  { slug: 'trivia', label: 'Trivia', badge: 'TV' },
  { slug: 'vehicular-combat', label: 'Vehicular Combat', badge: 'VC' },
  { slug: 'visual-novel', label: 'Visual Novel', badge: 'VN' },
  { slug: 'management', label: 'Management', badge: 'MG' },
  { slug: 'music-rhythm', label: 'Music/Rhythm', badge: 'MR' },
  { slug: 'open-world', label: 'Open World', badge: 'OW' },
  { slug: 'interactive-art', label: 'Interactive Art', badge: 'IA' },
]

const genreTitlePools: Record<string, string[]> = {
  'pinball': ['Pinball FX', 'Pinball FX3', 'Yoku\'s Island Express', 'Demon\'s Tilt', 'Xenotilt', 'Pinball M', 'Pinball Arcade', 'Sonic Spinball'],
  'platform': ['Celeste', 'Hollow Knight', 'Ori and the Blind Forest', 'Ori and the Will of the Wisps', 'Super Meat Boy', 'Little Nightmares II', 'Rayman Legends', 'Crash Bandicoot 4'],
  'puzzle': ['Portal 2', 'The Talos Principle 2', 'Baba Is You', 'The Witness', 'Tetris Effect Connected', 'Unpacking', 'Viewfinder', 'Cocoon'],
  'racing-driving': ['Forza Horizon 5', 'Gran Turismo 7', 'Need for Speed Unbound', 'Forza Motorsport', 'Assetto Corsa Competizione', 'EA Sports WRC', 'Trackmania', 'Wreckfest'],
  'roguelike': ['Hades', 'Hades II', 'Dead Cells', 'Risk of Rain 2', 'The Binding of Isaac Rebirth', 'Enter the Gungeon', 'Rogue Legacy 2', 'Slay the Spire'],
  'role-playing': ['Baldur\'s Gate 3', 'The Witcher 3 Wild Hunt', 'Cyberpunk 2077', 'Persona 5 Royal', 'Elden Ring', 'Dragon\'s Dogma 2', 'Disco Elysium', 'Divinity Original Sin 2'],
  'sandbox': ['Minecraft', 'Terraria', 'Garry\'s Mod', 'Satisfactory', 'Teardown', 'Trailmakers', 'People Playground', 'Besiege'],
  'shooter': ['Call of Duty Black Ops 6', 'Counter-Strike 2', 'Valorant', 'Rainbow Six Siege', 'DOOM Eternal', 'Battlefield 2042', 'Apex Legends', 'Titanfall 2'],
  'simulation': ['Euro Truck Simulator 2', 'Microsoft Flight Simulator', 'The Sims 4', 'House Flipper 2', 'PowerWash Simulator', 'Goat Simulator 3', 'Car Mechanic Simulator 2021', 'Train Sim World 4'],
  'social': ['Among Us', 'Fall Guys', 'VRChat', 'Rec Room', 'Roblox', 'Party Animals', 'Pummel Party', 'Gartic Phone'],
  'sports': ['EA Sports FC 25', 'NBA 2K25', 'WWE 2K24', 'F1 24', 'Madden NFL 25', 'MLB The Show 24', 'NHL 24', 'TopSpin 2K25'],
  'stealth': ['Metal Gear Solid V The Phantom Pain', 'Hitman World of Assassination', 'Dishonored 2', 'Splinter Cell Blacklist', 'Thief', 'Mark of the Ninja', 'Aragami 2', 'A Plague Tale Requiem'],
  'strategy-tactical': ['Civilization VI', 'Total War Warhammer III', 'Age of Empires IV', 'XCOM 2', 'Crusader Kings III', 'Hearts of Iron IV', 'Into the Breach', 'Desperados III'],
  'survival': ['Valheim', 'Rust', 'The Forest', 'Sons of the Forest', 'Subnautica', 'ARK Survival Ascended', 'Don\'t Starve Together', 'Raft'],
  'tower-defense': ['Plants vs Zombies', 'Bloons TD 6', 'Kingdom Rush', 'Defense Grid 2', 'Orcs Must Die 3', 'Dungeon Defenders Awakened', 'They Are Billions', 'Iron Brigade'],
  'trivia': ['Trivia Crack', 'You Don\'t Know Jack', 'Who Wants to Be a Millionaire', 'Fibbage 4', 'Jeopardy', 'Quiz Planet', 'Knowledge is Power', 'Logo Quiz'],
  'vehicular-combat': ['Twisted Metal', 'Crossout', 'Rocket League', 'Mad Max', 'War Thunder', 'World of Tanks', 'Carmageddon Max Damage', 'Intergalactic Road Warriors'],
  'visual-novel': ['Doki Doki Literature Club Plus', 'Steins Gate', 'Phoenix Wright Ace Attorney Trilogy', 'Clannad', 'The House in Fata Morgana', 'VA-11 Hall-A', 'AI The Somnium Files', 'Coffee Talk'],
  'management': ['Football Manager 2024', 'Cities Skylines II', 'Planet Zoo', 'Two Point Hospital', 'Two Point Campus', 'Game Dev Tycoon', 'F1 Manager 2024', 'Anno 1800'],
  'music-rhythm': ['Hi-Fi Rush', 'Crypt of the NecroDancer', 'Metal Hellsinger', 'Beat Saber', 'Taiko no Tatsujin Rhythm Festival', 'Muse Dash', 'Rhythm Doctor', 'Thumper'],
  'open-world': ['The Elder Scrolls V Skyrim', 'Grand Theft Auto V', 'Red Dead Redemption 2', 'The Legend of Zelda Tears of the Kingdom', 'Horizon Forbidden West', 'Assassin\'s Creed Mirage', 'Far Cry 6', 'Ghost of Tsushima'],
  'interactive-art': ['Journey', 'Abzu', 'Gris', 'The Artful Escape', 'Before Your Eyes', 'Gorogoa', 'Flower', 'Sky Children of the Light'],
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

const baseGames: BaseGameItem[] = gameGenres.flatMap((genre, index) =>
  createGenreGames(
    genre.slug,
    genre.label,
    2026 - (index % 4),
    Number((7.2 + ((index % 6) * 0.12)).toFixed(1)),
    genreTitlePools[genre.slug] ?? [],
  ),
)

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
