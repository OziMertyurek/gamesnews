import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function readBody(req: import('http').IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function parseSteamId(input: string) {
  const value = input.trim()
  if (/^\d{17}$/.test(value)) return value
  const profileMatch = value.match(/steamcommunity\.com\/profiles\/(\d{17})/i)
  if (profileMatch?.[1]) return profileMatch[1]
  return null
}

async function resolveSteamId(apiKey: string, steamIdOrProfile: string) {
  const direct = parseSteamId(steamIdOrProfile)
  if (direct) return direct

  const vanityMatch = steamIdOrProfile.match(/steamcommunity\.com\/id\/([^/]+)/i)
  const vanity = vanityMatch?.[1] ?? steamIdOrProfile.trim()
  if (!vanity) throw new Error('Steam ID veya profil linki gerekli.')

  const params = new URLSearchParams({
    key: apiKey,
    vanityurl: vanity,
    format: 'json',
  })
  const response = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?${params.toString()}`)
  if (!response.ok) throw new Error('ResolveVanityURL istegi basarisiz.')
  const payload = await response.json() as { response?: { success?: number; steamid?: string } }
  if (payload.response?.success === 1 && payload.response.steamid) return payload.response.steamid
  throw new Error('Steam vanity link cozulemedi. 17 haneli SteamID64 kullan.')
}

async function getOwnedGames(apiKey: string, steamId: string) {
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId,
    include_appinfo: 'true',
    include_played_free_games: 'true',
    format: 'json',
  })
  const response = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params.toString()}`)
  if (!response.ok) throw new Error('GetOwnedGames istegi basarisiz.')
  const payload = await response.json() as { response?: { games?: Array<{ appid: number; name: string; playtime_forever: number; img_icon_url?: string }> } }
  const games = payload.response?.games ?? []
  return games.map((game) => ({
    appId: game.appid,
    name: game.name,
    playtimeHours: Number(((game.playtime_forever ?? 0) / 60).toFixed(1)),
    iconUrl: game.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      : null,
  }))
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, '\'')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function stripHtmlToLines(html: string) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '- ')

  const plain = decodeHtmlEntities(withBreaks).replace(/<[^>]+>/g, ' ')
  return plain
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function candidateScore(title: string, candidateName: string) {
  const t = normalizeText(title)
  const c = normalizeText(candidateName)
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

async function findSteamAppByTitle(title: string) {
  const params = new URLSearchParams({
    term: title.trim(),
    l: 'english',
    cc: 'us',
  })
  const response = await fetch(`https://store.steampowered.com/api/storesearch/?${params.toString()}`)
  if (!response.ok) throw new Error('Steam storesearch istegi basarisiz.')

  const payload = await response.json() as { items?: Array<{ id?: number; name?: string }> }
  const items = payload.items ?? []
  if (!items.length) return null

  const best = items
    .map((item) => ({ item, score: candidateScore(title, String(item.name ?? '')) }))
    .sort((a, b) => b.score - a.score)[0]?.item

  if (!best?.id) return null
  return { appId: Number(best.id), appName: String(best.name ?? title) }
}

async function getSteamRequirementsByAppId(appId: number) {
  const params = new URLSearchParams({ appids: String(appId), l: 'english', cc: 'us' })
  const response = await fetch(`https://store.steampowered.com/api/appdetails?${params.toString()}`)
  if (!response.ok) throw new Error('Steam appdetails istegi basarisiz.')

  const payload = await response.json() as Record<string, { success?: boolean; data?: { name?: string; pc_requirements?: { minimum?: string; recommended?: string } } }>
  const root = payload[String(appId)]
  const data = root?.data
  if (!root?.success || !data) return null

  const minLines = stripHtmlToLines(data.pc_requirements?.minimum ?? '')
  const recLines = stripHtmlToLines(data.pc_requirements?.recommended ?? '')

  return {
    appId,
    appName: String(data.name ?? ''),
    minimumLines: minLines,
    recommendedLines: recLines,
  }
}

function classifyPlatforms(labels: string[]) {
  const grouped = {
    pcDevices: [] as string[],
    pcStores: [] as string[],
    playstation: [] as string[],
    xbox: [] as string[],
    nintendo: [] as string[],
    other: [] as string[],
  }

  for (const labelRaw of labels) {
    const label = String(labelRaw ?? '').trim()
    const l = label.toLowerCase()
    if (!label) continue

    if (/windows|microsoft windows|linux|mac|pc|dos/.test(l)) grouped.pcDevices.push(label)
    else if (/playstation|\bps[0-9]\b|ps vita|psp/.test(l)) grouped.playstation.push(label)
    else if (/xbox/.test(l)) grouped.xbox.push(label)
    else if (/nintendo|switch|wii|game boy|gameboy|3ds|ds\b/.test(l)) grouped.nintendo.push(label)
    else grouped.other.push(label)
  }

  return {
    pcDevices: [...new Set(grouped.pcDevices)],
    pcStores: [] as string[],
    playstation: [...new Set(grouped.playstation)],
    xbox: [...new Set(grouped.xbox)],
    nintendo: [...new Set(grouped.nintendo)],
    other: [...new Set(grouped.other)],
  }
}

async function getWikidataPlatforms(title: string) {
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(title)}&language=en&format=json&type=item`
  const searchRes = await fetch(searchUrl)
  if (!searchRes.ok) return [] as string[]
  const searchJson = await searchRes.json() as { search?: Array<{ id?: string; label?: string; description?: string }> }
  const list = searchJson.search ?? []
  if (!list.length) return [] as string[]

  const best = list
    .map((item) => {
      const label = String(item.label ?? '')
      const desc = String(item.description ?? '').toLowerCase()
      let bonus = 0
      if (desc.includes('video game')) bonus += 200
      if (desc.includes('expansion')) bonus -= 120
      return { item, score: candidateScore(title, label) + bonus }
    })
    .sort((a, b) => b.score - a.score)[0]?.item

  const qid = best?.id
  if (!qid) return [] as string[]

  const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
  const entityRes = await fetch(entityUrl)
  if (!entityRes.ok) return [] as string[]
  const entityJson = await entityRes.json() as Record<string, any>
  const claims = entityJson?.entities?.[qid]?.claims?.P400 as Array<any> | undefined
  if (!claims?.length) return [] as string[]

  const ids = [...new Set(claims.map((claim) => claim?.mainsnak?.datavalue?.value?.id).filter(Boolean))] as string[]
  if (!ids.length) return [] as string[]

  const labelsUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=en&format=json`
  const labelsRes = await fetch(labelsUrl)
  if (!labelsRes.ok) return [] as string[]
  const labelsJson = await labelsRes.json() as { entities?: Record<string, { labels?: { en?: { value?: string } } }> }
  const entities = labelsJson.entities ?? {}

  return ids
    .map((id) => entities[id]?.labels?.en?.value)
    .filter((value): value is string => Boolean(value))
}

async function getPcStoresFromCheapShark(title: string) {
  const storesRes = await fetch('https://www.cheapshark.com/api/1.0/stores')
  if (!storesRes.ok) return [] as string[]
  const stores = await storesRes.json() as Array<{ storeID?: string; storeName?: string }>
  const storeMap = new Map(stores.map((s) => [String(s.storeID ?? ''), String(s.storeName ?? '')]))

  const gamesUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(title)}&limit=10`
  const gamesRes = await fetch(gamesUrl)
  if (!gamesRes.ok) return [] as string[]
  const games = await gamesRes.json() as Array<{ external?: string; gameID?: string }>
  const best = games
    .map((g) => ({ g, score: candidateScore(title, String(g.external ?? '')) }))
    .sort((a, b) => b.score - a.score)[0]?.g

  const gameId = best?.gameID
  if (!gameId) return [] as string[]

  const dealsRes = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameId}`)
  if (!dealsRes.ok) return [] as string[]
  const dealsJson = await dealsRes.json() as { deals?: Array<{ storeID?: string }> }
  const deals = dealsJson.deals ?? []

  const preferred = ['Steam', 'Epic Games Store', 'GOG', 'Ubisoft Store', 'EA App', 'Humble Store', 'Fanatical', 'GreenManGaming']
  const names = [...new Set(deals.map((d) => storeMap.get(String(d.storeID ?? ''))).filter((x): x is string => Boolean(x)))]
  return names.sort((a, b) => {
    const ai = preferred.findIndex((x) => a.includes(x))
    const bi = preferred.findIndex((x) => b.includes(x))
    const aa = ai === -1 ? 999 : ai
    const bb = bi === -1 ? 999 : bi
    return aa - bb || a.localeCompare(b)
  })
}

function steamDevProxy() {
  return {
    name: 'steam-dev-proxy',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/steam-owned-games', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end('')
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const raw = await readBody(req)
          const body = raw ? JSON.parse(raw) as { apiKey?: string; steamIdOrProfile?: string } : {}
          const apiKey = String(process.env.STEAM_WEB_API_KEY ?? body.apiKey ?? '').trim()
          const steamIdOrProfile = String(body.steamIdOrProfile ?? '').trim()

          if (!apiKey) throw new Error('Steam API key gerekli.')
          if (!/^[A-Fa-f0-9]{32}$/.test(apiKey)) throw new Error('Steam API key formati gecersiz.')
          if (!steamIdOrProfile) throw new Error('SteamID64 veya profil linki gerekli.')

          const steamId = await resolveSteamId(apiKey, steamIdOrProfile)
          const games = await getOwnedGames(apiKey, steamId)

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ steamId, games }))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Steam verisi cekilemedi.' }))
        }
      })

      server.middlewares.use('/api/game-requirements', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end('')
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const raw = await readBody(req)
          const body = raw ? JSON.parse(raw) as { title?: string; appId?: number } : {}
          const title = String(body.title ?? '').trim()
          const appIdInput = body.appId ? Number(body.appId) : null

          if (!title && !appIdInput) {
            throw new Error('title veya appId gerekli.')
          }

          let target: { appId: number; appName: string } | null
          if (appIdInput && Number.isFinite(appIdInput)) {
            target = { appId: appIdInput, appName: title || '' }
          } else {
            target = await findSteamAppByTitle(title)
          }

          const [requirements, wikidataPlatforms, pcStores] = await Promise.all([
            target ? getSteamRequirementsByAppId(target.appId).catch(() => null) : Promise.resolve(null),
            title ? getWikidataPlatforms(title).catch(() => []) : Promise.resolve([]),
            title ? getPcStoresFromCheapShark(title).catch(() => []) : Promise.resolve([]),
          ])

          if (!requirements && wikidataPlatforms.length === 0 && pcStores.length === 0) {
            throw new Error('Yeterli platform/gereksinim verisi bulunamadi.')
          }

          const grouped = classifyPlatforms(wikidataPlatforms)
          grouped.pcStores = pcStores

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            source: 'steam+wikidata+cheapshark',
            appId: requirements?.appId ?? target?.appId ?? null,
            appName: requirements?.appName || target?.appName || title,
            minimumLines: requirements?.minimumLines ?? [],
            recommendedLines: requirements?.recommendedLines ?? [],
            platformDetails: grouped,
          }))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Gereksinim verisi cekilemedi.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    steamDevProxy(),
  ],
})
