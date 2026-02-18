import fs from 'node:fs/promises';
import vm from 'node:vm';

const YEAR_START = 2018;
const YEAR_END = 2024;
const CURRENT_AWARDS_YEAR = 2025;

const manualGotyNominees = {
  2018: [
    "Assassin's Creed Odyssey",
    'Celeste',
    'God of War',
    "Marvel's Spider-Man",
    'Monster Hunter: World',
    'Red Dead Redemption 2',
  ],
  2019: [
    'Control',
    'Death Stranding',
    'Resident Evil 2',
    'Sekiro: Shadows Die Twice',
    'Super Smash Bros. Ultimate',
    'The Outer Worlds',
  ],
  2020: [
    'Animal Crossing: New Horizons',
    'DOOM Eternal',
    'Final Fantasy VII Remake',
    'Ghost of Tsushima',
    'Hades',
    'The Last of Us Part II',
  ],
  2021: [
    'Deathloop',
    'It Takes Two',
    'Metroid Dread',
    'Psychonauts 2',
    'Ratchet & Clank: Rift Apart',
    'Resident Evil Village',
  ],
  2022: [
    'A Plague Tale: Requiem',
    'Elden Ring',
    'God of War Ragnarok',
    'Horizon Forbidden West',
    'Stray',
    'Xenoblade Chronicles 3',
  ],
  2023: [
    'Alan Wake 2',
    "Baldur's Gate 3",
    "Marvel's Spider-Man 2",
    'Resident Evil 4',
    'Super Mario Bros. Wonder',
    'The Legend of Zelda: Tears of the Kingdom',
  ],
  2024: [
    'Astro Bot',
    'Balatro',
    'Black Myth: Wukong',
    'Elden Ring: Shadow of the Erdtree',
    'Final Fantasy VII Rebirth',
    'Metaphor: ReFantazio',
  ],
};

function extractJsonValue(str, key, startAt = 0) {
  const idx = str.indexOf(key, startAt);
  if (idx < 0) return null;

  let i = idx + key.length;
  while (i < str.length && /\s/.test(str[i])) i += 1;
  const open = str[i];
  const close = open === '[' ? ']' : open === '{' ? '}' : null;
  if (!close) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let j = i; j < str.length; j += 1) {
    const ch = str[j];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === open) depth += 1;
    if (ch === close) {
      depth -= 1;
      if (depth === 0) return str.slice(i, j + 1);
    }
  }

  return null;
}

function sanitizeText(value) {
  return String(value ?? '')
    .replace(/\u00e2\u20ac\u201c/g, '-')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFlightText(html) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const pushes = [];
  const ctx = { self: { __next_f: [] } };
  ctx.self.__next_f.push = (value) => pushes.push(value);
  vm.createContext(ctx);

  for (const script of scripts) {
    try {
      vm.runInContext(script, ctx, { timeout: 1000 });
    } catch {
      // Ignore unrelated inline scripts.
    }
  }

  return pushes
    .filter((entry) => Array.isArray(entry) && typeof entry[1] === 'string')
    .map((entry) => entry[1])
    .join('\n');
}

async function loadRewindYear(year) {
  const res = await fetch(`https://thegameawards.com/rewind/year-${year}`);
  if (!res.ok) throw new Error(`rewind year ${year} failed: ${res.status}`);
  const html = await res.text();
  const text = extractFlightText(html);

  const marker = `"content":[{"title":"${year}"`;
  const startAt = Math.max(0, text.indexOf(marker) - 20);
  const contentJson = extractJsonValue(text, '"content":', startAt);
  if (!contentJson) throw new Error(`content parse failed for ${year}`);
  const content = JSON.parse(contentJson);
  const winners = (content?.[0]?.winners ?? []).map((winner) => ({
    category: sanitizeText(winner.awardCategory),
    game: sanitizeText(winner.title),
    studio: winner.caption ? sanitizeText(winner.caption) : null,
  }));

  const gotyWinner = winners.find((winner) => winner.category.toUpperCase() === 'GAME OF THE YEAR')?.game ?? null;

  return {
    year,
    source: `https://thegameawards.com/rewind/year-${year}`,
    gameOfTheYear: {
      winner: gotyWinner,
      nominees: manualGotyNominees[year] ?? [],
      nomineesSource: 'manual-curation',
    },
    categoryWinners: winners,
  };
}

async function loadCurrentGotyFromWinnersPage() {
  const res = await fetch('https://thegameawards.com/winners/game-of-the-year');
  if (!res.ok) throw new Error(`winners page failed: ${res.status}`);
  const html = await res.text();
  const text = extractFlightText(html);

  const allAwardsJson = extractJsonValue(text, '"allAwards":');
  if (!allAwardsJson) return null;

  const allAwards = JSON.parse(allAwardsJson);
  const goty = allAwards.find((award) => award.slug === 'game-of-the-year');
  if (!goty) return null;

  const winner = goty.winner?.[0]?.title?.replace(/^\[GAME OF THE YEAR\]\s*/i, '')?.trim() ?? null;
  const nominees = Array.isArray(goty.nominees)
    ? goty.nominees
        .map((nominee) => String(nominee.title ?? '').replace(/^\[GAME OF THE YEAR\]\s*/i, '').trim())
        .filter(Boolean)
    : [];

  return {
    year: 2025,
    source: 'https://thegameawards.com/winners/game-of-the-year',
    gameOfTheYear: {
      winner,
      nominees,
      nomineesSource: 'thegameawards-winners-page',
    },
    categoryWinners: [],
  };
}

function stripNomineePrefix(value) {
  return sanitizeText(String(value ?? '').replace(/^\[[^\]]+\]\s*/i, ''));
}

async function loadCurrentCategoriesFromNomineesPage() {
  const res = await fetch('https://thegameawards.com/nominees/game-of-the-year');
  if (!res.ok) throw new Error(`nominees page failed: ${res.status}`);
  const html = await res.text();
  const text = extractFlightText(html);

  const allAwardsJson = extractJsonValue(text, '"allAwards":');
  if (!allAwardsJson) return [];

  const allAwards = JSON.parse(allAwardsJson);
  return allAwards.map((award) => ({
    slug: sanitizeText(award.slug),
    category: sanitizeText(award.name),
    winner: award.winner?.[0]?.title ? stripNomineePrefix(award.winner[0].title) : null,
    nominees: Array.isArray(award.nominees)
      ? award.nominees
          .map((nominee) => stripNomineePrefix(nominee.title))
          .filter(Boolean)
      : [],
  }));
}

const years = [];
for (let year = YEAR_START; year <= YEAR_END; year += 1) {
  years.push(await loadRewindYear(year));
}

const currentGoty = await loadCurrentGotyFromWinnersPage();
if (currentGoty && currentGoty.gameOfTheYear.nominees.length > 0) {
  years.push(currentGoty);
}

const currentCategoryAwards = await loadCurrentCategoriesFromNomineesPage();

const file = `/* eslint-disable */\nexport interface TgaCategoryWinner {\n  category: string\n  game: string\n  studio: string | null\n}\n\nexport interface TgaGameOfYearData {\n  winner: string | null\n  nominees: string[]\n  nomineesSource: 'manual-curation' | 'thegameawards-winners-page'\n}\n\nexport interface TgaYearRecord {\n  year: number\n  source: string\n  gameOfTheYear: TgaGameOfYearData\n  categoryWinners: TgaCategoryWinner[]\n}\n\nexport interface TgaCurrentCategoryAward {\n  slug: string\n  category: string\n  winner: string | null\n  nominees: string[]\n}\n\nexport const tgaCurrentAwardsYear = ${CURRENT_AWARDS_YEAR}\n\nexport const tgaYearRecords: TgaYearRecord[] = ${JSON.stringify(years, null, 2)}\n\nexport const tgaCurrentCategoryAwards: TgaCurrentCategoryAward[] = ${JSON.stringify(currentCategoryAwards, null, 2)}\n`;

await fs.writeFile('src/data/tgaAwards.ts', file, 'utf8');
console.log(`Wrote src/data/tgaAwards.ts with ${years.length} year records and ${currentCategoryAwards.length} current categories.`);
