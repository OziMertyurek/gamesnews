import { checkRateLimit, withCors } from './_security.js'
import { createAdminClient, readBearerToken, requireAdmin } from './_admin.js'

function json(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const rl = checkRateLimit(req, 'admin-user-role', { limit: 20, windowMs: 60 * 1000 })
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfterSec))
    return json(res, 429, { error: 'Too many requests.' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const targetEmail = String(body.email || '').trim().toLowerCase()
  const role = body.role === 'admin' ? 'admin' : body.role === 'user' ? 'user' : ''
  if (!targetEmail) return json(res, 400, { error: 'Email is required.' })
  if (!role) return json(res, 400, { error: 'Role must be user or admin.' })

  try {
    const adminClient = createAdminClient()
    const token = readBearerToken(req)
    const requester = await requireAdmin(adminClient, token)
    if (!requester.ok) return json(res, requester.status, { error: requester.error })

    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ role })
      .eq('email', targetEmail)

    if (updateError) {
      return json(res, 500, { error: updateError.message })
    }

    await adminClient.from('admin_audit_logs').insert({
      admin_email: requester.requesterEmail,
      action: 'role_change',
      target: targetEmail,
      detail: `Role -> ${role}`,
    })

    return json(res, 200, { ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return json(res, 500, { error: message })
  }
}
