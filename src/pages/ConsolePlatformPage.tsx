import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import { getConsoleExclusiveGamesByPlatform } from '../lib/consoleExclusives'
import { isPlatformFamily, themeByPlatform, type PlatformFamily } from '../lib/platformTheme'

const platformMeta: Record<PlatformFamily, { title: string }> = {
  nintendo: { title: 'Nintendo' },
  playstation: { title: 'PlayStation' },
  xbox: { title: 'Xbox' },
}

export default function ConsolePlatformPage() {
  const { platformFamily } = useParams<{ platformFamily?: string }>()

  if (!isPlatformFamily(platformFamily)) {
    return <NotFoundPage />
  }

  const current = platformMeta[platformFamily]
  const theme = themeByPlatform[platformFamily]
  const platformExclusiveGames = getConsoleExclusiveGamesByPlatform(platformFamily)

  return (
    <div className={`space-y-6 rounded-2xl p-4 md:p-6 ${theme.pageBg} min-h-screen text-white`}>
      <div className="flex items-center gap-2 text-sm text-gray-200">
        <Link to="/" className="hover:text-white transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-gray-100">Consoles</span>
        <span>/</span>
        <span className={theme.accent}>{current.title}</span>
      </div>

      <section className="card p-6">
        <h1 className={`text-3xl font-bold ${theme.accent}`}>{current.title} Exclusive Oyunlar</h1>
        <p className="mt-2 text-sm text-gray-300">Toplam oyun: {platformExclusiveGames.length}</p>
      </section>

      {platformExclusiveGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {platformExclusiveGames.map((game) => (
            <Link to={`/games/${game.slug}`} key={game.slug} className="card p-5 transition-transform hover:scale-[1.01] block">
              <p className="text-xs text-gray-400 mb-2">{game.release_year}</p>
              <h2 className="text-lg font-semibold text-white">{game.title}</h2>
              <p className="mt-2 text-sm text-gray-300">{game.platforms.join(', ')}</p>
              <span className={`mt-3 inline-block text-sm ${theme.accent} hover:underline`}>
                Detaya Git
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <section className="card p-6">
          <p className="text-sm text-gray-300">Bu platform için exclusive oyun bulunamadı.</p>
        </section>
      )}
    </div>
  )
}
