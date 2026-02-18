import { Link } from 'react-router-dom'
import { gameGenres } from '../data/siteContent'

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">Oyunlar</h1>
        <p className="text-gray-400 mb-8">Tum oyunlar kategorilere ayrilmis listede.</p>
        <div className="mb-5">
          <Link to="/games/alfabetik" className="btn-primary">A-Z Oyun Dizini</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gameGenres.map((g) => (
            <Link key={g.slug} to={`/games/genres/${g.slug}`} className="card p-6 text-center hover:border-blue-700 hover:scale-105 transition-all duration-200">
              <span className="text-2xl font-black text-blue-300">{g.badge}</span>
              <p className="mt-3 font-semibold text-white">{g.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
