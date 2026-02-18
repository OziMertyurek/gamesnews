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
