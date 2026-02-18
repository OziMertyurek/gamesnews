import fs from 'node:fs';

const INPUT_FILE = 'src/data/gameExternalData.ts';
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function slugToTitle(slug) {
  return slug
    .split('-')
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function searchTermFromEntry(slug, entry) {
  const fromUrl = entry.metacriticUrl;
  if (typeof fromUrl === 'string') {
    try {
      const parsed = new URL(fromUrl);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const searchIndex = parts.indexOf('search');
      if (searchIndex >= 0 && parts[searchIndex + 1]) {
        return decodeURIComponent(parts[searchIndex + 1]).replace(/\+/g, ' ');
      }
      const gameIndex = parts.indexOf('game');
      if (gameIndex >= 0 && parts[gameIndex + 1]) {
        return slugToTitle(parts[gameIndex + 1]);
      }
    } catch {
      // ignore URL parse error
    }
  }
  return slugToTitle(slug);
}

function toGameUrl(foundSlug) {
  return `https://www.metacritic.com/game/${foundSlug}/`;
}

function buildSearchUrl(term) {
  return `https://backend.metacritic.com/finder/metacritic/search/${encodeURIComponent(
    term,
  )}/web?offset=0&limit=20&mcoTypeId=13&sortBy=&sortDirection=DESC&componentName=search&componentDisplayName=Search&componentType=SearchResults`;
}

async function fetchMatches(term) {
  const response = await fetch(buildSearchUrl(term), {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) return [];
  const payload = await response.json();
  return payload?.data?.items ?? [];
}

function pickBestMatch(slug, term, items) {
  let best = null;

  for (const item of items) {
    if (item.typeId !== 13) continue;
    if (typeof item.criticScoreSummary?.score !== 'number') continue;

    const slugMatch = item.slug === slug;
    const titleScore = similarity(term, item.title ?? '');
    const slugScore = similarity(slugToTitle(slug), item.title ?? '');
    const score = Math.max(titleScore, slugScore) + (slugMatch ? 1 : 0);

    if (!best || score > best.score) {
      best = { score, item };
    }
  }

  return best?.item ?? null;
}

function isAcceptableMatch(slug, term, item) {
  const criticScore = item.criticScoreSummary?.score;
  if (typeof criticScore !== 'number' || criticScore < 1 || criticScore > 100) {
    return false;
  }

  const slugMatch = item.slug === slug;
  if (slugMatch) return true;

  const termScore = similarity(term, item.title ?? '');
  const slugTitleScore = similarity(slugToTitle(slug), item.title ?? '');
  const bestScore = Math.max(termScore, slugTitleScore);
  return bestScore >= 0.55;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const fileText = fs.readFileSync(INPUT_FILE, 'utf8');
  const marker = 'export const gameExternalData: Record<string, GameExternalData> = ';
  const markerIndex = fileText.indexOf(marker);

  if (markerIndex < 0) {
    throw new Error('gameExternalData marker not found');
  }

  const objectStart = fileText.indexOf('{', markerIndex + marker.length);
  const objectEnd = findMatchingBrace(fileText, objectStart);
  const data = JSON.parse(fileText.slice(objectStart, objectEnd + 1));

  const slugs = Object.keys(data);
  const missingSlugs = slugs.filter((slug) => data[slug].metacriticScore === null);
  let updated = 0;
  let failed = 0;

  process.stdout.write(
    `Checking ${missingSlugs.length} entries with missing Metacritic score...\n`,
  );

  for (const slug of missingSlugs) {
    const entry = data[slug];
    const term = searchTermFromEntry(slug, entry);

    try {
      const items = await fetchMatches(term);
      const best = pickBestMatch(slug, term, items);

      if (best && isAcceptableMatch(slug, term, best)) {
        entry.metacriticScore = best.criticScoreSummary.score;
        entry.metacriticUrl = toGameUrl(best.slug);
        updated += 1;
        process.stdout.write(
          `OK ${slug} -> ${best.title} (${entry.metacriticScore})\n`,
        );
      } else {
        failed += 1;
        process.stdout.write(`MISS ${slug} (${term})\n`);
      }
    } catch (error) {
      failed += 1;
      process.stdout.write(`ERR ${slug}: ${String(error)}\n`);
    }

    await sleep(150);
  }

  if (!dryRun) {
    const output = `${fileText.slice(0, markerIndex)}${marker}${JSON.stringify(
      data,
      null,
      2,
    )}${fileText.slice(objectEnd + 1)}`;
    fs.writeFileSync(INPUT_FILE, output, 'utf8');
  }

  process.stdout.write(
    `\nDone. Updated ${updated}/${missingSlugs.length}, failed ${failed}. ${
      dryRun ? 'No file changes (dry-run).' : ''
    }\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
