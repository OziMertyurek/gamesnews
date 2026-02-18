import { Link } from 'react-router-dom'
import { games } from '../data/siteContent'

function firstLetter(value: string) {
  const clean = value.trim()
  if (!clean) return '#'
  const char = clean[0].toUpperCase()
  return /[A-Z]/.test(char) ? char : '#'
}

export default function GamesAZPage() {
  const sorted = [...games].sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))
  const grouped = new Map<string, typeof sorted>()

  for (const game of sorted) {
    const letter = firstLetter(game.title)
    const list = grouped.get(letter) ?? []
    list.push(game)
    grouped.set(letter, list)
  }

  const letters = [...grouped.keys()].sort((a, b) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/games" className="hover:text-gray-300 transition-colors">Oyunlar</Link>
        <span>/</span>
        <span className="text-gray-300">A-Z Oyun Dizini</span>
      </div>

      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">A-Z Oyun Dizini</h1>
        <p className="text-gray-400 mt-2">Sitede bilgisi bulunan tüm oyunlar alfabetik listelenir.</p>
      </section>

      {letters.map((letter) => (
        <section key={letter} className="card p-5">
          <h2 className="text-xl font-bold text-blue-300">{letter}</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {(grouped.get(letter) ?? []).map((game) => (
              <Link
                key={game.slug}
                to={`/games/${game.slug}`}
                className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 hover:border-blue-700 hover:bg-gray-700 transition-colors"
              >
                <p className="text-white text-sm font-medium">{game.title}</p>
                <p className="text-xs text-gray-400 mt-1">{game.genre} - {game.releaseYear}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
