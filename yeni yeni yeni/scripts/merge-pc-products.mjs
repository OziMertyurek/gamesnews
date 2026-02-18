import fs from 'node:fs/promises';

const existingText = await fs.readFile('src/data/pcProducts.ts', 'utf8');
const scraped1 = JSON.parse(await fs.readFile('tmp_pc_products_scraped.json', 'utf8'));
const scraped2 = JSON.parse(await fs.readFile('tmp_pc_products_scraped_extra.json', 'utf8'));

const marker = 'export const pcProducts: PCProduct[] = ';
const idx = existingText.indexOf(marker);
const arrStart = existingText.indexOf('[', idx + marker.length);
let depth = 0;
let arrEnd = -1;
for (let i = arrStart; i < existingText.length; i += 1) {
  const ch = existingText[i];
  if (ch === '[') depth += 1;
  if (ch === ']') {
    depth -= 1;
    if (depth === 0) { arrEnd = i; break; }
  }
}
const arrayLiteral = existingText.slice(arrStart, arrEnd + 1);
const existing = Function(`return (${arrayLiteral});`)();

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function fixCategory(c) {
  if (c === 'MonitÃ¶r' || c === 'Monit?r') return 'Monitör';
  if (c === 'Ã‡evre Birimi' || c === '?evre Birimi') return 'Çevre Birimi';
  return c;
}

const merged = [];
const seen = new Set();

for (const item of existing) {
  const nameKey = normalize(item.name);
  if (seen.has(nameKey)) continue;
  seen.add(nameKey);
  const price = Number(item.price) || 0;
  merged.push({
    ...item,
    category: fixCategory(item.category),
    price,
    priceMin: Math.round(price * 0.92),
    priceMax: Math.round(price * 1.08),
    sourceOfferCount: 3,
  });
}

for (const item of [...scraped1, ...scraped2]) {
  const nameKey = normalize(item.name);
  if (seen.has(nameKey)) continue;
  seen.add(nameKey);
  merged.push(item);
}

// Rebuild IDs per category to keep them unique/clean
const counters = { cpu: 0, gpu: 0, ram: 0, ssd: 0, mon: 0, per: 0 };
const catToSlug = {
  CPU: 'cpu',
  GPU: 'gpu',
  RAM: 'ram',
  SSD: 'ssd',
  'Monitör': 'mon',
  'Çevre Birimi': 'per',
};
for (const item of merged) {
  const slug = catToSlug[item.category] || 'per';
  counters[slug] += 1;
  item.id = `${slug}-${counters[slug]}`;
}

const header = `export type PCCategory = 'CPU' | 'GPU' | 'RAM' | 'SSD' | 'Monitör' | 'Çevre Birimi'\n\nexport interface PCProduct {\n  id: string\n  name: string\n  category: PCCategory\n  price: number\n  priceMin: number\n  priceMax: number\n  store: string\n  link: string\n  image: string\n  brand: string\n  updatedAt: string\n  specs: string\n  inStock: boolean\n  sourceOfferCount: number\n}\n\nexport const pcProducts: PCProduct[] = `;

const footer = `\n\nexport const PC_CATEGORIES: PCCategory[] = [\n  'CPU', 'GPU', 'RAM', 'SSD', 'Monitör', 'Çevre Birimi',\n]\n`;

await fs.writeFile('src/data/pcProducts.ts', header + JSON.stringify(merged, null, 2) + footer, 'utf8');
console.log('merged total', merged.length);
