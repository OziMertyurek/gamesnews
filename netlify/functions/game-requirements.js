import { buildCache } from './_cache.js'

const CACHE_TTL_MS = Number(process.env.GAME_REQUIREMENTS_CACHE_TTL_MS ?? 45 * 60 * 1000)
const cache = buildCache({ namespace: 'game-requirements', ttlMs: CACHE_TTL_MS, maxEntries: 1500 })

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function decodeHtml(input) {
  return String(input ?? '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function stripHtmlToLines(html) {
  const withBreaks = String(html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '- ')

  const plain = decodeHtml(withBreaks).replace(/<[^>]+>/g, ' ')

  return plain
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function scoreCandidate(title, candidateName) {
  const t = normalize(title)
  const c = normalize(candidateName)
  if (!t || !c) return 0
  if (t === c) return 1000
  if (c.startsWith(t)) return 700
  if (t.startsWith(c)) return 650
  if (c.includes(t)) return 520

  const tTokens = new Set(t.split(' '))
  const cTokens = new Set(c.split(' '))
  let overlap = 0
  for (const token of tTokens) {
    if (token && cTokens.has(token)) overlap += 1
  }
  return overlap * 100 - Math.abs(c.length - t.length)
}

function classifyPlatforms(labels) {
  const out = {
    pcDevices: [],
    pcStores: [],
    playstation: [],
    xbox: [],
    nintendo: [],
    other: [],
  }

  for (const labelRaw of labels) {
    const label = String(labelRaw ?? '').trim()
    const l = label.toLowerCase()
    if (!label) continue

    if (/windows|microsoft windows|linux|mac|pc|dos/.test(l)) out.pcDevices.push(label)
    else if (/playstation|\bps[0-9]\b|ps vita|psp/.test(l)) out.playstation.push(label)
    else if (/xbox/.test(l)) out.xbox.push(label)
    else if (/nintendo|switch|wii|game boy|gameboy|3ds|ds\b/.test(l)) out.nintendo.push(label)
    else out.other.push(label)
  }

  for (const key of Object.keys(out)) {
    out[key] = [...new Set(out[key])]
  }

  return out
}

async function findSteamAppByTitle(title) {
  const key = `steam-search:${normalize(title)}`
  const result = await cache.getOrSet(key, async () => {
    const params = new URLSearchParams({
      term: String(title ?? '').trim(),
      l: 'english',
      cc: 'us',
    })
    const response = await fetch(`https://store.steampowered.com/api/storesearch/?${params.toString()}`)
    if (!response.ok) throw new Error('Steam storesearch istegi basarisiz.')

    const payload = await response.json()
    const items = Array.isArray(payload?.items) ? payload.items : []
    if (!items.length) return null

    const best = items
      .map((item) => ({ item, score: scoreCandidate(title, item?.name) }))
      .sort((a, b) => b.score - a.score)[0]?.item

    if (!best?.id) return null
    return { appId: Number(best.id), appName: String(best.name ?? title) }
  })
  return result.value
}

async function getSteamRequirementsByAppId(appId) {
  const key = `steam-appdetails:${appId}`
  const result = await cache.getOrSet(key, async () => {
    const params = new URLSearchParams({ appids: String(appId), l: 'english', cc: 'us' })
    const response = await fetch(`https://store.steampowered.com/api/appdetails?${params.toString()}`)
    if (!response.ok) throw new Error('Steam appdetails istegi basarisiz.')

    const payload = await response.json()
    const root = payload?.[String(appId)]
    const data = root?.data
    if (!root?.success || !data) return null

    const pcReq = data.pc_requirements || {}
    const minLines = stripHtmlToLines(pcReq.minimum || '')
    const recLines = stripHtmlToLines(pcReq.recommended || '')

    return {
      appId,
      appName: String(data.name ?? ''),
      minimumLines: minLines,
      recommendedLines: recLines,
    }
  })
  return result.value
}

async function getWikidataPlatforms(title) {
  const key = `wikidata-platforms:${normalize(title)}`
  const result = await cache.getOrSet(key, async () => {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(title)}&language=en&format=json&type=item`
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) return []
    const searchJson = await searchRes.json()
    const list = Array.isArray(searchJson?.search) ? searchJson.search : []
    if (!list.length) return []

    const best = list
      .map((item) => {
        const label = String(item?.label ?? '')
        const desc = String(item?.description ?? '').toLowerCase()
        let bonus = 0
        if (desc.includes('video game')) bonus += 200
        if (desc.includes('expansion')) bonus -= 120
        return { item, score: scoreCandidate(title, label) + bonus }
      })
      .sort((a, b) => b.score - a.score)[0]?.item

    const qid = best?.id
    if (!qid) return []

    const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
    const entityRes = await fetch(entityUrl)
    if (!entityRes.ok) return []
    const entityJson = await entityRes.json()
    const claims = entityJson?.entities?.[qid]?.claims?.P400
    if (!Array.isArray(claims) || !claims.length) return []

    const ids = [...new Set(claims
      .map((claim) => claim?.mainsnak?.datavalue?.value?.id)
      .filter(Boolean))]

    if (!ids.length) return []

    const labelsUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=en&format=json`
    const labelsRes = await fetch(labelsUrl)
    if (!labelsRes.ok) return []
    const labelsJson = await labelsRes.json()
    const entities = labelsJson?.entities || {}

    const labels = ids
      .map((id) => entities?.[id]?.labels?.en?.value)
      .filter(Boolean)

    return [...new Set(labels)]
  })
  return result.value
}

async function getPcStoresFromCheapShark(title) {
  const key = `pc-stores:${normalize(title)}`
  const result = await cache.getOrSet(key, async () => {
    const storesRes = await fetch('https://www.cheapshark.com/api/1.0/stores')
    if (!storesRes.ok) return []
    const stores = await storesRes.json()
    const storeMap = new Map((Array.isArray(stores) ? stores : []).map((s) => [String(s.storeID), String(s.storeName)]))

    const gamesUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(title)}&limit=10`
    const gamesRes = await fetch(gamesUrl)
    if (!gamesRes.ok) return []
    const games = await gamesRes.json()
    const best = (Array.isArray(games) ? games : [])
      .map((g) => ({ g, score: scoreCandidate(title, g?.external) }))
      .sort((a, b) => b.score - a.score)[0]?.g

    const gameId = best?.gameID
    if (!gameId) return []

    const dealsRes = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameId}`)
    if (!dealsRes.ok) return []
    const dealsJson = await dealsRes.json()
    const deals = Array.isArray(dealsJson?.deals) ? dealsJson.deals : []

    const preferred = ['Steam', 'Epic Games Store', 'GOG', 'Ubisoft Store', 'EA App', 'Humble Store', 'Fanatical', 'GreenManGaming']
    const names = [...new Set(deals
      .map((d) => storeMap.get(String(d?.storeID ?? '')))
      .filter(Boolean))]

    return names
      .sort((a, b) => {
        const ai = preferred.findIndex((x) => a.includes(x))
        const bi = preferred.findIndex((x) => b.includes(x))
        const aa = ai === -1 ? 999 : ai
        const bb = bi === -1 ? 999 : bi
        return aa - bb || a.localeCompare(b)
      })
  })
  return result.value
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const title = String(body.title ?? '').trim()
    const appIdInput = body.appId ? Number(body.appId) : null

    if (!title && !appIdInput) {
      return { statusCode: 400, body: JSON.stringify({ error: 'title veya appId gerekli.' }) }
    }

    const cacheKey = `payload:${normalize(title)}:${appIdInput ?? ''}`
    const payloadResult = await cache.getOrSet(cacheKey, async () => {
      let target = null
      if (appIdInput && Number.isFinite(appIdInput)) {
        target = { appId: appIdInput, appName: title || '' }
      } else {
        target = await findSteamAppByTitle(title)
      }

      const [steamReq, wikidataPlatforms, pcStores] = await Promise.all([
        target ? getSteamRequirementsByAppId(target.appId).catch(() => null) : Promise.resolve(null),
        title ? getWikidataPlatforms(title).catch(() => []) : Promise.resolve([]),
        title ? getPcStoresFromCheapShark(title).catch(() => []) : Promise.resolve([]),
      ])

      if (!steamReq && wikidataPlatforms.length === 0 && pcStores.length === 0) return null

      const grouped = classifyPlatforms(wikidataPlatforms)
      grouped.pcStores = pcStores

      return {
        source: 'steam+wikidata+cheapshark',
        appId: steamReq?.appId ?? target?.appId ?? null,
        appName: steamReq?.appName || target?.appName || title,
        minimumLines: steamReq?.minimumLines ?? [],
        recommendedLines: steamReq?.recommendedLines ?? [],
        platformDetails: grouped,
      }
    })

    if (!payloadResult.value) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Yeterli platform/gereksinim verisi bulunamadi.' }) }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-AAG-Cache': payloadResult.hit ? 'HIT' : 'MISS',
      },
      body: JSON.stringify(payloadResult.value),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gereksinim verisi cekilemedi.'
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}
