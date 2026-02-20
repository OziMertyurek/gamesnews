import fs from 'node:fs'

const INPUT_FILE = 'reports/steam-classification-all.json'
const OUTPUT_FILE = 'src/data/steamCatalogData.ts'

function normalizeTitleKey(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

function normalizeLoose(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isLikelyNonGameAddonTitle(value) {
  const text = String(value ?? '').toLowerCase()
  return (
    text.includes('soundtrack') ||
    text.includes(' ost') ||
    text.includes('prologue') ||
    text.includes('demo') ||
    text.includes('server')
  )
}

function isTrustedSteamMatch(item) {
  const score = Number(item.confidenceScore ?? 0)
  const titleKey = normalizeTitleKey(item.title)
  const steamNameKey = normalizeTitleKey(item.steamName)
  const includesMatch =
    titleKey.length >= 6 &&
    steamNameKey.length >= 6 &&
    (steamNameKey.includes(titleKey) || titleKey.includes(steamNameKey))
  const looseTitle = normalizeLoose(item.title)
  const looseSteam = normalizeLoose(item.steamName)
  const wordContains =
    looseTitle.length >= 4 &&
    looseSteam.length >= 4 &&
    (looseSteam.includes(looseTitle) || looseTitle.includes(looseSteam))

  return Boolean(item.exactNormalized) || score >= 0.82 || includesMatch || wordContains
}

async function fetchAppDetails(appId) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 codex-steam-catalog-data',
      accept: 'application/json,text/plain,*/*',
    },
  })

  if (!response.ok) return null
  const payload = await response.json()
  return payload?.[String(appId)]?.data ?? null
}

async function fetchDlcForApp(appId) {
  const url = `https://store.steampowered.com/api/dlcforapp/?appid=${appId}&l=english&cc=us`
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 codex-steam-catalog-data',
      accept: 'application/json,text/plain,*/*',
    },
  })
  if (!response.ok) return []
  const payload = await response.json()
  if (payload?.status !== 1 || !Array.isArray(payload?.dlc)) return []
  return payload.dlc
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const raw = fs.readFileSync(INPUT_FILE, 'utf8')
  const report = JSON.parse(raw)

  const allMatches = [...(report.confidentMatches ?? []), ...(report.lowConfidenceMatches ?? [])]
  const trustedMatches = allMatches.filter(isTrustedSteamMatch)

  const bestByTitleKey = {}
  for (const match of trustedMatches) {
    const key = normalizeTitleKey(match.title)
    if (!key) continue

    const current = bestByTitleKey[key]
    const score = Number(match.confidenceScore ?? 0)
    const rank = score + (match.appType === 'game' ? 0.25 : 0) + (match.exactNormalized ? 0.4 : 0)

    if (!current || rank > current._rank) {
      bestByTitleKey[key] = { ...match, _rank: rank }
    }
  }

  const storeByTitleKey = {}
  const dlcTitleKeySet = new Set()
  const parentSeedsByTitleKey = {}
  const dlcByParentTitleKey = {}
  const detailsCache = new Map()

  const titleKeys = Object.keys(bestByTitleKey)
  for (let i = 0; i < titleKeys.length; i += 1) {
    const key = titleKeys[i]
    const item = bestByTitleKey[key]

    storeByTitleKey[key] = {
      store: 'steam',
      url: item.steamUrl,
      appId: Number(item.appid),
      appType: item.appType ?? 'unknown',
      confidence: Number(item.confidenceScore ?? 0),
    }

    const appId = Number(item.appid)
    if (!Number.isFinite(appId) || appId <= 0) continue

    let details = detailsCache.get(appId)
    if (!details) {
      details = await fetchAppDetails(appId)
      detailsCache.set(appId, details)
      await sleep(70)
    }
    if (!details) continue

    // If this title is classified as DLC itself, mark it for removal and map to its parent.
    if (details.type === 'dlc' && !isLikelyNonGameAddonTitle(details.name)) {
      dlcTitleKeySet.add(key)

      const parentName = details.fullgame?.name
      const parentAppId = Number(details.fullgame?.appid)
      if (parentName && Number.isFinite(parentAppId) && parentAppId > 0) {
        const parentKey = normalizeTitleKey(parentName)
        if (parentKey) {
          if (!dlcByParentTitleKey[parentKey]) {
            dlcByParentTitleKey[parentKey] = []
          }
          dlcByParentTitleKey[parentKey].push({
            title: item.title,
            url: item.steamUrl,
            appId,
            store: 'Steam',
          })

          if (!parentSeedsByTitleKey[parentKey]) {
            parentSeedsByTitleKey[parentKey] = {
              title: parentName,
              appId: parentAppId,
              url: `https://store.steampowered.com/app/${parentAppId}/`,
              releaseYear: null,
            }
          }
        }
      }
    }

    // For main games, fetch all DLC entries from Steam and attach.
    if (details.type === 'game') {
      const parentKey = key
      if (!dlcByParentTitleKey[parentKey]) {
        dlcByParentTitleKey[parentKey] = []
      }

      const dlcItems = await fetchDlcForApp(appId)
      await sleep(60)
      for (const dlc of dlcItems) {
        const dlcAppId = Number(dlc?.id)
        const dlcName = String(dlc?.name ?? '')
        if (!Number.isFinite(dlcAppId) || dlcAppId <= 0 || !dlcName) continue
        if (isLikelyNonGameAddonTitle(dlcName)) continue

        dlcByParentTitleKey[parentKey].push({
          title: dlcName,
          url: `https://store.steampowered.com/app/${dlcAppId}/`,
          appId: dlcAppId,
          store: 'Steam',
        })
      }

      // Remove duplicates by URL.
      const seen = new Set()
      dlcByParentTitleKey[parentKey] = dlcByParentTitleKey[parentKey].filter((entry) => {
        const id = entry.url
        if (!id || seen.has(id)) return false
        seen.add(id)
        return true
      })
    }
  }

  for (const [parentKey, list] of Object.entries(dlcByParentTitleKey)) {
    dlcByParentTitleKey[parentKey] = list.sort((a, b) => a.title.localeCompare(b.title))
  }

  const output = `export interface SteamStoreLinkData {
  store: 'steam'
  url: string
  appId: number
  appType: string
  confidence: number
}

export interface SteamDlcData {
  title: string
  url: string
  appId: number
  store: 'Steam'
}

export interface SteamParentSeedData {
  title: string
  appId: number
  url: string
  releaseYear: number | null
}

export const steamStoreByTitleKey: Record<string, SteamStoreLinkData> = ${JSON.stringify(storeByTitleKey, null, 2)}

export const steamDlcByParentTitleKey: Record<string, SteamDlcData[]> = ${JSON.stringify(dlcByParentTitleKey, null, 2)}

export const steamDlcTitleKeys: string[] = ${JSON.stringify([...dlcTitleKeySet].sort(), null, 2)}

export const steamParentSeedsByTitleKey: Record<string, SteamParentSeedData> = ${JSON.stringify(parentSeedsByTitleKey, null, 2)}
`

  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')

  process.stdout.write(
    `Generated ${OUTPUT_FILE}\n` +
      `trusted store links: ${Object.keys(storeByTitleKey).length}\n` +
      `dlc title keys: ${[...dlcTitleKeySet].length}\n` +
      `parent titles with dlc: ${Object.keys(dlcByParentTitleKey).length}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
