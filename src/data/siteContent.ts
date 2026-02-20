import { gameExternalData } from './gameExternalData'
import { gameExpansionTitles } from './gameExpansionTitles'
import { realGameCatalog } from './realGameCatalog'

export type Platform = 'pc' | 'ps' | 'xbox' | 'nintendo'

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
  { slug: 'puzzle', label: 'Bulmaca', badge: 'PZ' },
  { slug: 'racing-driving', label: 'Yarış / Sürüş', badge: 'RD' },
  { slug: 'roguelike', label: 'Roguelike', badge: 'RG' },
  { slug: 'role-playing', label: 'Rol Yapma', badge: 'RP' },
  { slug: 'sandbox', label: 'Sandbox', badge: 'SB' },
  { slug: 'shooter', label: 'Nişancı', badge: 'SH' },
  { slug: 'simulation', label: 'Simülasyon', badge: 'SM' },
  { slug: 'social', label: 'Sosyal', badge: 'SC' },
  { slug: 'sports', label: 'Spor', badge: 'SP' },
  { slug: 'stealth', label: 'Gizlilik', badge: 'ST' },
  { slug: 'strategy-tactical', label: 'Strateji / Taktik', badge: 'TT' },
  { slug: 'survival', label: 'Hayatta Kalma', badge: 'SV' },
  { slug: 'tower-defense', label: 'Kule Savunmasi', badge: 'TD' },
  { slug: 'trivia', label: 'Bilgi Yarışması', badge: 'TV' },
  { slug: 'vehicular-combat', label: 'Aracli Catismali', badge: 'VC' },
  { slug: 'visual-novel', label: 'Görsel Roman', badge: 'VN' },
  { slug: 'management', label: 'Yonetim', badge: 'MG' },
  { slug: 'music-rhythm', label: 'Muzik / Ritim', badge: 'MR' },
  { slug: 'open-world', label: 'Acik Dunya', badge: 'OW' },
  { slug: 'interactive-art', label: 'Etkilesimli Sanat', badge: 'IA' },
  { slug: 'first-person-shooter', label: 'Birinci Şahıs Nişancı', badge: 'FPS' },
  { slug: 'third-person-shooter', label: 'Üçüncü Şahıs Nişancı', badge: 'TPS' },
  { slug: 'hack-slash', label: 'Hack & Slash', badge: 'HS' },
  { slug: 'metroidvania', label: 'Metroidvania', badge: 'MV' },
  { slug: 'action-rpg', label: 'Aksiyon Rol Yapma', badge: 'ARPG' },
  { slug: 'jrpg', label: 'JRPG', badge: 'JRPG' },
  { slug: 'turn-based-rpg', label: 'Sıra Tabanlı Rol Yapma', badge: 'TRPG' },
  { slug: 'party-based-rpg', label: 'Parti Tabanli Rol Yapma', badge: 'PRPG' },
  { slug: 'turn-based-strategy', label: 'Sıra Tabanlı Strateji', badge: 'TBS' },
  { slug: 'real-time-strategy', label: 'Gercek Zamanli Strateji', badge: 'RTS' },
  { slug: 'city-builder', label: 'Sehir Kurma', badge: 'CB' },
  { slug: 'grand-strategy-4x', label: 'Buyuk Strateji ve 4X', badge: '4X' },
  { slug: 'card-board', label: 'Kart ve Kutu', badge: 'CBG' },
  { slug: 'sports-manager', label: 'Spor Menajerligi', badge: 'SMG' },
  { slug: 'racing-simulation', label: 'Yarış Simülasyonu', badge: 'RSM' },
  { slug: 'fishing-hunting', label: 'Balikcilik ve Avlanma', badge: 'FH' },
  { slug: 'mystery-detective', label: 'Gizem ve Dedektiflik', badge: 'MD' },
  { slug: 'sci-fi-cyberpunk', label: 'Bilim Kurgu ve Cyberpunk', badge: 'SFC' },
  { slug: 'anime', label: 'Anime', badge: 'AN' },
  { slug: 'casual', label: 'Basit Eglence', badge: 'CS' },
  { slug: 'hidden-object', label: 'Gizli Nesne', badge: 'HO' },
  { slug: 'horror', label: 'Korku', badge: 'HR' },
  { slug: 'birinci-sahis-nisanci', label: 'Birinci Şahıs Nişancı', badge: 'B1N' },
  { slug: 'ucuncu-sahis-nisanci', label: 'Üçüncü Şahıs Nişancı', badge: 'U3N' },
  { slug: 'arcade-ve-ritim', label: 'Arcade ve Ritim', badge: 'AVR' },
  { slug: 'platform-ve-runner', label: 'Platform ve Runner', badge: 'PVR' },
  { slug: 'shoot-em-up', label: 'Shoot Em Up', badge: 'SEU' },
  { slug: 'dovus-ve-dovus-sanatlari', label: 'Dovus ve Dovus Sanatlari', badge: 'DDS' },
  { slug: 'gizli-nesne', label: 'Gizli Nesne', badge: 'GN' },
  { slug: 'basit-eglence', label: 'Basit Eglence', badge: 'BE' },
  { slug: 'macera-ryo', label: 'Macera RYO', badge: 'MRYO' },
  { slug: 'gorsel-romanlar', label: 'Görsel Romanlar', badge: 'GR' },
  { slug: 'zengin-hikaye', label: 'Zengin Hikaye', badge: 'ZH' },
  { slug: 'aksiyon-rol-yapma', label: 'Aksiyon Rol Yapma', badge: 'ARY' },
  { slug: 'strateji-ve-taktiksel-rol-yapma', label: 'Strateji ve Taktiksel Rol Yapma', badge: 'STRP' },
  { slug: 'jryo', label: 'JRYO', badge: 'JRYO' },
  { slug: 'rogue-like-ve-rogue-lite', label: 'Rogue-Like ve Rogue-Lite', badge: 'RLRL' },
  { slug: 'sira-tabanli-rol-yapma', label: 'Sıra Tabanlı Rol Yapma', badge: 'STRY' },
  { slug: 'parti-tabanli', label: 'Parti Tabanli', badge: 'PT' },
  { slug: 'insa-ve-otomasyon-simulatorleri', label: 'Insa ve Otomasyon Simulatorleri', badge: 'IOS' },
  { slug: 'hobi-ve-is-simulatorleri', label: 'Hobi ve Is Simulatorleri', badge: 'HIS' },
  { slug: 'iliski-simulatorleri', label: 'Iliski Simulatorleri', badge: 'ILS' },
  { slug: 'ciftcilik-ve-uretim-simulatorleri', label: 'Ciftcilik ve Uretim Simulatorleri', badge: 'CUS' },
  { slug: 'uzay-ve-ucus-simulatorleri', label: 'Uzay ve Ucus Simulatorleri', badge: 'UUS' },
  { slug: 'yasam-ve-surukleyici-simulasyonlar', label: 'Yaşam ve Sürükleyici Simülasyonlar', badge: 'YSS' },
  { slug: 'sandbox-ve-fizik-simulasyonlari', label: 'Sandbox ve Fizik Simülasyonları', badge: 'SFS' },
  { slug: 'sira-tabanli-strateji', label: 'Sıra Tabanlı Strateji', badge: 'STS' },
  { slug: 'gercek-zamanli-strateji', label: 'Gercek Zamanli Strateji', badge: 'GZS' },
  { slug: 'kule-savunmasi', label: 'Kule Savunmasi', badge: 'KS' },
  { slug: 'kart-ve-kutu', label: 'Kart ve Kutu', badge: 'KVK' },
  { slug: 'sehir-ve-yerlesim-insasi-oyunlari', label: 'Şehir ve Yerleşim İnşası Oyunları', badge: 'SYI' },
  { slug: 'buyuk-strateji-ve-4x', label: 'Buyuk Strateji ve 4X', badge: 'B4X' },
  { slug: 'askeri-strateji', label: 'Askerî Strateji', badge: 'AS' },
  { slug: 'spor-simulatorleri-ve-menajerligi', label: 'Spor Simülatörleri ve Menajerliği', badge: 'SSM' },
  { slug: 'yaris', label: 'Yarış', badge: 'YR' },
  { slug: 'yaris-simulasyonu', label: 'Yarış Simülasyonu', badge: 'YS' },
  { slug: 'balikcilik-ve-avlanma', label: 'Balikcilik ve Avlanma', badge: 'BVA' },
  { slug: 'takim-sporlari', label: 'Takim Sporlari', badge: 'TSP' },
  { slug: 'bireysel-sporlar', label: 'Bireysel Sporlar', badge: 'BSP' },
  { slug: 'bilim-kurgu-ve-cyberpunk', label: 'Bilim Kurgu ve Cyberpunk', badge: 'BKC' },
  { slug: 'bosluk', label: 'Bosluk', badge: 'BOS' },
  { slug: 'hayatta-kalma', label: 'Hayatta Kalma', badge: 'HK' },
  { slug: 'gizem-ve-dedektiflik', label: 'Gizem ve Dedektiflik', badge: 'GVD' },
  { slug: 'yetiskinlere-ozel', label: 'Yetiskinlere Ozel', badge: '18+' },
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

const extraGenreTitlePools: Record<string, string[]> = {
  'pinball': ['Metroid Prime Pinball', 'Pinball Dreams', 'Pinball Hall of Fame'],
  'platform': ['Super Mario Odyssey', 'Sackboy A Big Adventure', 'Astro Bot'],
  'puzzle': ['The Turing Test', 'Superliminal', 'The Pedestrian'],
  'racing-driving': ['Burnout Paradise Remastered', 'GRID Legends', 'Project CARS 2'],
  'roguelike': ['Vampire Survivors', 'Noita', 'Spelunky 2'],
  'role-playing': ['Final Fantasy X', 'Kingdom Hearts II', 'Mass Effect 2'],
  'sandbox': ['No Mans Sky', 'Stardew Valley', 'Subnautica Below Zero'],
  'shooter': ['Half-Life 2', 'Halo 3', 'BioShock Infinite'],
  'simulation': ['The Sims 2', 'Microsoft Flight Simulator X', 'Farming Simulator 22'],
  'social': ['Lethal Company', 'Jackbox Party Pack 3', 'Goose Goose Duck'],
  'sports': ['Pro Evolution Soccer 6', 'FIFA 12', 'EA Sports FC 24'],
  'stealth': ['Metal Gear Solid 3 Snake Eater', 'Splinter Cell Chaos Theory', 'Hitman Blood Money'],
  'strategy-tactical': ['Warcraft III', 'Command and Conquer Generals', 'Age of Mythology'],
  'survival': ['DayZ', 'Project Zomboid', 'The Long Dark'],
  'tower-defense': ['GemCraft Chasing Shadows', 'Sanctum 2', 'Defense Grid The Awakening'],
  'trivia': ['Buzz Quiz TV', 'Trivia Pursuit Live', 'Knowledge Master'],
  'vehicular-combat': ['Twisted Metal Black', 'Vigilante 8 2nd Offense', 'Destruction AllStars'],
  'visual-novel': ['The Great Ace Attorney Chronicles', '428 Shibuya Scramble', 'Chaos Child'],
  'management': ['RollerCoaster Tycoon 3', 'Theme Hospital', 'Prison Architect'],
  'music-rhythm': ['Guitar Hero III Legends of Rock', 'DJMax Respect V', 'osu!'],
  'open-world': ['The Legend of Zelda Breath of the Wild', 'Spider-Man Miles Morales', 'Sleeping Dogs Definitive Edition'],
  'interactive-art': ['The Unfinished Swan', 'Bound', 'Sayonara Wild Hearts'],
}

const genrePoolAliases: Record<string, string> = {
  'first-person-shooter': 'shooter',
  'third-person-shooter': 'shooter',
  'hack-slash': 'role-playing',
  'metroidvania': 'platform',
  'action-rpg': 'role-playing',
  'jrpg': 'role-playing',
  'turn-based-rpg': 'role-playing',
  'party-based-rpg': 'role-playing',
  'turn-based-strategy': 'strategy-tactical',
  'real-time-strategy': 'strategy-tactical',
  'city-builder': 'management',
  'grand-strategy-4x': 'strategy-tactical',
  'card-board': 'trivia',
  'sports-manager': 'sports',
  'racing-simulation': 'racing-driving',
  'fishing-hunting': 'survival',
  'mystery-detective': 'puzzle',
  'sci-fi-cyberpunk': 'open-world',
  'anime': 'visual-novel',
  'casual': 'social',
  'hidden-object': 'puzzle',
  'horror': 'survival',
  'birinci-sahis-nisanci': 'shooter',
  'ucuncu-sahis-nisanci': 'shooter',
  'arcade-ve-ritim': 'music-rhythm',
  'platform-ve-runner': 'platform',
  'shoot-em-up': 'shooter',
  'dovus-ve-dovus-sanatlari': 'vehicular-combat',
  'gizli-nesne': 'puzzle',
  'basit-eglence': 'social',
  'macera-ryo': 'role-playing',
  'gorsel-romanlar': 'visual-novel',
  'zengin-hikaye': 'role-playing',
  'aksiyon-rol-yapma': 'role-playing',
  'strateji-ve-taktiksel-rol-yapma': 'strategy-tactical',
  'jryo': 'role-playing',
  'rogue-like-ve-rogue-lite': 'roguelike',
  'sira-tabanli-rol-yapma': 'role-playing',
  'parti-tabanli': 'role-playing',
  'insa-ve-otomasyon-simulatorleri': 'management',
  'hobi-ve-is-simulatorleri': 'simulation',
  'iliski-simulatorleri': 'social',
  'ciftcilik-ve-uretim-simulatorleri': 'simulation',
  'uzay-ve-ucus-simulatorleri': 'simulation',
  'yasam-ve-surukleyici-simulasyonlar': 'simulation',
  'sandbox-ve-fizik-simulasyonlari': 'sandbox',
  'sira-tabanli-strateji': 'strategy-tactical',
  'gercek-zamanli-strateji': 'strategy-tactical',
  'kule-savunmasi': 'tower-defense',
  'kart-ve-kutu': 'trivia',
  'sehir-ve-yerlesim-insasi-oyunlari': 'management',
  'buyuk-strateji-ve-4x': 'strategy-tactical',
  'askeri-strateji': 'strategy-tactical',
  'spor-simulatorleri-ve-menajerligi': 'sports',
  'yaris': 'racing-driving',
  'yaris-simulasyonu': 'racing-driving',
  'balikcilik-ve-avlanma': 'survival',
  'takim-sporlari': 'sports',
  'bireysel-sporlar': 'sports',
  'bilim-kurgu-ve-cyberpunk': 'open-world',
  'bosluk': 'simulation',
  'hayatta-kalma': 'survival',
  'gizem-ve-dedektiflik': 'puzzle',
  'yetiskinlere-ozel': 'visual-novel',
}

const allGenreTitlePools: Record<string, string[]> = Object.fromEntries([
  ...Object.entries(genreTitlePools).map(([slug, titles]) => [slug, [...titles, ...(extraGenreTitlePools[slug] ?? [])]]),
  ...Object.entries(genrePoolAliases).map(([slug, source]) => [
    slug,
    [...(genreTitlePools[source] ?? []), ...(extraGenreTitlePools[source] ?? [])],
  ]),
])

function normalizeTitleKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

const releaseYearByTitle = new Map<string, number>()
for (const item of realGameCatalog) {
  const key = normalizeTitleKey(item[0])
  const prev = releaseYearByTitle.get(key)
  if (!key) continue
  if (!prev || item[1] < prev) {
    releaseYearByTitle.set(key, item[1])
  }
}

const manualReleaseYearOverrides: Record<string, number> = {
  'portal2': 2011,
  'thetalosprinciple2': 2023,
  'baldursgate3': 2023,
}

for (const [key, year] of Object.entries(manualReleaseYearOverrides)) {
  releaseYearByTitle.set(key, year)
}

function uniqueTitles(titles: string[]) {
  const seen = new Set<string>()
  const out: string[] = []

  for (const title of titles) {
    if (!title) continue
    const key = normalizeTitleKey(title)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(title)
  }

  return out
}

const MIN_GAMES_PER_GENRE = 50

function hashSeed(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

function ensureMinimumUniqueFromPool(
  titles: string[],
  minCount: number,
  fallbackPool: string[],
  seedKey: string,
) {
  const unique = uniqueTitles(titles)
  if (unique.length >= minCount) return unique.slice(0, minCount)

  const seen = new Set(unique)
  const pool = uniqueTitles(fallbackPool)
  if (pool.length === 0) return unique

  const seed = hashSeed(seedKey) % pool.length
  for (let i = 0; unique.length < minCount && i < pool.length; i += 1) {
    const title = pool[(seed + i) % pool.length]
    if (!seen.has(title)) {
      seen.add(title)
      unique.push(title)
    }
  }

  return unique
}

function sourceGenreOf(slug: string) {
  return genrePoolAliases[slug] ?? slug
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

function titleFromSlugKey(slug: string) {
  return slug
    .split('-')
    .map((part) => {
      if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(part)) return part.toUpperCase()
      if (/^\d+$/.test(part)) return part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

function inferGenreFromTitle(title: string): string {
  const t = title.toLowerCase()
  if (/fifa|nba|nhl|madden|wrc|f1 |topspin|mlb|football|tennis|ufc|skate|golf/.test(t)) return 'sports'
  if (/forza|gran turismo|need for speed|assetto|trackmania|motogp|ride |nascar|kart/.test(t)) return 'racing-driving'
  if (/resident evil|silent hill|outlast|amnesia|alan wake|dead space|horror|mortuary/.test(t)) return 'horror'
  if (/counter-strike|valorant|doom|battlefield|call of duty|halo|titanfall|apex|overwatch|rainbow six|wolfenstein/.test(t)) return 'shooter'
  if (/civilization|total war|xcom|crusader kings|hearts of iron|strategy|anno|factorio|rimworld/.test(t)) return 'strategy-tactical'
  if (/baldur|witcher|cyberpunk|persona|elden ring|final fantasy|dragon|fallout|skyrim|rpg/.test(t)) return 'role-playing'
  if (/portal|talos principle|witness|tetris|cocoon|viewfinder|baba is you|puzzle/.test(t)) return 'puzzle'
  if (/hades|dead cells|rogue|slay the spire|binding of isaac/.test(t)) return 'roguelike'
  if (/zelda|gta|red dead|assassin|far cry|ghost of tsushima|horizon/.test(t)) return 'open-world'
  if (/cities skylines|planet zoo|truck simulator|flight simulator|sims|house flipper|simulator/.test(t)) return 'simulation'
  if (/journey|abzu|gris|artful escape|flower/.test(t)) return 'interactive-art'
  return 'open-world'
}

function buildExternalGenreTitlePools() {
  const buckets: Record<string, string[]> = {}

  for (const [slug] of externalDataEntries) {
    const title = titleFromSlugKey(slug)
    const genre = inferGenreFromTitle(title)
    if (!buckets[genre]) buckets[genre] = []
    buckets[genre].push(title)
  }

  return buckets
}

const externalGenreTitlePools = buildExternalGenreTitlePools()

const sourceScopedTitlePools: Record<string, string[]> = Object.fromEntries(
  uniqueTitles(gameGenres.map((g) => sourceGenreOf(g.slug))).map((source) => {
    const scoped = uniqueTitles([
      ...Object.entries(allGenreTitlePools)
        .filter(([slug]) => sourceGenreOf(slug) === source)
        .flatMap(([, titles]) => titles),
      ...(externalGenreTitlePools[source] ?? []),
    ])
    return [source, scoped]
  }),
)

const ensuredGenreTitlePools: Record<string, string[]> = Object.fromEntries(
  Object.entries(allGenreTitlePools).map(([slug, titles]) => {
    const sourceSlug = sourceGenreOf(slug)
    const merged = [
      ...titles,
      ...(externalGenreTitlePools[slug] ?? []),
      ...(externalGenreTitlePools[sourceSlug] ?? []),
    ]
    return [
      slug,
      ensureMinimumUniqueFromPool(
        merged,
        MIN_GAMES_PER_GENRE,
        sourceScopedTitlePools[sourceSlug] ?? merged,
        slug,
      ),
    ]
  }),
)

const generatedFromExternal: BaseGameItem[] = externalDataEntries.map(([slug, external], index) => {
  const title = titleFromSlugKey(slug)
  const genre = inferGenreFromTitle(title)
  const releaseYear = releaseYearByTitle.get(normalizeTitleKey(title)) ?? (2000 + (index % 26))
  const score = external.metacriticScore !== null
    ? Number((external.metacriticScore / 10).toFixed(1))
    : Number((7.0 + ((index % 15) * 0.1)).toFixed(1))

  return {
    slug,
    title,
    genre,
    platforms: platformSets[index % platformSets.length],
    releaseYear,
    score,
    summary: `${title}, genis oyun arsivimizde yer alan populer yapimlardan biri.`,
  }
})

const generatedFromRealCatalog: BaseGameItem[] = realGameCatalog.map((entry, index) => {
  const [title, releaseYear] = entry
  const genre = inferGenreFromTitle(title)
  return {
    slug: slugify(title),
    title,
    genre,
    platforms: platformSets[index % platformSets.length],
    releaseYear,
    score: Number((7.0 + ((index % 18) * 0.1)).toFixed(1)),
    summary: `${title}, genis oyun arsivimizde yer alan populer yapimlardan biri.`,
  }
})

const generatedFromExpansion: BaseGameItem[] = gameExpansionTitles.map((title, index) => {
  const genre = inferGenreFromTitle(title)
  return {
    slug: slugify(title),
    title,
    genre,
    platforms: platformSets[index % platformSets.length],
    releaseYear: releaseYearByTitle.get(normalizeTitleKey(title)) ?? (2000 + (index % 26)),
    score: Number((7.1 + ((index % 14) * 0.12)).toFixed(1)),
    summary: `${title}, genis oyun arsivimize yeni eklenen populer yapimlardan biri.`,
  }
})

const baseGames: BaseGameItem[] = gameGenres.flatMap((genre, index) =>
  createGenreGames(
    genre.slug,
    genre.label,
    2026 - (index % 4),
    Number((7.2 + ((index % 6) * 0.12)).toFixed(1)),
    ensuredGenreTitlePools[genre.slug] ?? [],
  ),
)

const mergedBaseGamesMap = new Map<string, BaseGameItem>()
for (const game of [...generatedFromRealCatalog, ...generatedFromExternal, ...generatedFromExpansion, ...baseGames]) {
  const titleKey = normalizeTitleKey(game.title)
  if (!titleKey) continue
  const existing = mergedBaseGamesMap.get(titleKey)
  if (!existing) {
    mergedBaseGamesMap.set(titleKey, game)
    continue
  }

  const existingYear = releaseYearByTitle.get(normalizeTitleKey(existing.title)) ?? existing.releaseYear
  const nextYear = releaseYearByTitle.get(titleKey) ?? game.releaseYear
  const existingScore = existing.score
  const nextScore = game.score
  const replace = nextScore > existingScore || (nextScore === existingScore && nextYear < existingYear)
  if (replace) {
    mergedBaseGamesMap.set(titleKey, game)
  }
}

const platformOverrides: Record<string, Platform[]> = {
  'the-talos-principle-2': ['pc', 'ps', 'xbox'],
}

const mergedBaseGames = [...mergedBaseGamesMap.values()].map((game) => {
  const key = slugify(game.title)
  const forced = platformOverrides[key]
  const correctedYear = releaseYearByTitle.get(normalizeTitleKey(game.title)) ?? game.releaseYear
  if (!forced) return { ...game, releaseYear: correctedYear }
  return { ...game, platforms: forced, releaseYear: correctedYear }
})

export const games: GameItem[] = mergedBaseGames.map((game) => {
  const external = resolveExternalData(game)
  const fallbackMetacriticUrl = `https://www.metacritic.com/search/${encodeURIComponent(game.title)}/?page=1&category=13`
  const fallbackHltbUrl = ''
  const fallbackGameSpotUrl = `https://www.gamespot.com/search/?q=${encodeURIComponent(game.title)}`

  return {
    ...game,
    ...(external ?? {
      metacriticScore: null,
      howLongToBeatMainHours: null,
      howLongToBeatMainExtraHours: null,
      howLongToBeatCompletionistHours: null,
      metacriticUrl: fallbackMetacriticUrl,
      howLongToBeatUrl: fallbackHltbUrl,
      gamespotArticleUrl: fallbackGameSpotUrl,
    }),
    metacriticUrl: external?.metacriticUrl || fallbackMetacriticUrl,
    howLongToBeatUrl: external?.howLongToBeatUrl || fallbackHltbUrl,
    gamespotArticleUrl: external?.gamespotArticleUrl || fallbackGameSpotUrl,
    youtubeTrailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${game.title} trailer`)}`,
    youtubeGameplayUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${game.title} gameplay`)}`,
  }
})

