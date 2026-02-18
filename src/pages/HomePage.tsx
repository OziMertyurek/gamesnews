import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

function PcIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-cyan-100" fill="none" aria-hidden>
      <rect x="8" y="11" width="48" height="32" rx="5" stroke="currentColor" strokeWidth="3" />
      <path d="M25 52h14M21 47h22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 37h32" stroke="currentColor" strokeWidth="2" opacity="0.55" />
    </svg>
  )
}

function PlayStationIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-blue-100" fill="none" aria-hidden>
      <path d="M20 16l10 29V27l14 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="47" cy="19" r="4.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M46 32l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 36h8M20 32v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="35" y="41" width="7" height="7" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

function XboxIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-emerald-100" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="3" />
      <path d="M18 20c5 0 8 2 14 8m14-8c-5 0-8 2-14 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 44c5 0 8-2 14-8m14 8c-5 0-8-2-14-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    </svg>
  )
}

function NintendoIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-red-100" fill="none" aria-hidden>
      <rect x="10" y="12" width="44" height="40" rx="12" stroke="currentColor" strokeWidth="3" />
      <path d="M32 14v36" stroke="currentColor" strokeWidth="2.5" opacity="0.8" />
      <circle cx="23" cy="24" r="3.4" fill="currentColor" />
      <rect x="39" y="30" width="6" height="11" rx="3" fill="currentColor" />
    </svg>
  )
}

type PlatformCard = {
  slug: 'pc' | 'ps' | 'xbox' | 'nintendo'
  label: string
  subtitle: string
  bg: string
  border: string
  pattern: string
  glow: string
  icon: ReactNode
}

const platforms: PlatformCard[] = [
  {
    slug: 'pc',
    label: 'PC',
    subtitle: 'Donanim ve bilesen',
    bg: 'from-slate-700 via-slate-800 to-cyan-950',
    border: 'border-cyan-800/70',
    pattern: 'bg-[radial-gradient(circle_at_25%_25%,rgba(34,211,238,.22),transparent_55%)]',
    glow: 'bg-cyan-300/20',
    icon: <PcIcon />,
  },
  {
    slug: 'ps',
    label: 'PlayStation',
    subtitle: 'Konsol ve aksesuar',
    bg: 'from-blue-900 via-blue-950 to-indigo-950',
    border: 'border-blue-700/70',
    pattern: 'bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,.28),transparent_55%)]',
    glow: 'bg-blue-300/20',
    icon: <PlayStationIcon />,
  },
  {
    slug: 'xbox',
    label: 'Xbox',
    subtitle: 'Konsol ve gamepad',
    bg: 'from-emerald-900 via-green-950 to-emerald-950',
    border: 'border-emerald-700/70',
    pattern: 'bg-[radial-gradient(circle_at_80%_25%,rgba(16,185,129,.24),transparent_55%)]',
    glow: 'bg-emerald-300/20',
    icon: <XboxIcon />,
  },
  {
    slug: 'nintendo',
    label: 'Nintendo',
    subtitle: 'Switch dunyasi',
    bg: 'from-red-800 via-red-900 to-rose-950',
    border: 'border-red-700/70',
    pattern: 'bg-[radial-gradient(circle_at_20%_20%,rgba(248,113,113,.24),transparent_55%)]',
    glow: 'bg-red-300/20',
    icon: <NintendoIcon />,
  },
]

const sideAdSlots = {
  left: 'Sol Sabit Alan - 300x600',
  right: 'Sag Sabit Alan - 300x600',
}

const centerAdSlots = [
  'Orta Ust Banner - 970x250',
  'Orta Alt Banner - 970x250',
]

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-blue-950 to-gray-900 border border-blue-900/50 p-10 md:p-14">
        <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">Yeni Nesil Oyun ve Urun Platformu</p>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
          <span className="text-blue-400">Games</span>News
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mb-7">
          Urun karsilastirmalari, tur bazli oyun listeleri, platform bazli katalog ve reklam is birlikleri tek sayfada.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products/pc" className="btn-primary">Urunlere Git</Link>
          <Link to="/games" className="btn-ghost">Oyun Turleri</Link>
          <Link to="/iletisim" className="btn-ghost">Iletisim</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-6 border-dashed border-blue-700/60 bg-blue-950/20">
          <p className="text-xs text-blue-300 uppercase tracking-wider mb-2">Reklam Alani</p>
          <h2 className="text-2xl font-bold text-white">Premium Banner Slotu</h2>
          <p className="text-gray-300 mt-2">Bu alanda markanizin lansman kampanyasi yayinlanabilir.</p>
          <p className="text-blue-300 text-sm mt-4">Buraya reklam vermek icin bizimle iletisime gecin.</p>
        </div>
        <div className="card p-6 border-dashed border-blue-700/60 bg-blue-950/20">
          <p className="text-xs text-blue-300 uppercase tracking-wider mb-2">Reklam Alani</p>
          <h2 className="text-xl font-bold text-white">Dikey Vitrin</h2>
          <p className="text-gray-300 mt-2">300x600 etkili gorunum alani.</p>
          <p className="text-blue-300 text-sm mt-4">Buraya reklam vermek icin bizimle iletisime gecin.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Platformlara Gore Urun Kataloglari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <Link
              key={p.slug}
              to={`/products/${p.slug}`}
              className={`card relative overflow-hidden border ${p.border} p-6 bg-gradient-to-br ${p.bg} hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`absolute inset-0 ${p.pattern}`} />
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full border border-white/10" />
              <div className="absolute -left-5 -bottom-6 w-20 h-20 rounded-full border border-white/10" />
              <div className={`absolute right-4 top-4 w-14 h-14 rounded-full blur-xl ${p.glow}`} />

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black/20 border border-white/15 grid place-items-center">
                  {p.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-tight">{p.label}</p>
                  <p className="text-xs text-white/70 mt-1">{p.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Uzun Ana Sayfa Reklam Plani</h2>
        <p className="text-gray-400">Asagidaki bolumler sayfa kaydirildikca farkli noktalarda gozukur.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="card p-6 border-dashed border-gray-700">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="text-lg text-white font-semibold mt-2">{sideAdSlots.left}</h3>
            <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya urun vitrini yayinlanabilir.</p>
            <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek icin bizimle iletisime gecin.</p>
          </article>

          <div className="space-y-4">
            {centerAdSlots.map((slot) => (
              <article key={slot} className="card p-6 border-dashed border-gray-700">
                <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
                <h3 className="text-lg text-white font-semibold mt-2">{slot}</h3>
                <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya urun vitrini yayinlanabilir.</p>
                <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek icin bizimle iletisime gecin.</p>
              </article>
            ))}
          </div>

          <article className="card p-6 border-dashed border-gray-700">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="text-lg text-white font-semibold mt-2">{sideAdSlots.right}</h3>
            <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya urun vitrini yayinlanabilir.</p>
            <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek icin bizimle iletisime gecin.</p>
          </article>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Icerik Blog Alani {i + 1}</p>
            <h3 className="text-white font-semibold mt-2">Topluluk ve etkinlik bolumu</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Burasi ana sayfanin uzun akisini desteklemek icin ayrilan editoryal bloktur. Mobilde tek sutun, desktopta cok sutun calisir.
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-800 bg-blue-950/30 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Markanizi burada konumlandirin</h2>
        <p className="text-gray-300 mt-3">
          Banner, sponsorlu kart ve kategori ici reklam modelleri mevcut.
        </p>
        <p className="text-blue-300 mt-4">Reklam vermek icin bizimle iletisime gecin: iletisim@gamesnews-network.com</p>
        <Link to="/iletisim" className="btn-primary mt-6">Iletisim Sayfasina Git</Link>
      </section>
    </div>
  )
}
