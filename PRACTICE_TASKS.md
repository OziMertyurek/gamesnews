# Uygulamali Ogrenme Gorevleri

Bu dosyadaki gorevleri **ayri bir proje klasorunde** yap.
Mevcut siteye dokunma.

## Kurulum

1. Yeni klasor ac: `my-learning-app`
2. Vite + React + TS kur:
```bash
npm create vite@latest my-learning-app -- --template react-ts
cd my-learning-app
npm install
npm run dev
```

## Seviye 1: Temel Iskelet

1. `src/main.tsx` icinde:
- `BrowserRouter` ekle.
- Sonra `App`'i router icinde render et.

2. `src/App.tsx` icinde:
- Su route'lari olustur:
  - `/` -> Home
  - `/games` -> Games
  - `*` -> NotFound

3. `src/pages/` klasoru ac:
- `HomePage.tsx`
- `GamesPage.tsx`
- `NotFoundPage.tsx`

Beklenen:
- `/` acilir
- `/games` acilir
- rastgele yol `404` verir.

## Seviye 2: Layout Mantigi

1. `src/app/layout/Layout.tsx` olustur.
2. Icine:
- Basit bir navbar
- `<Outlet />`
- Basit footer
3. `App.tsx`'de tum sayfalari Layout altina tasi.

Beklenen:
- Navbar tum sayfalarda ortak gorunur.

## Seviye 3: Veri -> UI

1. `src/data/siteContent.ts` olustur.
2. 10 oyunluk dizi ekle:
- `slug`, `title`, `genre`, `releaseYear`, `score`
3. `GamesPage`'de bu listeyi kart olarak bas.
4. `Link` ile detay sayfasina git:
- `/games/:slug`

Beklenen:
- oyun listesi gorunur
- karta tiklayinca detay acilir.

## Seviye 4: Arama

1. Navbar'a input ekle.
2. Girilen metne gore oyunlari filtrele.
3. En fazla 5 sonuc goster.
4. Sonuca tiklayinca detay sayfasina git.

Beklenen:
- anlik arama calisir.

## Seviye 5: TypeScript Bilinci

1. Su tipleri yaz:
- `GameItem` interface
- `CompatibilityResult` interface
2. Yanlis tip verince TypeScript hatasi gor.
3. Hatayi duzelt.

Beklenen:
- "tip guvenligi" mantigi oturur.

## Seviye 6: Fonksiyon Mantigi

`src/lib/math.ts` olustur:

```ts
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
```

Gorev:
- 5 farkli degerle test et.
- neden `return` oldugunu not al.

Beklenen:
- fonksiyon girdisi/ciktisi net anlasilir.

## Seviye 7: useState / useEffect / useMemo

1. `useState`: sayac yap.
2. `useEffect`: sayac degisince console.log yaz.
3. `useMemo`: filtrelenmis oyun listesini memoize et.

Beklenen:
- hooklarin farkini uygulamada gorursun.

## Seviye 8: API Temeli

1. `api/hello.js` (veya `src/mocks`) ile basit endpoint mantigi kur.
2. Frontend'de `fetch` ile veri cek.
3. Loading / Error / Success durumlarini ayir.

Beklenen:
- veri akisini uctan uca anlarsin.

## Seviye 9: Kucuk Proje Kurali

Her gorevde su 4 soruya cevap ver:

1. Bu kod ne yapiyor?
2. Neden burada?
3. Hangi dosyaya bagli?
4. Silsem ne bozulur?

## Seviye 10: Bitirme Kontrolu

Asagidakiler varsa tamam:

- Router calisiyor
- Ortak Layout var
- Liste ve detay var
- Arama var
- Tipler var
- En az 1 API fetch var
- Build geciyor:
```bash
npm run build
```

## Not

Bu dosyadaki her gorevi bitirdikten sonra bana su formatta yaz:

`Seviye X bitti, su dosyalari degistirdim: ...`

Ben sana bir sonraki seviyede kod review + eksik tamamlama yapacagim.
