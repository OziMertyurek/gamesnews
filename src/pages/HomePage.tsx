import { Link } from 'react-router-dom'

const sideAdSlots = {
  left: 'Sol Sabit Alan - 300x600',
  right: 'Sağ Sabit Alan - 300x600',
}

const centerAdSlots = [
  'Orta Üst Banner - 970x250',
  'Orta Alt Banner - 970x250',
]

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-blue-950 to-gray-900 border border-blue-900/50 p-10 md:p-14">
        <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">Yeni Nesil Oyun Platformu</p>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
          <span className="text-blue-400">AllAroundGame</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mb-7">
          Oyunlara tek yerden ulaş, sistem gereksinimlerini incele ve topluluk geri bildirimlerini takip et.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/games" className="btn-primary">Oyunlara Git</Link>
          <Link to="/games/alfabetik" className="btn-ghost">A-Z Oyun Dizini</Link>
          <Link to="/iletisim" className="btn-ghost">İletişim</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-6 border-dashed border-blue-700/60 bg-blue-950/20">
          <p className="text-xs text-blue-300 uppercase tracking-wider mb-2">Reklam Alanı</p>
          <h2 className="text-2xl font-bold text-white">Premium Banner Slotu</h2>
          <p className="text-gray-300 mt-2">Bu alanda markanızın lansman kampanyası yayınlanabilir.</p>
          <p className="text-blue-300 text-sm mt-4">Buraya reklam vermek için bizimle iletişime geçin.</p>
        </div>
        <div className="card p-6 border-dashed border-blue-700/60 bg-blue-950/20">
          <p className="text-xs text-blue-300 uppercase tracking-wider mb-2">Reklam Alanı</p>
          <h2 className="text-xl font-bold text-white">Dikey Vitrin</h2>
          <p className="text-gray-300 mt-2">300x600 etkili görünüm alanı.</p>
          <p className="text-blue-300 text-sm mt-4">Buraya reklam vermek için bizimle iletişime geçin.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Uzun Ana Sayfa Reklam Plani</h2>
        <p className="text-gray-400">Aşağıdaki bölümler sayfa kaydırıldıkça farklı noktalarda görünür.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="card p-6 border-dashed border-gray-700">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="text-lg text-white font-semibold mt-2">{sideAdSlots.left}</h3>
            <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya vitrin yayını yapılabilir.</p>
            <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek için bizimle iletişime geçin.</p>
          </article>

          <div className="space-y-4">
            {centerAdSlots.map((slot) => (
              <article key={slot} className="card p-6 border-dashed border-gray-700">
                <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
                <h3 className="text-lg text-white font-semibold mt-2">{slot}</h3>
                <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya vitrin yayını yapılabilir.</p>
                <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek için bizimle iletişime geçin.</p>
              </article>
            ))}
          </div>

          <article className="card p-6 border-dashed border-gray-700">
            <p className="text-xs uppercase tracking-wide text-blue-300">Reklam Slotu</p>
            <h3 className="text-lg text-white font-semibold mt-2">{sideAdSlots.right}</h3>
            <p className="text-sm text-gray-400 mt-2">Kampanya, sponsorluk veya vitrin yayını yapılabilir.</p>
            <p className="text-sm text-blue-300 mt-4">Buraya reklam vermek için bizimle iletişime geçin.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-800 bg-blue-950/30 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Topluluğa Katıl</h2>
        <p className="text-gray-300 mt-3">Yorumlar, sistem bilgileri ve oyun karşılaştırmalarıyla daha iyi karar ver.</p>
        <Link to="/games" className="btn-primary mt-6">Oyunları Keşfet</Link>
      </section>
    </div>
  )
}
