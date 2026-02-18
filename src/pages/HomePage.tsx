import { Link } from 'react-router-dom'

const platforms = [
  { slug: 'pc', label: 'PC', color: 'from-blue-900 to-blue-950' },
  { slug: 'ps', label: 'PlayStation', color: 'from-indigo-900 to-indigo-950' },
  { slug: 'xbox', label: 'Xbox', color: 'from-green-900 to-green-950' },
  { slug: 'nintendo', label: 'Nintendo', color: 'from-red-900 to-red-950' },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <Link
              key={p.slug}
              to={`/products/${p.slug}`}
              className={`card bg-gradient-to-br ${p.color} p-6 text-center hover:scale-[1.02] transition-transform duration-200`}
            >
              <p className="text-2xl font-bold text-white">{p.label.slice(0, 2).toUpperCase()}</p>
              <p className="mt-2 font-semibold text-white">{p.label}</p>
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
