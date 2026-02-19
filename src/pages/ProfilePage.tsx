import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../lib/auth'
import { getUserProfileExtras, saveSteamConnection, saveSteamGames } from '../lib/community'
import { fetchSteamOwnedGames } from '../lib/steam'
import { games } from '../data/siteContent'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const userEmail = user?.email ?? null

  const [steamProfileUrl, setSteamProfileUrl] = useState('')
  const [steamId, setSteamId] = useState('')
  const [steamApiKey, setSteamApiKey] = useState('')
  const [syncMessage, setSyncMessage] = useState('')
  const [loadingSteam, setLoadingSteam] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!userEmail) return
    const extras = getUserProfileExtras(userEmail)
    setSteamProfileUrl(extras.steamProfileUrl)
    setSteamId(extras.steamId)
    setSteamApiKey(extras.steamApiKey)
  }, [userEmail, refreshKey])

  const extras = userEmail ? getUserProfileExtras(userEmail) : null
  const playedGames = useMemo(() => {
    if (!extras) return []
    return games.filter((game) => extras.playedGameSlugs.includes(game.slug))
  }, [extras])

  if (!user) {
    return (
      <div className="card p-10 text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Profil için giriş gerekli</h1>
        <p className="text-gray-400 mt-2">Profilini görmek için önce login ol.</p>
        <div className="flex gap-3 justify-center mt-5">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/signup" className="btn-ghost">Sign Up</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">Profil</h1>
        <p className="text-gray-400 mt-2">Hesap bilgilerin</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-xs text-gray-500">Ad Soyad</p>
            <p className="text-white font-medium mt-1">{user.name}</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-xs text-gray-500">E-posta</p>
            <p className="text-white font-medium mt-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="btn-ghost"
            onClick={() => {
              logoutUser()
              navigate('/login')
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Profili</h2>
        <p className="text-gray-400 mt-2 text-sm">Steam API key ve profil/SteamID64 ile kütüphaneni çekebilirsin. Bilgiler yalnızca tarayıcında saklanır.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            placeholder="Steam profil linki (opsiyonel)"
            value={steamProfileUrl}
            onChange={(event) => setSteamProfileUrl(event.target.value)}
          />
          <input
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            placeholder="SteamID64 veya profil linki"
            value={steamId}
            onChange={(event) => setSteamId(event.target.value)}
          />
          <input
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 md:col-span-2"
            placeholder="Steam Web API Key"
            value={steamApiKey}
            onChange={(event) => setSteamApiKey(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="btn-primary"
            onClick={async () => {
              saveSteamConnection(user.email, { steamProfileUrl: steamProfileUrl.trim(), steamId: steamId.trim(), steamApiKey: steamApiKey.trim() })
              setSyncMessage('Steam bağlantı bilgileri kaydedildi.')
              setRefreshKey((value) => value + 1)
            }}
          >
            Steam Bağlantısını Kaydet
          </button>
          <button
            className="btn-ghost"
            disabled={loadingSteam}
            onClick={async () => {
              try {
                setLoadingSteam(true)
                setSyncMessage('Steam kütüphanesi çekiliyor...')
                const result = await fetchSteamOwnedGames(steamApiKey, steamId || steamProfileUrl)
                saveSteamConnection(user.email, { steamProfileUrl: steamProfileUrl.trim(), steamId: result.steamId, steamApiKey: steamApiKey.trim() })
                saveSteamGames(user.email, result.games)
                setSyncMessage(`${result.games.length} oyun çekildi.`)
                setRefreshKey((value) => value + 1)
              } catch (error) {
                setSyncMessage(error instanceof Error ? error.message : 'Steam verisi çekilemedi.')
              } finally {
                setLoadingSteam(false)
              }
            }}
          >
            {loadingSteam ? 'Çekiliyor...' : 'Steam Oyunlarını Çek'}
          </button>
        </div>

        {syncMessage && <p className="text-sm text-blue-300 mt-3">{syncMessage}</p>}
        {extras?.steamLastSyncAt && <p className="text-xs text-gray-500 mt-2">Son senkron: {new Date(extras.steamLastSyncAt).toLocaleString('tr-TR')}</p>}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Steam Kütüphanem</h2>
        {extras && extras.steamGames.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Oyun</th>
                  <th className="py-2 pr-4">Saat</th>
                </tr>
              </thead>
              <tbody>
                {extras.steamGames.slice(0, 100).map((game) => (
                  <tr key={game.appId} className="border-b border-gray-800">
                    <td className="py-2 pr-4 text-white">{game.name}</td>
                    <td className="py-2 pr-4 text-blue-300">{game.playtimeHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-3">Steam kütüphanesi henüz bağlanmadı.</p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white">Sitede Oynadıklarım</h2>
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
          <p className="text-sm text-gray-400 mt-3">Henüz oyun eklemedin. Oyun detayında "Bu Oyunu Oynadım" butonunu kullan.</p>
        )}
      </section>
    </div>
  )
}
