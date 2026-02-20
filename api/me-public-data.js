import { checkRateLimit, withCors } from './_security.js'
import { requireUser } from './_user.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'me-public-data', { limit: 120, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  const auth = await requireUser(req)
  if (!auth.ok) return json(res, auth.status, { error: auth.error })

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const op = String(body.op ?? '')

  try {
    if (op === 'upsert_extras') {
      const steamProfileUrl = String(body.steamProfileUrl ?? '').trim()
      const playedGameSlugs = Array.isArray(body.playedGameSlugs) ? body.playedGameSlugs.map((v) => String(v)) : []
      const steamGames = Array.isArray(body.steamGames) ? body.steamGames : []

      const { error } = await auth.adminClient
        .from('profile_public_data')
        .upsert({
          profile_id: auth.profileId,
          steam_profile_url: steamProfileUrl,
          played_game_slugs: playedGameSlugs,
          steam_games: steamGames,
        }, { onConflict: 'profile_id' })
      if (error) return json(res, 500, { error: error.message })
      return json(res, 200, { ok: true })
    }

    if (op === 'add_comment') {
      const gameSlug = String(body.gameSlug ?? '').trim()
      const rating = Number(body.rating ?? 0)
      const content = String(body.content ?? '').trim()
      if (!gameSlug || !content) return json(res, 400, { error: 'Invalid comment payload.' })

      const { error } = await auth.adminClient
        .from('profile_comments')
        .insert({
          profile_id: auth.profileId,
          game_slug: gameSlug,
          rating,
          content,
        })
      if (error) return json(res, 500, { error: error.message })
      return json(res, 200, { ok: true })
    }

    if (op === 'delete_comment') {
      const commentId = String(body.commentId ?? '').trim()
      if (!commentId) return json(res, 400, { error: 'commentId is required.' })

      const { error } = await auth.adminClient
        .from('profile_comments')
        .delete()
        .eq('id', commentId)
        .eq('profile_id', auth.profileId)
      if (error) return json(res, 500, { error: error.message })
      return json(res, 200, { ok: true })
    }

    return json(res, 400, { error: 'Unknown operation.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
