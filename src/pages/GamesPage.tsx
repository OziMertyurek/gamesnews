import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { games } from '../data/siteContent'
import { getAllTgaGamesCatalog, getGameAwardSummary } from '../lib/awards'

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

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function GamesPage() {
  const [query, setQuery] = useState('')
  const tgaCatalog = useMemo(() => getAllTgaGamesCatalog(), [])

  const localByNormalizedTitle = useMemo(() => {
    const map = new Map<string, string>()
    for (const game of games) {
      map.set(normalize(game.title), game.slug)
    }
    return map
  }, [])

  const filteredTgaGames = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? tgaCatalog.filter((item) => item.title.toLowerCase().includes(q)) : tgaCatalog
    return list.slice(0, 120)
  }, [query, tgaCatalog])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">Oyunlar</h1>
        <p className="text-gray-400 mb-8">Tum oyunlar kategorilere ayrilmis listede.</p>
        <div className="mb-5">
          <Link to="/games/alfabetik" className="btn-primary">A-Z Oyun Dizini</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((g) => (
            <Link key={g.slug} to={`/games/genres/${g.slug}`} className="card p-6 text-center hover:border-blue-700 hover:scale-105 transition-all duration-200">
              <span className="text-2xl font-black text-blue-300">{g.emoji}</span>
              <p className="mt-3 font-semibold text-white">{g.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">The Game Awards Oyun Havuzu</h2>
            <p className="text-sm text-gray-400">TGA kategorilerinde gecen tum oyunlar (aday + kazanan).</p>
          </div>
          <input
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 md:w-80"
            placeholder="TGA oyun ara"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredTgaGames.map((item) => {
            const localSlug = localByNormalizedTitle.get(normalize(item.title))
            const awardSummary = getGameAwardSummary(item.title)
            return (
              <article key={item.title} className="rounded-lg bg-gray-800 p-4 border border-gray-700">
                <p className="text-white font-medium">{item.title}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.wins > 0 && <span className="badge bg-amber-950 text-amber-200">Kazanma: {item.wins}</span>}
                  {item.nominations > 0 && <span className="badge bg-blue-950 text-blue-200">Adaylik: {item.nominations}</span>}
                  {awardSummary.categoryNominations.length > 0 && <span className="badge bg-emerald-950 text-emerald-200">Kategori Aday</span>}
                </div>
                <div className="mt-3">
                  {localSlug ? (
                    <Link to={`/games/${localSlug}`} className="btn-primary text-xs py-1.5 px-3">Bizim Sitede Ac</Link>
                  ) : (
                    <Link to="/oduller" className="btn-ghost text-xs py-1.5 px-3">Odullerde Gor</Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <p className="text-xs text-gray-500">Toplam kayit: {tgaCatalog.length}. Listede performans icin ilk 120 sonuc gosteriliyor.</p>
      </section>
    </div>
  )
}
