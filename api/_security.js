const RATE_LIMITS = new Map()

function getIp(req) {
  const xfwd = req.headers['x-forwarded-for']
  if (typeof xfwd === 'string' && xfwd.length > 0) {
    return xfwd.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

export function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

export function checkRateLimit(req, key, { limit, windowMs }) {
  const ip = getIp(req)
  const bucketKey = `${key}:${ip}`
  const now = Date.now()
  const row = RATE_LIMITS.get(bucketKey)

  if (!row || now - row.startAt >= windowMs) {
    RATE_LIMITS.set(bucketKey, { startAt: now, count: 1 })
    return { ok: true }
  }

  if (row.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - row.startAt)) / 1000) }
  }

  row.count += 1
  RATE_LIMITS.set(bucketKey, row)
  return { ok: true }
}
