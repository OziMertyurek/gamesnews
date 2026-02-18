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
    const apiKey = String(process.env.STEAM_WEB_API_KEY ?? body.apiKey ?? '').trim()
    const steamIdOrProfile = String(body.steamIdOrProfile ?? '').trim()

    if (!apiKey) return { statusCode: 400, body: JSON.stringify({ error: 'Steam API key gerekli.' }) }
    if (!/^[A-Fa-f0-9]{32}$/.test(apiKey)) return { statusCode: 400, body: JSON.stringify({ error: 'Steam API key formati gecersiz.' }) }
    if (!steamIdOrProfile) return { statusCode: 400, body: JSON.stringify({ error: 'SteamID64 veya profil linki gerekli.' }) }

    const steamId = await resolveSteamId(apiKey, steamIdOrProfile)
    const games = await getOwnedGames(apiKey, steamId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ steamId, games }),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Steam verisi cekilemedi.'
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}
