import { useParams, Link } from 'react-router-dom'
import { games } from '../data/siteContent'

const genreLabels: Record<string, string> = {
  action: 'Aksiyon',
  rpg: 'RPG',
  strategy: 'Strateji',
  sports: 'Spor',
  racing: 'Yaris',
  horror: 'Korku',
  shooter: 'Nisanci',
  puzzle: 'Bulmaca',
}

export default function GenrePage() {
  const { genre } = useParams<{ genre: string }>()
  const safeGenre = genre ?? ''
  const title = genreLabels[safeGenre] ?? safeGenre.toUpperCase()
  const list = games.filter((game) => game.genre === safeGenre)

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/games" className="hover:text-gray-300 transition-colors">Oyunlar</Link>
        <span>/</span>
        <span className="text-gray-300">{title}</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-8">{title} Oyunlari</h1>

      {list.length === 0 ? (
        <div className="card p-12 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Bu turde icerik bulunamadi</h2>
          <Link to="/games" className="btn-primary inline-flex mt-4">Tum Turler</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((game) => (
            <article key={game.slug} className="card p-5 hover:border-blue-700 transition-colors">
              <p className="text-xs text-gray-500 mb-2">{game.releaseYear} - Puan {game.score}</p>
              <h2 className="text-lg font-semibold text-white mb-2">{game.title}</h2>
              <p className="text-sm text-gray-400 line-clamp-2">{game.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/games/${game.slug}`} className="btn-ghost text-xs px-3 py-1.5">Detay</Link>
                <a href={game.youtubeTrailerUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs px-3 py-1.5">Trailer</a>
                <a href={game.youtubeGameplayUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs px-3 py-1.5">Gameplay</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
