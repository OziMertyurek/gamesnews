import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { games } from '../data/siteContent'
import { getCurrentUser } from '../lib/auth'
import {
  addGameComment,
  deleteGameComment,
  getGameComments,
  isPlayedInSiteGames,
  togglePlayedInSiteGames,
  type GameComment,
} from '../lib/community'
import { getGameAwardSummary } from '../lib/awards'
import {
  cpuModels,
  defaultUserSystemProfile,
  evaluateCompatibility,
  getCpuScoreByModel,
  getGpuScoreByModel,
  gpuModels,
  type UserSystemProfile,
} from '../lib/systemRequirements'
import { fetchGameRequirements, type GameRequirementsPayload } from '../lib/gameRequirements'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

const genreBaseHours: Record<string, number> = {
  action: 14,
  rpg: 42,
  strategy: 28,
  sports: 16,
  racing: 14,
  horror: 11,
  shooter: 12,
  puzzle: 9,
  platform: 12,
  pinball: 6,
  'racing-driving': 15,
  roguelike: 20,
  'role-playing': 40,
  sandbox: 24,
  simulation: 26,
  social: 8,
  stealth: 15,
  'strategy-tactical': 30,
  survival: 24,
  'tower-defense': 14,
  trivia: 5,
  'vehicular-combat': 16,
  'visual-novel': 18,
  management: 28,
  'music-rhythm': 10,
  'open-world': 34,
  'interactive-art': 7,
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const game = games.find((item) => item.slug === slug)
  const safeGame = game ?? games[0]
  const user = getCurrentUser()
  const awards = useMemo(() => getGameAwardSummary(safeGame.title), [safeGame.title])

  const [comments, setComments] = useState<GameComment[]>([])
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [playedOnSite, setPlayedOnSite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userSystem, setUserSystem] = useState<UserSystemProfile>(defaultUserSystemProfile)
  const [steamRequirements, setSteamRequirements] = useState<GameRequirementsPayload | null>(null)
  const [requirementsLoading, setRequirementsLoading] = useState(false)
  const [requirementsError, setRequirementsError] = useState('')

  useEffect(() => {
    if (!game) return

    const frame = window.requestAnimationFrame(() => {
      setComments(getGameComments(game.slug))
      if (user) {
        setPlayedOnSite(isPlayedInSiteGames(user.email, game.slug))
      } else {
        setPlayedOnSite(false)
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [game, user])

  useEffect(() => {
    if (!game) return
    const key = `aag-system-profile-${game.slug}`
    const raw = localStorage.getItem(key)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as Partial<UserSystemProfile> & { cpuTier?: number; gpuTier?: number }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserSystem({
        cpuModel: parsed.cpuModel || defaultUserSystemProfile.cpuModel,
        gpuModel: parsed.gpuModel || defaultUserSystemProfile.gpuModel,
        cpuScore: Number(parsed.cpuScore ?? parsed.cpuTier) || defaultUserSystemProfile.cpuScore,
        gpuScore: Number(parsed.gpuScore ?? parsed.gpuTier) || defaultUserSystemProfile.gpuScore,
        ramGb: Number(parsed.ramGb) || defaultUserSystemProfile.ramGb,
        resolution: parsed.resolution === '4k' || parsed.resolution === '1440p' ? parsed.resolution : '1080p',
      })
    } catch {
      // Bozuk profile verisinde varsayilan deger korunur.
    }
  }, [game])

  useEffect(() => {
    if (!game) return
    localStorage.setItem(`aag-system-profile-${game.slug}`, JSON.stringify(userSystem))
  }, [game, userSystem])

  useEffect(() => {
    if (!game) return
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRequirementsLoading(true)
    setRequirementsError('')
    setSteamRequirements(null)

    fetchGameRequirements(game.title)
      .then((payload) => {
        if (!active) return
        setSteamRequirements(payload)
      })
      .catch((error) => {
        if (!active) return
        setRequirementsError(error instanceof Error ? error.message : 'Sistem gereksinimi alınamadı.')
      })
      .finally(() => {
        if (!active) return
        setRequirementsLoading(false)
      })

    return () => {
      active = false
    }
  }, [game])

  const estimateMainHours = () => {
    const base = genreBaseHours[safeGame.genre] ?? 14
    const scoreBoost = Math.max(0, safeGame.score - 7) * 2.2
    return Math.round(base + scoreBoost)
  }

  const estimatedMain = estimateMainHours()
  const estimatedMainExtra = Math.round(estimatedMain * 1.45)
  const metacriticDisplay = safeGame.metacriticScore !== null ? `${safeGame.metacriticScore} / 100` : `${Math.round(safeGame.score * 10)} / 100 (Site Puani)`
  const hltbMainDisplay = safeGame.howLongToBeatMainHours !== null ? `${safeGame.howLongToBeatMainHours} saat` : `~${estimatedMain} saat (Tahmini)`
  const hltbMainExtraDisplay = safeGame.howLongToBeatMainExtraHours !== null ? `${safeGame.howLongToBeatMainExtraHours} saat` : `~${estimatedMainExtra} saat (Tahmini)`

  const compatibility = useMemo(() => evaluateCompatibility(safeGame, userSystem), [safeGame, userSystem])

  const cpuMatchedScore = useMemo(() => getCpuScoreByModel(userSystem.cpuModel), [userSystem.cpuModel])
  const gpuMatchedScore = useMemo(() => getGpuScoreByModel(userSystem.gpuModel), [userSystem.gpuModel])
  const platformDetailItems = useMemo(() => {
    const baseRows = new Map<string, { label: string; store: string; details: string[]; icon: string }>()
    for (const platform of safeGame.platforms) {
      const label = platformLabels[platform] ?? platform
      if (label === 'PC') baseRows.set(label, { label, store: 'PC Store', details: [], icon: 'PC' })
      if (label === 'PlayStation') baseRows.set(label, { label, store: 'PlayStation Store', details: [], icon: 'PS' })
      if (label === 'Xbox') baseRows.set(label, { label, store: 'Xbox Store', details: [], icon: 'XB' })
      if (label === 'Nintendo') baseRows.set(label, { label, store: 'Nintendo eShop', details: [], icon: 'NS' })
    }

    const details = steamRequirements?.platformDetails

    if (details) {
      if (details.pcStores.length > 0 || details.pcDevices.length > 0) {
        baseRows.set('PC', {
          label: 'PC',
          store: details.pcStores.length > 0 ? details.pcStores.join(', ') : 'PC Store',
          details: details.pcDevices,
          icon: 'PC',
        })
      }
      if (details.playstation.length > 0) {
        baseRows.set('PlayStation', { label: 'PlayStation', store: 'PlayStation Store', details: details.playstation, icon: 'PS' })
      }
      if (details.xbox.length > 0) {
        baseRows.set('Xbox', { label: 'Xbox', store: 'Xbox Store', details: details.xbox, icon: 'XB' })
      }
      if (details.nintendo.length > 0) {
        baseRows.set('Nintendo', { label: 'Nintendo', store: 'Nintendo eShop', details: details.nintendo, icon: 'NS' })
      }
    }

    const order = ['PC', 'PlayStation', 'Xbox', 'Nintendo']
    return order
      .map((label) => baseRows.get(label))
      .filter((item): item is { label: string; store: string; details: string[]; icon: string } => Boolean(item))
  }, [steamRequirements, safeGame.platforms])

  const platformSummary = platformDetailItems.map((item) => item.label).join(', ')
  const hasHltbLink = Boolean(safeGame.howLongToBeatUrl)

  if (!game) {
    return (
      <div className="card p-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Oyun bulunamadı</h1>
        <p className="text-gray-400 mb-6">Aradığın oyun su anda listede yok.</p>
        <Link to="/games" className="btn-primary inline-flex">Oyunlara Dön</Link>
      </div>
    )
  }

  const statusBadgeClass =
    compatibility.status === 'karsilar'
      ? 'bg-emerald-950 text-emerald-200'
      : compatibility.status === 'sinirda'
        ? 'bg-amber-950 text-amber-200'
        : 'bg-red-950 text-red-200'

  const statusLabel =
    compatibility.status === 'karsilar'
      ? 'Karşılıyor'
      : compatibility.status === 'sinirda'
        ? 'Sınırda'
        : 'Karşılamıyor'

  const shareSummary =
    `${safeGame.title} | Durum: ${statusLabel} | Hedef FPS: ${compatibility.targetFps} | ` +
    `Düşük:${compatibility.avgFpsLow} Orta:${compatibility.avgFpsMedium} Yüksek:${compatibility.avgFpsHigh} | ` +
    `Önerilen Ayar: ${compatibility.suggestedPreset}`

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/games" className="hover:text-gray-300 transition-colors">Oyunlar</Link>
        <span>/</span>
        <span className="text-gray-300">{safeGame.title}</span>
      </div>

      <article className="card p-8">
        <p className="text-sm text-blue-400 font-semibold mb-3">{safeGame.genre.toUpperCase()}</p>
        <h1 className="text-3xl font-bold text-white mb-2">{safeGame.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {awards && awards.gotyWinnerYears.length > 0 && <span className="badge bg-amber-950 text-amber-200">GOTY Kazanan</span>}
          {awards && awards.gotyNomineeYears.length > 0 && <span className="badge bg-blue-950 text-blue-200">GOTY Aday</span>}
          {awards && awards.categoryWins.length > 0 && <span className="badge bg-emerald-950 text-emerald-200">Kategori Ödülü: {awards.categoryWins.length}</span>}
          {awards && awards.categoryNominations.length > 0 && <span className="badge bg-indigo-950 text-indigo-200">Kategori Adaylığı: {awards.categoryNominations.length}</span>}
        </div>
        <p className="text-gray-300 mb-6 max-w-3xl">{safeGame.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Çıkış Yılı</p>
            <p className="text-white font-semibold">{safeGame.releaseYear}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Puan</p>
            <p className="text-white font-semibold">{safeGame.score} / 10</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Platformlar</p>
            <p className="text-white font-semibold">{platformSummary || game.platforms.map((platform) => platformLabels[platform] ?? platform).join(', ')}</p>
            <div className="mt-2 space-y-1">
              {platformDetailItems.map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-blue-950 text-[10px] font-semibold text-blue-200 px-1">{item.icon}</span>
                  <p>
                    <span className="text-gray-400">{item.store}</span>
                    {item.details.length > 0 ? ` (${item.details.join(', ')})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Metacritic</p>
            <p className="text-white font-semibold">{metacriticDisplay}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">HowLongToBeat (Main)</p>
            <p className="text-white font-semibold">{hltbMainDisplay}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">HowLongToBeat (Main + Extra)</p>
            <p className="text-white font-semibold">{hltbMainExtraDisplay}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {game.storeLinks.map((link) => (
            <a
              key={`${game.slug}-${link.label}-${link.url}`}
              className="btn-ghost"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} Mağaza
            </a>
          ))}
          <a className="btn-ghost" href={game.metacriticUrl} target="_blank" rel="noreferrer">{game.metacriticScore === null ? 'Metacritic Ara' : 'Metacritic'}</a>
          {hasHltbLink ? (
            <a className="btn-ghost" href={game.howLongToBeatUrl} target="_blank" rel="noreferrer">HowLongToBeat</a>
          ) : (
            <span className="btn-ghost opacity-50 cursor-not-allowed">HLTB Yok</span>
          )}
          <a className="btn-ghost" href={game.gamespotArticleUrl} target="_blank" rel="noreferrer">GameSpot Haberi</a>
          <a className="btn-primary" href={game.youtubeTrailerUrl} target="_blank" rel="noreferrer">Trailer</a>
          <a className="btn-primary" href={game.youtubeGameplayUrl} target="_blank" rel="noreferrer">Gameplay</a>
          {user && (
            <button
              className={playedOnSite ? 'btn-primary' : 'btn-ghost'}
              onClick={() => {
                const next = togglePlayedInSiteGames(user.email, game.slug)
                setPlayedOnSite(next)
              }}
            >
              {playedOnSite ? 'Oynadım Olarak İşaretli' : 'Bu Oyunu Oynadım'}
            </button>
          )}
        </div>

        {game.dlcs.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">DLC'ler</p>
            <div className="flex flex-col gap-2">
              {game.dlcs.map((dlc) => (
                <a
                  key={`${game.slug}-${dlc.title}-${dlc.url}`}
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  href={dlc.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {dlc.title} ({dlc.store})
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      <section className="card p-6 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Sistem Gereksinimleri</h2>
          <span className={`badge ${statusBadgeClass}`}>{statusLabel}</span>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          Bu oyun için önerilen akıcılık eşiği: en az {compatibility.targetFps} FPS.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300 font-semibold mb-3">Minimum</p>
            {requirementsLoading ? (
              <p className="text-sm text-gray-400">Steam verisi alınıyor...</p>
            ) : steamRequirements?.minimumLines.length ? (
              <ul className="space-y-1 text-sm text-gray-200">
                {steamRequirements.minimumLines.map((line) => (
                  <li key={`min-${line}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Minimum gereksinim bilgisi bulunamadı.</p>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300 font-semibold mb-3">Önerilen</p>
            {requirementsLoading ? (
              <p className="text-sm text-gray-400">Steam verisi alınıyor...</p>
            ) : steamRequirements?.recommendedLines.length ? (
              <ul className="space-y-1 text-sm text-gray-200">
                {steamRequirements.recommendedLines.map((line) => (
                  <li key={`rec-${line}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Önerilen gereksinim bilgisi bulunamadı.</p>
            )}
          </div>
        </div>
        {!requirementsLoading && requirementsError && (
          <p className="mt-3 text-xs text-amber-300">Steam gereksinim verisi alınamadı: {requirementsError}</p>
        )}
        {!requirementsLoading && steamRequirements?.appName && (
          <p className="mt-2 text-xs text-gray-500">Kaynak: Steam ({steamRequirements.appName})</p>
        )}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <label className="text-sm text-gray-300">
            CPU Modeli
            <input
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              list="cpu-models"
              placeholder="Orn: Ryzen 7 7800X3D"
              value={userSystem.cpuModel}
              onChange={(e) => {
                const nextModel = e.target.value
                const matched = getCpuScoreByModel(nextModel)
                setUserSystem((prev) => ({ ...prev, cpuModel: nextModel, cpuScore: matched ?? prev.cpuScore }))
              }}
            />
            <datalist id="cpu-models">
              {cpuModels.map((m) => (
                <option key={m.name} value={m.name} />
              ))}
            </datalist>
            <span className="mt-1 block text-xs text-gray-500">
              {cpuMatchedScore ? 'Model bulundu.' : `Model bulunamadı. Farklı yazım deneyin. (${cpuModels.length} CPU modeli var)`}
            </span>
          </label>

          <label className="text-sm text-gray-300">
            GPU Modeli
            <input
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              list="gpu-models"
              placeholder="Orn: RTX 4070 Super"
              value={userSystem.gpuModel}
              onChange={(e) => {
                const nextModel = e.target.value
                const matched = getGpuScoreByModel(nextModel)
                setUserSystem((prev) => ({ ...prev, gpuModel: nextModel, gpuScore: matched ?? prev.gpuScore }))
              }}
            />
            <datalist id="gpu-models">
              {gpuModels.map((m) => (
                <option key={m.name} value={m.name} />
              ))}
            </datalist>
            <span className="mt-1 block text-xs text-gray-500">
              {gpuMatchedScore ? 'Model bulundu.' : `Model bulunamadı. Farklı yazım deneyin. (${gpuModels.length} GPU modeli var)`}
            </span>
          </label>

          <label className="text-sm text-gray-300">
            RAM (GB)
            <input
              type="number"
              min={4}
              max={128}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              value={userSystem.ramGb}
              onChange={(e) => setUserSystem((prev) => ({ ...prev, ramGb: Number(e.target.value || 0) }))}
            />
          </label>

          <label className="text-sm text-gray-300">
            Çözünürlük
            <select
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              value={userSystem.resolution}
              onChange={(e) => setUserSystem((prev) => ({ ...prev, resolution: e.target.value as UserSystemProfile['resolution'] }))}
            >
              <option value="1080p">1080p</option>
              <option value="1440p">1440p</option>
              <option value="4k">4K</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Düşük</p>
            <p className="text-xl font-bold text-white">~{compatibility.avgFpsLow} FPS</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Orta</p>
            <p className="text-xl font-bold text-white">~{compatibility.avgFpsMedium} FPS</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Yüksek</p>
            <p className="text-xl font-bold text-white">~{compatibility.avgFpsHigh} FPS</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Önerilen Ayar</p>
            <p className="text-xl font-bold text-blue-300">{compatibility.suggestedPreset}</p>
          </div>
        </div>

        {compatibility.notes.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-amber-200">
            {compatibility.notes.map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="btn-ghost"
            onClick={() => {
              setUserSystem(defaultUserSystemProfile)
              setCopied(false)
            }}
          >
            Sistemi Sıfırla
          </button>
          <button
            className="btn-primary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareSummary)
                setCopied(true)
              } catch {
                setCopied(false)
              }
            }}
          >
            Sonucu Paylaş
          </button>
          {copied && <span className="text-sm text-emerald-300 self-center">Kopyalandı.</span>}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Not: FPS değeri tahmindir. Gerçek performans sürücü, patch, sahne yoğunluğu ve arka plan uygulamalarına göre değişir.
        </p>
      </section>

      <section className="card p-6 mt-6">
        <h2 className="text-xl font-semibold text-white">Yorumlar</h2>
        <p className="text-sm text-gray-400 mt-1">Kullanıcılar bu oyuna yorum bırakabilir.</p>

        {user ? (
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!content.trim()) return
              const created = addGameComment({
                gameSlug: game.slug,
                userEmail: user.email,
                userName: user.name,
                rating,
                content: content.trim(),
              })
              setComments((prev) => [created, ...prev])
              setContent('')
              setRating(5)
            }}
          >
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300" htmlFor="rating">Puan</label>
              <select id="rating" className="bg-gray-800 border border-gray-700 rounded px-2 py-1" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <textarea
              className="min-h-24 bg-gray-800 border border-gray-700 rounded p-3 text-sm"
              placeholder="Yorumunu yaz"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn-primary w-fit" type="submit">Yorum Ekle</button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-gray-400">Yorum bırakmak için giriş yap.</p>
        )}

        <div className="mt-6 space-y-3">
          {comments.length === 0 && <p className="text-sm text-gray-400">Henüz yorum yok.</p>}
          {comments.map((comment) => (
            <article key={comment.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white font-medium">{comment.userName}</p>
                  <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString('tr-TR')} - {comment.rating}/5</p>
                </div>
                {user?.email === comment.userEmail && (
                  <button
                    className="text-xs text-red-300 hover:text-red-200"
                    onClick={() => {
                      deleteGameComment(game.slug, comment.id, user.email)
                      setComments((prev) => prev.filter((value) => value.id !== comment.id))
                    }}
                  >
                    Sil
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-200 mt-2">{comment.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

