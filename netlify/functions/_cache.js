const GLOBAL_KEY = '__AAG_SERVER_CACHE_V1__'

function getGlobalBuckets() {
  const root = globalThis
  if (!root[GLOBAL_KEY]) {
    root[GLOBAL_KEY] = new Map()
  }
  return root[GLOBAL_KEY]
}

export function buildCache(options = {}) {
  const namespace = String(options.namespace ?? 'default')
  const ttlMs = Number(options.ttlMs ?? 45 * 60 * 1000)
  const maxEntries = Math.max(50, Number(options.maxEntries ?? 1000))
  const buckets = getGlobalBuckets()
  if (!buckets.has(namespace)) {
    buckets.set(namespace, new Map())
  }
  const bucket = buckets.get(namespace)

  function evictIfNeeded() {
    while (bucket.size > maxEntries) {
      const oldestKey = bucket.keys().next().value
      if (!oldestKey) break
      bucket.delete(oldestKey)
    }
  }

  function get(key) {
    const now = Date.now()
    const entry = bucket.get(key)
    if (!entry) return null
    if (entry.expiresAt <= now) {
      bucket.delete(key)
      return null
    }
    if (entry.value === undefined) return null
    return entry.value
  }

  function set(key, value, customTtlMs = ttlMs) {
    bucket.set(key, {
      value,
      expiresAt: Date.now() + Number(customTtlMs),
      updatedAt: Date.now(),
    })
    evictIfNeeded()
    return value
  }

  async function getOrSet(key, producer, customTtlMs = ttlMs) {
    const now = Date.now()
    const existing = bucket.get(key)
    if (existing && existing.expiresAt > now) {
      if (existing.value !== undefined) return { value: existing.value, hit: true }
      if (existing.inflight) {
        const value = await existing.inflight
        return { value, hit: true }
      }
    }

    const inflight = Promise.resolve().then(producer)
    bucket.set(key, {
      value: undefined,
      inflight,
      expiresAt: now + Number(customTtlMs),
      updatedAt: now,
    })

    try {
      const value = await inflight
      set(key, value, customTtlMs)
      return { value, hit: false }
    } catch (error) {
      bucket.delete(key)
      throw error
    }
  }

  return { get, set, getOrSet }
}
