import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { games } from '../data/siteContent'
import { getCurrentUser } from '../lib/auth'
import { addGameComment, deleteGameComment, getGameComments, isPlayedInSiteGames, togglePlayedInSiteGames, type GameComment } from '../lib/community'
import { getGameAwardSummary } from '../lib/awards'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const game = games.find((item) => item.slug === slug)
  const user = getCurrentUser()
  const awards = useMemo(() => (game ? getGameAwardSummary(game.title) : null), [game])

  const [comments, setComments] = useState<GameComment[]>([])
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [playedOnSite, setPlayedOnSite] = useState(false)

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

  if (!game) {
    return (
      <div className="card p-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Oyun bulunamadi</h1>
        <p className="text-gray-400 mb-6">Aradigin oyun su anda listede yok.</p>
        <Link to="/games" className="btn-primary inline-flex">Oyunlara Don</Link>
      </div>
    )
  }

  const metacriticDisplay = game.metacriticScore !== null ? `${game.metacriticScore} / 100` : `${Math.round(game.score * 10)} / 100 (Site Puani)`
  const hltbMainDisplay = game.howLongToBeatMainHours !== null ? `${game.howLongToBeatMainHours} saat` : 'Kaynakta bulunamadi'
  const hltbMainExtraDisplay = game.howLongToBeatMainExtraHours !== null ? `${game.howLongToBeatMainExtraHours} saat` : 'Kaynakta bulunamadi'

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/games" className="hover:text-gray-300 transition-colors">Oyunlar</Link>
        <span>/</span>
        <span className="text-gray-300">{game.title}</span>
      </div>

      <article className="card p-8">
        <p className="text-sm text-blue-400 font-semibold mb-3">{game.genre.toUpperCase()}</p>
        <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {awards && awards.gotyWinnerYears.length > 0 && <span className="badge bg-amber-950 text-amber-200">GOTY Kazanan</span>}
          {awards && awards.gotyNomineeYears.length > 0 && <span className="badge bg-blue-950 text-blue-200">GOTY Aday</span>}
          {awards && awards.categoryWins.length > 0 && <span className="badge bg-emerald-950 text-emerald-200">Kategori Odulu: {awards.categoryWins.length}</span>}
          {awards && awards.categoryNominations.length > 0 && <span className="badge bg-indigo-950 text-indigo-200">Kategori Adayligi: {awards.categoryNominations.length}</span>}
        </div>
        <p className="text-gray-300 mb-6 max-w-3xl">{game.summary}</p>
        {awards && (awards.categoryWins.length > 0 || awards.categoryNominations.length > 0) && (
          <div className="mb-6 space-y-2">
            {awards.categoryWins.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {awards.categoryWins.slice(0, 6).map((entry) => (
                  <span key={`win-${entry.year}-${entry.category}`} className="badge bg-emerald-950 text-emerald-200">
                    {entry.year} - {entry.category}
                  </span>
                ))}
              </div>
            )}
            {awards.categoryNominations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {awards.categoryNominations.slice(0, 6).map((entry) => (
                  <span key={`nom-${entry.year}-${entry.category}`} className="badge bg-indigo-950 text-indigo-200">
                    {entry.year} - {entry.category} (Aday)
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Cikis Yili</p>
            <p className="text-white font-semibold">{game.releaseYear}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Puan</p>
            <p className="text-white font-semibold">{game.score} / 10</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Platformlar</p>
            <p className="text-white font-semibold">{game.platforms.map((platform) => platformLabels[platform] ?? platform).join(', ')}</p>
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

        {(game.metacriticScore === null || game.howLongToBeatMainHours === null || game.howLongToBeatMainExtraHours === null) && (
          <p className="mt-3 text-xs text-gray-400">
            Bazi dis kaynak verileri eksik oldugunda sitedeki puan ve baglantilarla fallback gosterilir.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn-ghost" href={game.metacriticUrl} target="_blank" rel="noreferrer">{game.metacriticScore === null ? 'Metacritic Ara' : 'Metacritic'}</a>
          <a className="btn-ghost" href={game.howLongToBeatUrl} target="_blank" rel="noreferrer">HowLongToBeat</a>
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
              {playedOnSite ? 'Oynadim Olarak Isaretli' : 'Bu Oyunu Oynadim'}
            </button>
          )}
        </div>
      </article>

      <section className="card p-6 mt-6">
        <h2 className="text-xl font-semibold text-white">Yorumlar</h2>
        <p className="text-sm text-gray-400 mt-1">Kullanicilar bu oyuna yorum birakabilir.</p>

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
          <p className="mt-4 text-sm text-gray-400">Yorum birakmak icin giris yap.</p>
        )}

        <div className="mt-6 space-y-3">
          {comments.length === 0 && <p className="text-sm text-gray-400">Henuz yorum yok.</p>}
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
