import fs from 'node:fs'
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

function keyOf(value) {
  return normalize(value).replace(/\s+/g, '')
}

function similarity(a, b) {
  const left = new Set(normalize(a).split(/\s+/).filter(Boolean))
  const right = new Set(normalize(b).split(/\s+/).filter(Boolean))
  if (!left.size || !right.size) return 0

  let inter = 0
  for (const token of left) {
    if (right.has(token)) inter += 1
  }
  const union = new Set([...left, ...right]).size
  return union ? inter / union : 0
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function searchSteam(term) {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=english&cc=us`
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 codex-steam-links',
      accept: 'application/json,text/plain,*/*',
    },
  })
  if (!response.ok) return []
  const payload = await response.json()
  return Array.isArray(payload?.items) ? payload.items : []
}

async function main() {
  const distDir = path.resolve('dist/assets')
  const siteContentFile = fs.readdirSync(distDir).find((f) => /^siteContent-.*\.js$/.test(f))
  if (!siteContentFile) {
    throw new Error('siteContent bundle not found. Run npm run build first.')
  }

  const mod = await import(pathToFileURL(path.join(distDir, siteContentFile)).href)
  const titles = [...new Set(mod.games.map((g) => g.title))]
  const out = {}

  for (let i = 0; i < titles.length; i += 1) {
    const title = titles[i]
    const items = await searchSteam(title)

    let best = null
    for (const item of items.slice(0, 12)) {
      const name = String(item?.name ?? '')
      const score = similarity(title, name)
      const exact = keyOf(title) === keyOf(name)
      const rank = score + (exact ? 0.7 : 0)
      if (!best || rank > best.rank) {
        best = { rank, score, exact, id: Number(item?.id), name }
      }
    }

    if (best && Number.isFinite(best.id) && best.id > 0) {
      const acceptable = best.exact || best.score >= 0.9
      if (acceptable) {
        out[keyOf(title)] = `https://store.steampowered.com/app/${best.id}/`
      }
    }

    if ((i + 1) % 200 === 0) {
      process.stdout.write(`Processed ${i + 1}/${titles.length}\n`)
    }
    await sleep(70)
  }

  const output = `export const steamStoreLinksByTitleKey: Record<string, string> = ${JSON.stringify(out, null, 2)}\n`
  fs.writeFileSync('src/data/steamStoreLinks.ts', output, 'utf8')
  process.stdout.write(`Generated src/data/steamStoreLinks.ts with ${Object.keys(out).length} links.\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

