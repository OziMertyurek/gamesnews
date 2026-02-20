import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenSet(value) {
  return new Set(normalize(value).split(/\s+/).filter(Boolean))
}

function similarity(a, b) {
  const left = tokenSet(a)
  const right = tokenSet(b)
  if (!left.size || !right.size) return 0

  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }

  const union = new Set([...left, ...right]).size
  return union ? intersection / union : 0
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(url, retries = 2) {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 codex-steam-classifier',
        accept: 'application/json,text/plain,*/*',
      },
    })
    if (!response.ok) {
      if (retries > 0) {
        await sleep(300)
        return fetchJson(url, retries - 1)
      }
      return null
    }
    return await response.json()
  } catch {
    if (retries > 0) {
      await sleep(300)
      return fetchJson(url, retries - 1)
    }
    return null
  }
}

function rankItem(queryTitle, item) {
  const name = item?.name ?? ''
  const score = similarity(queryTitle, name)
  const exactNormalized = normalize(queryTitle) === normalize(name)
  const boosted = score + (exactNormalized ? 0.5 : 0)
  return { score: boosted, exactNormalized }
}

async function findBestSteamSearchMatch(title) {
  const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=us`
  const payload = await fetchJson(searchUrl)
  const items = payload?.items ?? []
  if (!items.length) return null

  let best = null
  for (const item of items.slice(0, 12)) {
    const ranked = rankItem(title, item)
    if (!best || ranked.score > best.score) {
      best = { ...ranked, item }
    }
  }

  if (!best) return null
  return {
    appid: best.item.id,
    steamName: best.item.name,
    score: Number(best.score.toFixed(3)),
    exactNormalized: best.exactNormalized,
  }
}

async function fetchAppType(appid) {
  const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=english`
  const payload = await fetchJson(detailsUrl)
  const data = payload?.[String(appid)]?.data
  if (!data) return null
  return {
    appType: data.type ?? null,
    isFree: data.is_free ?? null,
  }
}

async function main() {
  const assetsDir = path.resolve('./dist/assets')
  const siteContentFile = readdirSync(assetsDir).find((file) => /^siteContent-.*\.js$/.test(file))
  if (!siteContentFile) {
    throw new Error('siteContent bundle not found in dist/assets')
  }

  const mod = await import(pathToFileURL(path.join(assetsDir, siteContentFile)).href)
  const games = mod.games

  const results = []
  for (let i = 0; i < games.length; i += 1) {
    const game = games[i]
    const found = await findBestSteamSearchMatch(game.title)

    if (!found) {
      results.push({
        title: game.title,
        slug: game.slug,
        foundOnSteam: false,
      })
    } else {
      const details = await fetchAppType(found.appid)
      results.push({
        title: game.title,
        slug: game.slug,
        foundOnSteam: true,
        steamName: found.steamName,
        appid: found.appid,
        confidenceScore: found.score,
        exactNormalized: found.exactNormalized,
        appType: details?.appType ?? null,
        isFree: details?.isFree ?? null,
        steamUrl: `https://store.steampowered.com/app/${found.appid}/`,
      })
    }

    if ((i + 1) % 100 === 0) {
      process.stdout.write(`Processed ${i + 1}/${games.length}\n`)
    }

    await sleep(120)
  }

  const found = results.filter((item) => item.foundOnSteam)
  const notFound = results.filter((item) => !item.foundOnSteam)
  const lowConfidence = found.filter((item) => (item.confidenceScore ?? 0) < 0.7)
  const confident = found.filter((item) => (item.confidenceScore ?? 0) >= 0.7)

  const typeCounts = {}
  for (const item of found) {
    const key = item.appType ?? 'unknown'
    typeCounts[key] = (typeCounts[key] ?? 0) + 1
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceBundle: siteContentFile,
    totals: {
      siteGames: games.length,
      foundOnSteam: found.length,
      notFoundOnSteam: notFound.length,
      confidentMatches: confident.length,
      lowConfidenceMatches: lowConfidence.length,
      appTypeCounts: typeCounts,
    },
  }

  const output = {
    ...summary,
    confidentMatches: confident,
    lowConfidenceMatches: lowConfidence,
    notFoundOnSteam: notFound,
  }

  mkdirSync('reports', { recursive: true })
  writeFileSync('reports/steam-classification-all.json', JSON.stringify(output, null, 2))

  const lines = [
    `Generated: ${summary.generatedAt}`,
    `Bundle: ${summary.sourceBundle}`,
    `Total games: ${summary.totals.siteGames}`,
    `Found on Steam: ${summary.totals.foundOnSteam}`,
    `Not found on Steam: ${summary.totals.notFoundOnSteam}`,
    `Confident matches (score >= 0.7): ${summary.totals.confidentMatches}`,
    `Low confidence matches (score < 0.7): ${summary.totals.lowConfidenceMatches}`,
    `App type counts: ${JSON.stringify(summary.totals.appTypeCounts)}`,
    '',
    'Confident matches:',
    ...confident.map(
      (item) =>
        `${item.title} | ${item.steamName} | appType=${item.appType} | score=${item.confidenceScore} | ${item.steamUrl}`,
    ),
    '',
    'Low confidence matches:',
    ...lowConfidence.map(
      (item) =>
        `${item.title} | ${item.steamName} | appType=${item.appType} | score=${item.confidenceScore} | ${item.steamUrl}`,
    ),
    '',
    'Not found on Steam:',
    ...notFound.map((item) => `${item.title} | ${item.slug}`),
  ]

  writeFileSync('reports/steam-classification-all.txt', lines.join('\n'))
  process.stdout.write(`${JSON.stringify(summary.totals, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
