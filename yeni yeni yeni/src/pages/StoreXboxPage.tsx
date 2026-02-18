import { storeDeals } from '../data/siteContent'

export default function StoreXboxPage() {
  const deals = storeDeals.filter((deal) => deal.store === 'xbox')

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Xbox Store Firsatlari</h1>
      <p className="text-gray-400 mb-8">Konsol oyunculari icin secili kampanyalar</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <article key={deal.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-white">{deal.gameTitle}</h2>
              <span className="badge bg-green-900/50 text-green-300 border border-green-700">
                -%{deal.discountPercent}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <p className="text-2xl font-bold text-white">{deal.salePriceTry.toLocaleString('tr-TR')} TL</p>
              <p className="text-sm text-gray-500 line-through">{deal.originalPriceTry.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <time dateTime={deal.endsAt}>Bitis: {new Date(deal.endsAt).toLocaleDateString('tr-TR')}</time>
              <a href={deal.link} className="btn-ghost text-xs" target="_blank" rel="noopener noreferrer">
                Magazada ac
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
