import { Link } from 'react-router-dom'

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
      <section className="relative overflow-hidden rounded-3xl border border-sky-900/70 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 md:p-12">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-wider text-sky-300">
              Yeni Nesil Oyun Platformu
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              AllAroundGame ile oyun dunyasini tek ekranda yonet.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              Oyun detaylari, sistem gereksinimleri, platform exclusive listeleri ve topluluk yorumlari ayni yerde.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/games" className="btn-primary">Oyunlara Git</Link>
              <Link to="/games/alfabetik" className="btn-ghost">A-Z Oyun Dizini</Link>
              <Link to="/consoles/playstation" className="btn-ghost">Exclusive'leri Gor</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-800/60 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/40">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Canli Ozet</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Takipteki Alan</p>
                <p className="mt-2 text-2xl font-black text-white">PS / Xbox / Nintendo</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Rehber</p>
                <p className="mt-2 text-2xl font-black text-white">Sistem + Sure + Skor</p>
              </article>
              <article className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Topluluk</p>
                <p className="mt-2 text-xl font-black text-white">Yorumlar, puanlar ve profil odakli takip</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Platform Karsilastirma', text: 'Konsollari exclusive katalog ve oyun detayi ile hizli karsilastir.' },
          { title: 'Detayli Oyun Karti', text: 'Cikis yili, metacritic, HLTB ve platform magaza linklerini tek panelde gor.' },
          { title: 'Topluluk Profilleri', text: 'Kullanici profillerini, yaptigi yorumlari ve aktifligini takip et.' },
          { title: 'Admin Kontrol', text: 'Onay bekleyen kayitlari yonet, audit log ile islemleri izle.' },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-2xl border border-cyan-800/40 bg-cyan-950/20 p-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Reklam Alani</p>
          <h2 className="mt-2 text-2xl font-black text-white">Premium Banner Slotu</h2>
          <p className="mt-2 text-slate-300">Bu alanda markanizin lansman kampanyasi yayinlanabilir.</p>
          <p className="mt-4 text-sm text-cyan-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
        </article>
        <article className="rounded-2xl border border-cyan-800/40 bg-cyan-950/20 p-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Reklam Alani</p>
          <h2 className="mt-2 text-xl font-black text-white">Dikey Vitrin</h2>
          <p className="mt-2 text-slate-300">300x600 etkili gorunum alani.</p>
          <p className="mt-4 text-sm text-cyan-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div>
          <h2 className="text-2xl font-black text-white">Uzun Ana Sayfa Reklam Plani</h2>
          <p className="mt-1 text-slate-400">Asagidaki bolumler sayfa kaydirildikca farkli noktalarda gorunur.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{sideAdSlots.left}</h3>
            <p className="mt-2 text-sm text-slate-400">Kampanya, sponsorluk veya vitrin yayini yapilabilir.</p>
            <p className="mt-4 text-sm text-blue-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
          </article>

          <div className="space-y-4">
            {centerAdSlots.map((slot) => (
              <article key={slot} className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
                <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{slot}</h3>
                <p className="mt-2 text-sm text-slate-400">Kampanya, sponsorluk veya vitrin yayini yapilabilir.</p>
                <p className="mt-4 text-sm text-blue-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
              </article>
            ))}
          </div>

          <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{sideAdSlots.right}</h3>
            <p className="mt-2 text-sm text-slate-400">Kampanya, sponsorluk veya vitrin yayini yapilabilir.</p>
            <p className="mt-4 text-sm text-blue-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-blue-800 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-8 text-center">
        <h2 className="text-3xl font-black text-white">Topluluga Katil</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">
          Yorumlar, sistem bilgileri ve oyun karsilastirmalariyla daha iyi karar ver.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/games" className="btn-primary">Oyunlari Kesfet</Link>
          <Link to="/signup" className="btn-ghost">Hesap Olustur</Link>
        </div>
      </section>
    </div>
  )
}
