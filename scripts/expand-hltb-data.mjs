import fs from 'node:fs'
import puppeteer from '../tmp_hltb_client2/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'

const SITE_FILE = 'src/data/siteContent.ts'
const DATA_FILE = 'src/data/gameExternalData.ts'
const BASE_URL = 'https://howlongtobeat.com'
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function similarity(a, b) {
  const left = new Set(normalize(a).split(' ').filter(Boolean))
  const right = new Set(normalize(b).split(' ').filter(Boolean))
  if (!left.size || !right.size) return 0
  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }
  const union = new Set([...left, ...right]).size
  return union === 0 ? 0 : intersection / union
}

function toHours(seconds) {
  return seconds && seconds > 0 ? Math.round(seconds / 3600) : null
}

function buildPayload(term) {
  return {
    searchType: 'games',
    searchTerms: term.trim().split(' '),
    searchPage: 1,
    size: 20,
    searchOptions: {
      games: {
        userId: 0,
        platform: '',
        sortCategory: 'popular',
        rangeCategory: 'main',
        rangeTime: { min: 0, max: 0 },
        gameplay: { perspective: '', flow: '', genre: '', difficulty: '' },
        rangeYear: { min: '', max: '' },
        modifier: '',
      },
      users: { sortCategory: 'postcount' },
      lists: { sortCategory: 'follows' },
      filter: '',
      sort: 0,
      randomizer: 0,
    },
    useCache: true,
  }
}

const siteText = fs.readFileSync(SITE_FILE, 'utf8')
const poolStart = siteText.indexOf('const genreTitlePools')
const poolEnd = siteText.indexOf('function slugify')
const poolBlock = siteText.slice(poolStart, poolEnd)
const titles = [...new Set([...poolBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]))]

const fileText = fs.readFileSync(DATA_FILE, 'utf8')
const marker = 'export const gameExternalData: Record<string, GameExternalData> = '
const markerIndex = fileText.indexOf(marker)
const objectStart = fileText.indexOf('{', markerIndex + marker.length)
const objectEnd = fileText.lastIndexOf('}')
const data = JSON.parse(fileText.slice(objectStart, objectEnd + 1))

const existingKeys = Object.keys(data)
const normalizedExisting = new Set(existingKeys.map((k) => k.replace(/[^a-z0-9]/g, '')))

const targets = titles.filter((title) => !normalizedExisting.has(slugify(title).replace(/[^a-z0-9]/g, '')))

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setUserAgent(USER_AGENT)
await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 })

async function getToken() {
  return page.evaluate(async () => {
    const response = await fetch(`/api/finder/init?t=${Date.now()}`)
    if (!response.ok) return null
    const payload = await response.json()
    return payload.token ?? null
  })
}

let token = await getToken()
if (!token) throw new Error('Could not fetch HLTB token')

async function search(term) {
  const payload = buildPayload(term)
  const run = async () =>
    page.evaluate(async ({ requestPayload, requestToken }) => {
      const response = await fetch('/api/finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': requestToken,
        },
        body: JSON.stringify(requestPayload),
      })
      const text = await response.text()
      return { ok: response.ok, status: response.status, text }
    }, { requestPayload: payload, requestToken: token })

  let result = await run()
  if (result.status === 403) {
    token = await getToken()
    if (!token) return []
    result = await run()
  }

  if (!result.ok) return []
  try {
    return JSON.parse(result.text)?.data ?? []
  } catch {
    return []
  }
}

let added = 0
let skipped = 0
for (const title of targets) {
  const results = await search(title)
  let best = null

  for (const item of results) {
    const score = similarity(title, item.game_name ?? '')
    if (!best || score > best.score) best = { score, item }
  }

  if (!best || best.score < 0.5) {
    skipped += 1
    process.stdout.write(`SKIP ${title}\n`)
    await new Promise((resolve) => setTimeout(resolve, 160))
    continue
  }

  const game = best.item
  const slug = slugify(title)
  data[slug] = {
    metacriticScore: null,
    metacriticUrl: `https://www.metacritic.com/search/${encodeURIComponent(title)}/`,
    howLongToBeatMainHours: toHours(game.comp_main),
    howLongToBeatMainExtraHours: toHours(game.comp_plus),
    howLongToBeatCompletionistHours: toHours(game.comp_100),
    howLongToBeatUrl: `https://howlongtobeat.com/game/${game.game_id}`,
    gamespotArticleUrl: `https://www.gamespot.com/search/?q=${encodeURIComponent(title)}`,
  }

  added += 1
  process.stdout.write(`ADD ${slug} -> ${game.game_name} (${game.game_id}) score=${best.score.toFixed(2)}\n`)
  await new Promise((resolve) => setTimeout(resolve, 160))
}

await browser.close()

const output = `${fileText.slice(0, markerIndex)}${marker}${JSON.stringify(data, null, 2)}${fileText.slice(objectEnd + 1)}`
fs.writeFileSync(DATA_FILE, output, 'utf8')
console.log(`\nDone. Added ${added}, skipped ${skipped}, total keys now ${Object.keys(data).length}.`)
