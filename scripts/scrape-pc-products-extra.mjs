import fs from 'node:fs/promises';
import puppeteer from '../tmp_hltb_client2/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const TODAY='2026-02-18';
const CATEGORY_CONFIGS=[
 { key:'GPU', slug:'gpu', listUrl:'https://www.akakce.com/ekran-karti.html', limit:30 },
 { key:'RAM', slug:'ram', listUrl:'https://www.akakce.com/ram.html', limit:24 },
];

function isRelevantName(category, name){
 const n = String(name || '').toLowerCase();
 if (category === 'GPU') {
  return n.includes('ekran kart') || n.includes('rtx') || n.includes('rx ') || n.includes('arc ');
 }
 if (category === 'RAM') {
  return n.includes(' ram') || n.endsWith('ram') || n.includes('ddr4') || n.includes('ddr5');
 }
 return true;
}

function pick(node, type, out=[]){
 if(!node||typeof node!=='object') return out;
 if(Array.isArray(node)){ for(const x of node) pick(x,type,out); return out; }
 if(node['@type']===type) out.push(node);
 for(const v of Object.values(node)) pick(v,type,out);
 return out;
}

const browser=await puppeteer.launch({headless:'new',args:['--no-sandbox']});
const page=await browser.newPage();
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
const products=[];
const seen=new Set();
let counters={gpu:0,ram:0};

async function loadList(url){
 for(let i=0;i<5;i++){
  try{
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
   await new Promise(r=>setTimeout(r,4000+i*1500));
   const links=await page.evaluate(()=>[...new Set([...document.querySelectorAll('a[href*="fiyati,"]')].map(a=>a.href).filter(Boolean))]);
   if(links.length>20) return links;
  }catch{}
 }
 return [];
}

for(const cfg of CATEGORY_CONFIGS){
 const links=await loadList(cfg.listUrl);
 if(!links.length){ console.log('SKIP',cfg.key); continue; }
 let added=0;
 for(const link of links){
  if(added>=cfg.limit) break;
  if(seen.has(link)) continue;
  try{
   await page.goto(link,{waitUntil:'networkidle2',timeout:90000});
   const parsed=await page.evaluate(()=>{
    const s=document.querySelector('script[type="application/ld+json"]')?.textContent||'';
    let d=null; try{d=JSON.parse(s);}catch{}
    const img=document.querySelector('meta[property="og:image"]')?.getAttribute('content')||'';
    return {d,img,title:document.title};
   });
   if(!parsed.d) continue;
   const aggs=pick(parsed.d,'AggregateOffer');
   const agg=aggs.find(x=>Number(x.lowPrice)>0&&Number(x.highPrice)>0)||aggs[0];
   if(!agg) continue;
   const low=Number(agg.lowPrice||0), high=Number(agg.highPrice||0), count=Number(agg.offerCount||0);
   if(!(low>0&&high>0)) continue;
   const offers=pick(parsed.d,'Offer');
   const sellers=[];
   for(const o of offers){const n=o?.seller?.name; if(n&&!sellers.includes(n)) sellers.push(n); if(sellers.length>=3) break;}
   const name=String(parsed.d.name||parsed.title||'').trim();
   if(!name) continue;
   if(!isRelevantName(cfg.key, name)) continue;
   seen.add(link);
   counters[cfg.slug]+=1;
   products.push({
    id:`${cfg.slug}-ak-extra-${counters[cfg.slug]}`,
    name,
    category:cfg.key,
    price:Math.round((low+high)/2),
    priceMin:Math.round(low),
    priceMax:Math.round(high),
    store:'Akakçe Çoklu Satıcı',
    link,
    image:parsed.img,
    brand:name.split(' ')[0]?.toUpperCase()||'GENEL',
    updatedAt:TODAY,
    specs:sellers.length?`Kaynak mağazalar: ${sellers.join(', ')}`:'Kaynak mağaza bilgisi sınırlı',
    inStock:count>0,
    sourceOfferCount:count,
   });
   added++; console.log('OK',cfg.key,added,'/',cfg.limit,name);
  }catch(e){ console.log('MISS',cfg.key,e.message); }
 }
}

await browser.close();
await fs.writeFile('tmp_pc_products_scraped_extra.json',JSON.stringify(products,null,2),'utf8');
console.log('count',products.length);
