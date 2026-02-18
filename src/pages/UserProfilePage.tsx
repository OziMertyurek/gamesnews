import { Link, useParams } from 'react-router-dom'
import { getPublicUserByEmail } from '../lib/auth'
import { getUserProfileExtras } from '../lib/community'
import { games } from '../data/siteContent'

export default function UserProfilePage() {
  const { email } = useParams<{ email: string }>()
  const decodedEmail = decodeURIComponent(email ?? '')
  const user = getPublicUserByEmail(decodedEmail)

  if (!user) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Kullanıcı bulunamadı</h1>
        <p className="text-gray-400 mt-2">Aradığın profil bu tarayıcıdaki kayıtlarda yok.</p>
        <Link to="/" className="btn-primary mt-5">Ana Sayfaya Dön</Link>
      </div>
    )
  }

  const extras = getUserProfileExtras(user.email)
  const playedGames = games.filter((game) => extras.playedGameSlugs.includes(game.slug))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-400 mt-2">Kullanıcı Profili</p>
        <p className="text-sm text-gray-500 mt-4">{user.email}</p>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Profili</h2>
        {extras.steamProfileUrl ? (
          <a href={extras.steamProfileUrl} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 mt-2 inline-block break-all">
            {extras.steamProfileUrl}
          </a>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Steam profili paylaşılmamış.</p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Oyunları</h2>
        {extras.steamGames.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Oyun</th>
                  <th className="py-2 pr-4">Saat</th>
                </tr>
              </thead>
              <tbody>
                {extras.steamGames.slice(0, 30).map((game) => (
                  <tr key={game.appId} className="border-b border-gray-800">
                    <td className="py-2 pr-4 text-white">{game.name}</td>
                    <td className="py-2 pr-4 text-blue-300">{game.playtimeHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-3">Steam oyun verisi bulunmuyor.</p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Sitede Oynadıkları</h2>
        {playedGames.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {playedGames.map((game) => (
              <Link key={game.slug} to={`/games/${game.slug}`} className="rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition-colors">
                <p className="text-white font-medium">{game.title}</p>
                <p className="text-xs text-gray-400 mt-1">{game.releaseYear} - {game.genre}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-3">Sitede oynadığı oyunlar henüz eklenmemiş.</p>
        )}
      </section>
    </div>
  )
}
