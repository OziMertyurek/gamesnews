import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'public-profile-details', { limit: 120, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  const id = String(req.query?.id ?? '').trim()
  if (!id) return json(res, 400, { error: 'id is required.' })

  try {
    const adminClient = createAdminClient()

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id,name')
      .eq('id', id)
      .single()
    if (profileError || !profile) return json(res, 404, { error: 'Profile not found.' })

    const { data: extras } = await adminClient
      .from('profile_public_data')
      .select('steam_profile_url,played_game_slugs,steam_games')
      .eq('profile_id', id)
      .single()

    const { data: comments } = await adminClient
      .from('profile_comments')
      .select('id,game_slug,rating,content,created_at')
      .eq('profile_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    return json(res, 200, {
      profile: {
        id: String(profile.id),
        name: String(profile.name ?? 'Kullanici'),
      },
      extras: {
        steamProfileUrl: String(extras?.steam_profile_url ?? ''),
        playedGameSlugs: Array.isArray(extras?.played_game_slugs) ? extras.played_game_slugs.map((v) => String(v)) : [],
        steamGames: Array.isArray(extras?.steam_games) ? extras.steam_games : [],
      },
      comments: Array.isArray(comments)
        ? comments.map((row) => ({
            id: String(row.id),
            gameSlug: String(row.game_slug),
            rating: Number(row.rating ?? 0),
            content: String(row.content ?? ''),
            createdAt: String(row.created_at ?? ''),
          }))
        : [],
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
