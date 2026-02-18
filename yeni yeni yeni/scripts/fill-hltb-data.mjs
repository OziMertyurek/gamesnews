import fs from 'node:fs';
import puppeteer from '../tmp_hltb_client2/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const INPUT_FILE = 'src/data/gameExternalData.ts';
const BASE_URL = 'https://howlongtobeat.com';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function findMatchingBrace(text, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function titleFromEntry(slug, entry) {
  try {
    const parsed = new URL(entry.howLongToBeatUrl);
    const q = parsed.searchParams.get('q');
    if (q) {
      const cleaned = decodeURIComponent(q)
        .replace(/^site:howlongtobeat\.com\s*/i, '')
        .trim();
      if (cleaned.length > 0) return cleaned;
    }
  } catch {
    // ignore
  }

  return slug
    .split('-')
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function similarity(a, b) {
  const left = new Set(normalize(a).split(' ').filter(Boolean));
  const right = new Set(normalize(b).split(' ').filter(Boolean));

  if (!left.size || !right.size) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function toHours(seconds) {
  return seconds && seconds > 0 ? Math.round(seconds / 3600) : null;
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
  };
}

async function main() {
  const fileText = fs.readFileSync(INPUT_FILE, 'utf8');
  const marker = 'export const gameExternalData: Record<string, GameExternalData> = ';
  const markerIndex = fileText.indexOf(marker);

  if (markerIndex < 0) {
    throw new Error('gameExternalData marker not found');
  }

  const objectStart = fileText.indexOf('{', markerIndex + marker.length);
  const objectEnd = findMatchingBrace(fileText, objectStart);
  const data = JSON.parse(fileText.slice(objectStart, objectEnd + 1));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  async function getToken() {
    return page.evaluate(async () => {
      const response = await fetch(`/api/finder/init?t=${Date.now()}`);
      if (!response.ok) return null;
      const payload = await response.json();
      return payload.token ?? null;
    });
  }

  let token = await getToken();
  if (!token) {
    await browser.close();
    throw new Error('Could not fetch /api/finder token');
  }

  async function search(term) {
    const payload = buildPayload(term);

    const run = async () => {
      return page.evaluate(async ({ requestPayload, requestToken }) => {
        const response = await fetch('/api/finder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': requestToken,
          },
          body: JSON.stringify(requestPayload),
        });

        const text = await response.text();
        return {
          ok: response.ok,
          status: response.status,
          text,
        };
      }, { requestPayload: payload, requestToken: token });
    };

    let result = await run();

    if (result.status === 403) {
      token = await getToken();
      if (!token) return [];
      result = await run();
    }

    if (!result.ok) return [];

    try {
      const parsed = JSON.parse(result.text);
      return parsed?.data ?? [];
    } catch {
      return [];
    }
  }

  const slugs = Object.keys(data);
  let updated = 0;

  for (const slug of slugs) {
    const entry = data[slug];
    const title = titleFromEntry(slug, entry);
    const results = await search(title);

    let best = null;
    for (const item of results) {
      const score = similarity(title, item.game_name ?? '');
      if (!best || score > best.score) best = { score, item };
    }

    if (!best && results.length > 0) {
      best = { score: 0, item: results[0] };
    }

    if (best) {
      const game = best.item;
      entry.howLongToBeatMainHours = toHours(game.comp_main);
      entry.howLongToBeatMainExtraHours = toHours(game.comp_plus);
      entry.howLongToBeatCompletionistHours = toHours(game.comp_100);
      entry.howLongToBeatUrl = `https://howlongtobeat.com/game/${game.game_id}`;
      updated += 1;
      process.stdout.write(`OK ${slug} -> ${game.game_name} (${game.game_id})\n`);
    } else {
      process.stdout.write(`MISS ${slug} (${title})\n`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  await browser.close();

  const output = `${fileText.slice(0, markerIndex)}${marker}${JSON.stringify(data, null, 2)}${fileText.slice(objectEnd + 1)}`;
  fs.writeFileSync(INPUT_FILE, output, 'utf8');

  process.stdout.write(`\nDone. Updated ${updated}/${slugs.length} entries.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
