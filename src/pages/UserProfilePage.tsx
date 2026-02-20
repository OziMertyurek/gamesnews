import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { games } from '../data/siteContent'

interface PublicProfileDetails {
  profile: { id: string; name: string }
  extras: {
    steamProfileUrl: string
    playedGameSlugs: string[]
    steamGames: Array<{ appId: number; name: string; playtimeHours: number; iconUrl: string | null }>
  }
  comments: Array<{ id: string; gameSlug: string; rating: number; content: string; createdAt: string }>
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PublicProfileDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/public-profile-details?id=${encodeURIComponent(id ?? '')}`)
        const payload = await response.json().catch(() => ({}))
        if (!active) return
        if (!response.ok) {
          setData(null)
        } else {
          setData(payload as PublicProfileDetails)
        }
      } catch {
        if (!active) return
        setData(null)
      } finally {
        if (!active) return
        setLoading(false)
      }
    }
    void run()
    return () => {
      active = false
    }
  }, [id])

  const playedGames = useMemo(() => {
    if (!data) return []
    return games.filter((game) => data.extras.playedGameSlugs.includes(game.slug))
  }, [data])

  if (loading) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <p className="text-gray-400">Profil yukleniyor...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Kullanici bulunamadi</h1>
        <p className="text-gray-400 mt-2">Aradigin profil bulunamadi veya gizli.</p>
        <Link to="/" className="btn-primary mt-5">Ana Sayfaya Don</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">{data.profile.name}</h1>
        <p className="text-gray-400 mt-2">Kullanici Profili</p>
        <p className="text-sm text-gray-500 mt-4">Bu profilde e-posta bilgisi gizlidir.</p>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Profili</h2>
        {data.extras.steamProfileUrl ? (
          <a href={data.extras.steamProfileUrl} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 mt-2 inline-block break-all">
            {data.extras.steamProfileUrl}
          </a>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Steam profili paylasilmamis.</p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Oyunlari</h2>
        {data.extras.steamGames.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Oyun</th>
                  <th className="py-2 pr-4">Saat</th>
                </tr>
              </thead>
              <tbody>
                {data.extras.steamGames.slice(0, 30).map((game) => (
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
        <h2 className="text-lg font-semibold text-white">Sitede Oynadiklari</h2>
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
          <p className="text-sm text-gray-400 mt-3">Sitede oynadigi oyunlar henuz eklenmemis.</p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Yorumlari</h2>
        {data.comments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.comments.map((comment) => {
              const game = games.find((item) => item.slug === comment.gameSlug)
              return (
                <article key={comment.id} className="rounded-lg bg-gray-800 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link to={`/games/${comment.gameSlug}`} className="text-white font-medium hover:text-blue-300">
                      {game?.title ?? comment.gameSlug}
                    </Link>
                    <p className="text-xs text-gray-400">{comment.rating}/5</p>
                  </div>
                  <p className="text-sm text-gray-200 mt-2">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString('tr-TR')}</p>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-3">Henuz yorum yok.</p>
        )}
      </section>
    </div>
  )
}
