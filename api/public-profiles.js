import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'public-profiles', { limit: 120, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  try {
    const adminClient = createAdminClient()
    const q = String(req.query?.q ?? '').trim()
    const id = String(req.query?.id ?? '').trim()

    if (id) {
      const { data, error } = await adminClient
        .from('profiles')
        .select('id,name')
        .eq('id', id)
        .single()
      if (error || !data) return json(res, 404, { error: 'Profile not found.' })
      return json(res, 200, { profile: { id: String(data.id), name: String(data.name ?? 'Kullanici') } })
    }

    let query = adminClient.from('profiles').select('id,name').limit(15).order('name', { ascending: true })
    if (q.length >= 2) {
      query = query.ilike('name', `%${q}%`)
    }

    const { data, error } = await query
    if (error) return json(res, 500, { error: error.message })

    return json(res, 200, {
      profiles: (data ?? []).map((row) => ({
        id: String(row.id),
        name: String(row.name ?? 'Kullanici'),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
