import type { SteamOwnedGame } from './community'

interface SteamOwnedGamesResponse {
  response?: {
    games?: Array<{
      appid: number
      name: string
      playtime_forever: number
      img_icon_url?: string
    }>
  }
}

interface SteamProxyResponse {
  steamId: string
  games: SteamOwnedGame[]
}

function validateSteamIdOrProfileInput(value: string) {
  const trimmed = value.trim()
  const profilesAnyDigitsMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d+)/i)
  if (profilesAnyDigitsMatch?.[1] && profilesAnyDigitsMatch[1].length !== 17) {
    throw new Error('Steam profil linkindeki ID 17 haneli degil. Dogru SteamID64 kullan.')
  }
}

function buildSteamOwnedGamesUrl(apiKey: string, steamId: string) {
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId,
    include_appinfo: 'true',
    include_played_free_games: 'true',
    format: 'json',
  })
  return `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params.toString()}`
}

async function tryBackendProxy(apiKey: string, steamIdOrProfile: string) {
  const endpoints = ['/api/steam-owned-games', '/.netlify/functions/steam-owned-games']
  let lastError = ''

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, steamIdOrProfile }),
      })

      if (!response.ok) {
        const text = await response.text()
        lastError = text || `${response.status}`
        continue
      }

      const payload = (await response.json()) as SteamProxyResponse
      if (payload?.steamId && Array.isArray(payload.games)) {
        return payload
      }
      lastError = 'Proxy yaniti gecersiz.'
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }

  if (lastError) throw new Error(lastError)
  throw new Error('Steam proxy baglantisi kurulamadi.')
}

async function fetchJsonWithFallback(url: string) {
  const urls = [
    url,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ]

  let lastError = 'Steam servisine baglanilamadi.'

  for (const target of urls) {
    try {
      const response = await fetch(target)
      if (!response.ok) {
        lastError = `${response.status} hata kodu`
        continue
      }
      return (await response.json()) as SteamOwnedGamesResponse
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (/failed to fetch/i.test(message)) {
        lastError = 'Ag/CORS engeli: Steam API tarayicidan engellenebilir. Backend proxy gerekir.'
      } else {
        lastError = message
      }
    }
  }

  throw new Error(lastError)
}

async function resolveSteamId(apiKey: string, value: string) {
  const trimmed = value.trim()
  if (/^\d{17}$/.test(trimmed)) return trimmed

  const profilesAnyDigitsMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d+)/i)
  if (profilesAnyDigitsMatch?.[1] && profilesAnyDigitsMatch[1].length !== 17) {
    throw new Error('Steam profil linkindeki ID 17 haneli degil. Dogru SteamID64 kullan.')
  }

  const profilesMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/i)
  if (profilesMatch?.[1]) return profilesMatch[1]

  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/i)
  const vanity = vanityMatch?.[1] ?? trimmed
  if (!vanity) throw new Error('Steam ID veya profil linki gerekli.')

  const params = new URLSearchParams({
    key: apiKey,
    vanityurl: vanity,
    format: 'json',
  })
  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?${params.toString()}`
  const payload = await fetchJsonWithFallback(url)
  const resolved = (payload as { response?: { success?: number; steamid?: string } }).response

  if (resolved?.success === 1 && resolved.steamid) return resolved.steamid
  throw new Error('Steam vanity link cozulemedi. 17 haneli SteamID64 kullan.')
}

export async function fetchSteamOwnedGames(apiKey: string, steamIdOrProfile: string) {
  const trimmedApiKey = apiKey.trim()
  if (!trimmedApiKey) throw new Error('Steam API key gerekli.')
  if (!/^[A-Fa-f0-9]{32}$/.test(trimmedApiKey)) {
    throw new Error('Steam API key formati gecersiz. 32 karakter hex olmali.')
  }
  validateSteamIdOrProfileInput(steamIdOrProfile)

  try {
    return await tryBackendProxy(trimmedApiKey, steamIdOrProfile)
  } catch {
    // Proxy yoksa tarayici fallback'i dene.
  }

  const steamId = await resolveSteamId(trimmedApiKey, steamIdOrProfile)
  const payload = await fetchJsonWithFallback(buildSteamOwnedGamesUrl(trimmedApiKey, steamId))
  const games = payload.response?.games ?? []

  const normalized: SteamOwnedGame[] = games.map((game) => ({
    appId: game.appid,
    name: game.name,
    playtimeHours: Number((game.playtime_forever / 60).toFixed(1)),
    iconUrl: game.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      : null,
  }))

  return {
    steamId,
    games: normalized.sort((a, b) => b.playtimeHours - a.playtimeHours),
  }
}
