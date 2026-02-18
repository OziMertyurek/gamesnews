import { useParams, Link } from 'react-router-dom'
import { games } from '../data/siteContent'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const game = games.find((item) => item.slug === slug)

  if (!game) {
    return (
      <div className="card p-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Oyun bulunamadi</h1>
        <p className="text-gray-400 mb-6">Aradigin oyun su anda listede yok.</p>
        <Link to="/games" className="btn-primary inline-flex">Oyunlara Don</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/games" className="hover:text-gray-300 transition-colors">Oyunlar</Link>
        <span>/</span>
        <span className="text-gray-300">{game.title}</span>
      </div>

      <article className="card p-8">
        <p className="text-sm text-blue-400 font-semibold mb-3">{game.genre.toUpperCase()}</p>
        <h1 className="text-3xl font-bold text-white mb-4">{game.title}</h1>
        <p className="text-gray-300 mb-6 max-w-3xl">{game.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Cikis Yili</p>
            <p className="text-white font-semibold">{game.releaseYear}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Puan</p>
            <p className="text-white font-semibold">{game.score} / 10</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Platformlar</p>
            <p className="text-white font-semibold">{game.platforms.map((platform) => platformLabels[platform] ?? platform).join(', ')}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Metacritic</p>
            <p className="text-white font-semibold">{game.metacriticScore !== null ? `${game.metacriticScore} / 100` : 'Veri yok'}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">HowLongToBeat (Main)</p>
            <p className="text-white font-semibold">{game.howLongToBeatMainHours !== null ? `${game.howLongToBeatMainHours} saat` : 'Veri yok'}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">HowLongToBeat (Main + Extra)</p>
            <p className="text-white font-semibold">{game.howLongToBeatMainExtraHours !== null ? `${game.howLongToBeatMainExtraHours} saat` : 'Veri yok'}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn-ghost" href={game.metacriticUrl} target="_blank" rel="noreferrer">Metacritic</a>
          <a className="btn-ghost" href={game.howLongToBeatUrl} target="_blank" rel="noreferrer">HowLongToBeat</a>
          <a className="btn-ghost" href={game.gamespotArticleUrl} target="_blank" rel="noreferrer">GameSpot Haberi</a>
          <a className="btn-primary" href={game.youtubeTrailerUrl} target="_blank" rel="noreferrer">Trailer</a>
          <a className="btn-primary" href={game.youtubeGameplayUrl} target="_blank" rel="noreferrer">Gameplay</a>
        </div>
      </article>
    </div>
  )
}
