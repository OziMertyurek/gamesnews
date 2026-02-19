import { Link, useLocation } from 'react-router-dom'
import { consoleResearchContent } from '../data/consoleResearchContent'
import { games } from '../data/siteContent'
import { dedupeGamesByTitle } from '../lib/gameCatalog'

const consoleMap: Record<string, { title: string }> = {
  nintendo: {
    title: 'Nintendo',
  },
  playstation: {
    title: 'PlayStation',
  },
  xbox: {
    title: 'Xbox',
  },
}

export default function ConsolePlatformPage() {
  const location = useLocation()
  const slug = location.pathname.split('/').pop() ?? ''
  const current = consoleMap[slug] ?? {
    title: 'Konsollar',
  }
  const report = slug === 'nintendo' || slug === 'playstation' || slug === 'xbox'
    ? consoleResearchContent[slug]
    : null
  const platformBySlug = {
    nintendo: 'nintendo',
    playstation: 'ps',
    xbox: 'xbox',
  } as const

  const selectedPlatform = slug === 'nintendo' || slug === 'playstation' || slug === 'xbox'
    ? platformBySlug[slug]
    : null

  const allConsoleGames = selectedPlatform
    ? dedupeGamesByTitle(games
      .filter((game) => Array.isArray(game.platforms) && game.platforms.includes(selectedPlatform))
      .sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' })))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-300 transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-gray-300">Konsollar</span>
        <span>/</span>
        <span className="text-blue-300">{current.title}</span>
      </div>

      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">{current.title}</h1>
      </section>

      {report && (
        <>
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white">Zaman Çizelgesi (Özet)</h2>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              {report.timeline.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white">Tüm Oyunlar</h2>
            <p className="mt-2 text-sm text-gray-400">Toplam oyun: {allConsoleGames.length}</p>
            {allConsoleGames.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4">Oyun</th>
                      <th className="py-2 pr-4">Yıl</th>
                      <th className="py-2 pr-4">Tür</th>
                      <th className="py-2 pr-4">Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allConsoleGames.map((game) => (
                      <tr key={game.slug} className="border-b border-gray-800">
                        <td className="py-2 pr-4 text-white">
                          <Link to={`/games/${game.slug}`} className="hover:text-blue-300 transition-colors">
                            {game.title}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-gray-300">{game.releaseYear}</td>
                        <td className="py-2 pr-4 text-gray-300">{game.genre}</td>
                        <td className="py-2 pr-4 text-gray-300">{game.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">Bu platform için oyun verisi bulunamadı.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
