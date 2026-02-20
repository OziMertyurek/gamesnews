import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient, readBearerToken, requireAdmin } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const rl = checkRateLimit(req, 'admin-review-approvals', { limit: 30, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  try {
    const adminClient = createAdminClient()
    const token = readBearerToken(req)
    const requester = await requireAdmin(adminClient, token)
    if (!requester.ok) return json(res, requester.status, { error: requester.error })

    if (req.method === 'GET') {
      const { data, error } = await adminClient
        .from('review_approvals')
        .select('slug')
        .order('created_at', { ascending: false })
      if (error) return json(res, 500, { error: error.message })
      return json(res, 200, { slugs: (data ?? []).map((row) => String(row.slug)) })
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const slug = String(body.slug ?? '').trim()
      const title = String(body.title ?? '').trim()
      if (!slug) return json(res, 400, { error: 'Slug is required.' })

      const { error: insertError } = await adminClient
        .from('review_approvals')
        .upsert({ slug, approved_by: requester.requesterEmail }, { onConflict: 'slug' })
      if (insertError) return json(res, 500, { error: insertError.message })

      await adminClient.from('admin_audit_logs').insert({
        admin_email: requester.requesterEmail,
        action: 'needs_review_approve',
        target: slug,
        detail: `Approved review item: ${title || slug}`,
      })

      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
