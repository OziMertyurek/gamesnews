import fs from 'node:fs/promises';
import puppeteer from '../tmp_hltb_client2/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const TODAY = '2026-02-18';

const CATEGORY_CONFIGS = [
  { key: 'CPU', slug: 'cpu', listUrl: 'https://www.akakce.com/islemci.html', limit: 24 },
  { key: 'GPU', slug: 'gpu', listUrl: 'https://www.akakce.com/ekran-karti.html', limit: 24 },
  { key: 'RAM', slug: 'ram', listUrl: 'https://www.akakce.com/ram.html', limit: 20 },
  { key: 'SSD', slug: 'ssd', listUrl: 'https://www.akakce.com/ssd.html', limit: 20 },
  { key: 'Monitör', slug: 'mon', listUrl: 'https://www.akakce.com/monitor.html', limit: 20 },
  { key: 'Çevre Birimi', slug: 'per', listUrl: 'https://www.akakce.com/mouse.html', limit: 15 },
  { key: 'Çevre Birimi', slug: 'per', listUrl: 'https://www.akakce.com/klavye.html', limit: 15 },
  { key: 'Çevre Birimi', slug: 'per', listUrl: 'https://www.akakce.com/kulaklik.html', limit: 15 },
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function pickAggregateOffers(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) pickAggregateOffers(item, out);
    return out;
  }
  if (node['@type'] === 'AggregateOffer') out.push(node);
  for (const value of Object.values(node)) pickAggregateOffers(value, out);
  return out;
}

function pickOffers(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) pickOffers(item, out);
    return out;
  }
  if (node['@type'] === 'Offer') out.push(node);
  for (const value of Object.values(node)) pickOffers(value, out);
  return out;
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

const products = [];
const seenUrls = new Set();
const seenNames = new Set();
let perCounter = { cpu: 0, gpu: 0, ram: 0, ssd: 0, mon: 0, per: 0 };

for (const cfg of CATEGORY_CONFIGS) {
  let links = [];
  try {
    await page.goto(cfg.listUrl, { waitUntil: 'networkidle2', timeout: 90000 });
    await page.waitForSelector('a[href*="fiyati,"]', { timeout: 30000 });
    links = await page.evaluate(() => {
      const all = [...document.querySelectorAll('a[href*="fiyati,"]')].map((a) => a.href).filter(Boolean);
      return [...new Set(all)];
    });
  } catch (error) {
    process.stdout.write(`SKIP ${cfg.key} list ${cfg.listUrl} ${String(error.message || error)}\n`);
    continue;
  }

  let added = 0;
  for (const link of links) {
    if (added >= cfg.limit) break;
    if (seenUrls.has(link)) continue;

    try {
      await page.goto(link, { waitUntil: 'networkidle2', timeout: 90000 });

      const parsed = await page.evaluate(() => {
        const script = document.querySelector('script[type="application/ld+json"]')?.textContent || '';
        let data = null;
        try { data = JSON.parse(script); } catch {}

        const imageMeta = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        return {
          data,
          imageMeta,
          title: document.title,
        };
      });

      if (!parsed?.data) continue;

      const aggs = pickAggregateOffers(parsed.data);
      if (!aggs.length) continue;

      const bestAgg = aggs.find((x) => Number(x.lowPrice) > 0 && Number(x.highPrice) > 0) || aggs[0];
      const low = Number(bestAgg.lowPrice || 0);
      const high = Number(bestAgg.highPrice || 0);
      const offerCount = Number(bestAgg.offerCount || 0);
      if (!(low > 0 && high > 0)) continue;

      const offers = pickOffers(parsed.data);
      const sellerNames = [];
      for (const offer of offers) {
        const seller = offer?.seller?.name;
        if (seller && !sellerNames.includes(seller)) sellerNames.push(seller);
        if (sellerNames.length >= 3) break;
      }

      const name = String(parsed.data.name || parsed.title || '').trim();
      if (!name) continue;
      const nameKey = slugify(name);
      if (seenNames.has(nameKey)) continue;

      seenUrls.add(link);
      seenNames.add(nameKey);
      perCounter[cfg.slug] += 1;

      const avg = Math.round((low + high) / 2);
      const brand = name.split(' ')[0]?.toUpperCase() || 'GENEL';

      products.push({
        id: `${cfg.slug}-ak-${perCounter[cfg.slug]}`,
        name,
        category: cfg.key,
        price: avg,
        priceMin: Math.round(low),
        priceMax: Math.round(high),
        store: 'Akakçe Çoklu Satıcı',
        link,
        image: parsed.imageMeta || `https://placehold.co/300x200/1e293b/93c5fd?text=${encodeURIComponent(name.slice(0, 24))}`,
        brand,
        updatedAt: TODAY,
        specs: sellerNames.length ? `Kaynak mağazalar: ${sellerNames.join(', ')}` : 'Kaynak mağaza bilgisi sınırlı',
        inStock: offerCount > 0,
        sourceOfferCount: offerCount,
      });

      added += 1;
      process.stdout.write(`OK ${cfg.key} ${added}/${cfg.limit} ${name}\n`);
    } catch (error) {
      process.stdout.write(`MISS ${cfg.key} ${link} ${String(error.message || error)}\n`);
    }
  }
}

await browser.close();

await fs.writeFile('tmp_pc_products_scraped.json', JSON.stringify(products, null, 2), 'utf8');
console.log(`\nScraped ${products.length} products.`);
