import { Link } from 'react-router-dom'

const genres = [
  { slug: 'action', label: 'Aksiyon', emoji: 'A' },
  { slug: 'rpg', label: 'RPG', emoji: 'R' },
  { slug: 'strategy', label: 'Strateji', emoji: 'S' },
  { slug: 'sports', label: 'Spor', emoji: 'SP' },
  { slug: 'racing', label: 'Yaris', emoji: 'Y' },
  { slug: 'horror', label: 'Korku', emoji: 'K' },
  { slug: 'shooter', label: 'Nisanci', emoji: 'N' },
  { slug: 'puzzle', label: 'Bulmaca', emoji: 'B' },
]

export default function GamesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Oyunlar</h1>
      <p className="text-gray-400 mb-8">Tum oyunlar kategorilere ayrilmis listede.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {genres.map((g) => (
          <Link key={g.slug} to={`/games/genres/${g.slug}`} className="card p-6 text-center hover:border-blue-700 hover:scale-105 transition-all duration-200">
            <span className="text-2xl font-black text-blue-300">{g.emoji}</span>
            <p className="mt-3 font-semibold text-white">{g.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
