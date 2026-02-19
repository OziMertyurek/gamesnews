import { Link } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  FaChessRook,
  FaFilm,
  FaGlobe,
  FaHatCowboy,
  FaMask,
  FaMusic,
  FaPersonRunning,
  FaPuzzlePiece,
  FaRegCircleQuestion,
  FaShieldHalved,
  FaSitemap,
  FaUsers,
} from 'react-icons/fa6'
import {
  GiCastle,
  GiCrossedSwords,
  GiJoystick,
  GiRaceCar,
  GiSandsOfTime,
  GiSoccerBall,
  GiSteeringWheel,
} from 'react-icons/gi'
import { MdOutlineArchitecture, MdOutlineDashboard, MdOutlinePsychology, MdSportsEsports } from 'react-icons/md'
import { gameGenres } from '../data/siteContent'

const genreVisuals: Record<
  string,
  { icon: IconType; chip: string; text: string; border: string; glow: string }
> = {
  'interactive-art': { icon: FaFilm, chip: 'from-fuchsia-500/25 to-pink-500/25', text: 'text-fuchsia-200', border: 'hover:border-fuchsia-500/70', glow: 'hover:shadow-fuchsia-500/20' },
  management: { icon: MdOutlineDashboard, chip: 'from-cyan-500/25 to-blue-500/25', text: 'text-cyan-200', border: 'hover:border-cyan-500/70', glow: 'hover:shadow-cyan-500/20' },
  'music-rhythm': { icon: FaMusic, chip: 'from-pink-500/25 to-rose-500/25', text: 'text-pink-200', border: 'hover:border-pink-500/70', glow: 'hover:shadow-pink-500/20' },
  'open-world': { icon: FaGlobe, chip: 'from-emerald-500/25 to-teal-500/25', text: 'text-emerald-200', border: 'hover:border-emerald-500/70', glow: 'hover:shadow-emerald-500/20' },
  pinball: { icon: GiJoystick, chip: 'from-amber-500/25 to-orange-500/25', text: 'text-amber-200', border: 'hover:border-amber-500/70', glow: 'hover:shadow-amber-500/20' },
  platform: { icon: FaPersonRunning, chip: 'from-indigo-500/25 to-blue-500/25', text: 'text-indigo-200', border: 'hover:border-indigo-500/70', glow: 'hover:shadow-indigo-500/20' },
  puzzle: { icon: FaPuzzlePiece, chip: 'from-violet-500/25 to-fuchsia-500/25', text: 'text-violet-200', border: 'hover:border-violet-500/70', glow: 'hover:shadow-violet-500/20' },
  'racing-driving': { icon: GiRaceCar, chip: 'from-orange-500/25 to-yellow-500/25', text: 'text-orange-200', border: 'hover:border-orange-500/70', glow: 'hover:shadow-orange-500/20' },
  roguelike: { icon: GiCrossedSwords, chip: 'from-red-500/25 to-rose-500/25', text: 'text-rose-200', border: 'hover:border-rose-500/70', glow: 'hover:shadow-rose-500/20' },
  'role-playing': { icon: FaShieldHalved, chip: 'from-purple-500/25 to-indigo-500/25', text: 'text-purple-200', border: 'hover:border-purple-500/70', glow: 'hover:shadow-purple-500/20' },
  sandbox: { icon: GiSandsOfTime, chip: 'from-yellow-500/25 to-amber-500/25', text: 'text-yellow-200', border: 'hover:border-yellow-500/70', glow: 'hover:shadow-yellow-500/20' },
  shooter: { icon: MdSportsEsports, chip: 'from-red-500/25 to-orange-500/25', text: 'text-red-200', border: 'hover:border-red-500/70', glow: 'hover:shadow-red-500/20' },
  simulation: { icon: MdOutlineArchitecture, chip: 'from-sky-500/25 to-cyan-500/25', text: 'text-sky-200', border: 'hover:border-sky-500/70', glow: 'hover:shadow-sky-500/20' },
  social: { icon: FaUsers, chip: 'from-blue-500/25 to-indigo-500/25', text: 'text-blue-200', border: 'hover:border-blue-500/70', glow: 'hover:shadow-blue-500/20' },
  sports: { icon: GiSoccerBall, chip: 'from-lime-500/25 to-emerald-500/25', text: 'text-lime-200', border: 'hover:border-lime-500/70', glow: 'hover:shadow-lime-500/20' },
  stealth: { icon: FaMask, chip: 'from-slate-500/25 to-zinc-500/25', text: 'text-slate-200', border: 'hover:border-slate-500/70', glow: 'hover:shadow-slate-500/20' },
  'strategy-tactical': { icon: FaChessRook, chip: 'from-indigo-500/25 to-violet-500/25', text: 'text-indigo-200', border: 'hover:border-indigo-500/70', glow: 'hover:shadow-indigo-500/20' },
  survival: { icon: FaHatCowboy, chip: 'from-amber-500/25 to-red-500/25', text: 'text-amber-200', border: 'hover:border-amber-500/70', glow: 'hover:shadow-amber-500/20' },
  'tower-defense': { icon: GiCastle, chip: 'from-teal-500/25 to-cyan-500/25', text: 'text-teal-200', border: 'hover:border-teal-500/70', glow: 'hover:shadow-teal-500/20' },
  trivia: { icon: FaRegCircleQuestion, chip: 'from-blue-500/25 to-sky-500/25', text: 'text-blue-200', border: 'hover:border-blue-500/70', glow: 'hover:shadow-blue-500/20' },
  'vehicular-combat': { icon: GiSteeringWheel, chip: 'from-zinc-500/25 to-slate-500/25', text: 'text-zinc-200', border: 'hover:border-zinc-500/70', glow: 'hover:shadow-zinc-500/20' },
  'visual-novel': { icon: MdOutlinePsychology, chip: 'from-rose-500/25 to-pink-500/25', text: 'text-rose-200', border: 'hover:border-rose-500/70', glow: 'hover:shadow-rose-500/20' },
}

const genreVisualAliases: Record<string, string> = {
  'first-person-shooter': 'shooter',
  'third-person-shooter': 'shooter',
  'hack-slash': 'role-playing',
  metroidvania: 'platform',
  'action-rpg': 'role-playing',
  jrpg: 'role-playing',
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
  anime: 'visual-novel',
  casual: 'social',
  'hidden-object': 'puzzle',
  horror: 'survival',
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
  jryo: 'role-playing',
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
  yaris: 'racing-driving',
  'yaris-simulasyonu': 'racing-driving',
  'balikcilik-ve-avlanma': 'survival',
  'takim-sporlari': 'sports',
  'bireysel-sporlar': 'sports',
  'bilim-kurgu-ve-cyberpunk': 'open-world',
  bosluk: 'simulation',
  'hayatta-kalma': 'survival',
  'gizem-ve-dedektiflik': 'puzzle',
  'yetiskinlere-ozel': 'visual-novel',
}

function getGenreVisual(slug: string) {
  const visualKey = genreVisualAliases[slug] ?? slug
  return genreVisuals[visualKey] ?? {
    icon: FaSitemap,
    chip: 'from-blue-500/25 to-indigo-500/25',
    text: 'text-blue-200',
    border: 'hover:border-blue-500/70',
    glow: 'hover:shadow-blue-500/20',
  }
}

export default function GamesPage() {
  const sortedGenres = [...gameGenres].sort((a, b) =>
    a.label.localeCompare(b.label, 'tr', { sensitivity: 'base', ignorePunctuation: true }),
  )

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">Oyunlar</h1>
        <p className="text-gray-400 mb-8">Tum oyunlar kategorilere ayrilmis listede.</p>
        <div className="mb-5">
          <Link to="/games/alfabetik" className="btn-primary">A-Z Oyun Dizini</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedGenres.map((g) => {
            const visual = getGenreVisual(g.slug)
            const Icon = visual.icon

            return (
              <Link
                key={g.slug}
                to={`/games/genres/${g.slug}`}
                className={`card p-5 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${visual.border} ${visual.glow}`}
              >
                <div className={`mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br ${visual.chip} border border-gray-700/80 flex items-center justify-center`}>
                  <Icon className={`text-2xl ${visual.text}`} />
                </div>
                <span className={`text-xl font-black ${visual.text}`}>{g.badge}</span>
                <p className="mt-2 font-semibold text-white">{g.label}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
