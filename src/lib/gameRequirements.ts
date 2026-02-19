export interface GameRequirementsPayload {
  source: string
  appId: number | null
  appName: string
  minimumLines: string[]
  recommendedLines: string[]
  platformDetails?: {
    pcDevices: string[]
    pcStores: string[]
    playstation: string[]
    xbox: string[]
    nintendo: string[]
    other: string[]
  }
}

export async function fetchGameRequirements(title: string): Promise<GameRequirementsPayload> {
  const endpoints = ['/api/game-requirements', '/.netlify/functions/game-requirements']
  let lastError = 'Gereksinim verisi alinamadi.'

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const text = await response.text()
        lastError = text || `${response.status}`
        continue
      }

      const payload = (await response.json()) as GameRequirementsPayload
      if (payload && (payload.appId !== null || payload.minimumLines.length > 0 || payload.recommendedLines.length > 0 || payload.platformDetails)) {
        return payload
      }
      lastError = 'Gecersiz gereksinim yaniti.'
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }

  throw new Error(lastError)
}
