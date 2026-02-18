# AllAroundGame

React + TypeScript + Vite tabanli oyun/urun katalog projesi.

## Gereksinimler

- Node.js 20+
- npm 10+

## Lokal Gelistirme

```bash
npm install
npm run dev
```

## Uretim Build

```bash
npm run lint
npm run build
npm run preview
```

## GitHub

Bu proje `main` branch ile `origin` remote'una baglidir:

- Repo: `https://github.com/OziMertyurek/gamesnews.git`

Guncel degisiklikleri gondermek icin:

```bash
git add .
git commit -m "update"
git push
```

## Vercel ile Yayin

1. Vercel'de `Add New Project` -> bu repoyu sec.
2. Framework: `Vite` (otomatik gelir).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy.

Not: `vercel.json` icindeki rewrite kurali sayesinde React Router sayfa yenilemelerinde 404 vermez.

## Netlify ile Yayin

1. Netlify'da `Add new site` -> `Import an existing project`.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

Not: `netlify.toml` icindeki redirect kurali SPA route'larini `index.html`'e yonlendirir.
