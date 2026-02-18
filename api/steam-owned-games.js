function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function parseSteamId(input) {
  const value = String(input ?? '').trim()
  if (!value) return null
  if (/^\d{17}$/.test(value)) return value
  const profileMatch = value.match(/steamcommunity\.com\/profiles\/(\d{17})/i)
  if (profileMatch?.[1]) return profileMatch[1]
  return null
}

async function resolveSteamId(apiKey, steamIdOrProfile) {
  const direct = parseSteamId(steamIdOrProfile)
  if (direct) return direct

  const trimmed = String(steamIdOrProfile ?? '').trim()
  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/i)
  const vanity = vanityMatch?.[1] ?? trimmed
  if (!vanity) throw new Error('Steam ID veya profil linki gerekli.')

  const params = new URLSearchParams({
    key: apiKey,
    vanityurl: vanity,
    format: 'json',
  })
  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('ResolveVanityURL istegi basarisiz.')
  const payload = await response.json()
  const resolved = payload?.response
  if (resolved?.success === 1 && resolved.steamid) return resolved.steamid
  throw new Error('Steam vanity link cozulemedi. 17 haneli SteamID64 kullan.')
}

async function getOwnedGames(apiKey, steamId) {
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId,
    include_appinfo: 'true',
    include_played_free_games: 'true',
    format: 'json',
  })
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('GetOwnedGames istegi basarisiz.')
  const payload = await response.json()
  const games = payload?.response?.games ?? []
  return games.map((game) => ({
    appId: game.appid,
    name: game.name,
    playtimeHours: Number(((game.playtime_forever ?? 0) / 60).toFixed(1)),
    iconUrl: game.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      : null,
  }))
}

export default async function handler(req, res) {
  withCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const apiKey = String(process.env.STEAM_WEB_API_KEY ?? body.apiKey ?? '').trim()
    const steamIdOrProfile = String(body.steamIdOrProfile ?? '').trim()

    if (!apiKey) return res.status(400).json({ error: 'Steam API key gerekli.' })
    if (!/^[A-Fa-f0-9]{32}$/.test(apiKey)) return res.status(400).json({ error: 'Steam API key formati gecersiz.' })
    if (!steamIdOrProfile) return res.status(400).json({ error: 'SteamID64 veya profil linki gerekli.' })

    const steamId = await resolveSteamId(apiKey, steamIdOrProfile)
    const games = await getOwnedGames(apiKey, steamId)
    return res.status(200).json({ steamId, games })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Steam verisi cekilemedi.'
    return res.status(500).json({ error: message })
  }
}
