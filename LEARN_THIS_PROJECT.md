# Bu Projeyi Ogrenme Rehberi

Bu dosya, projeyi "calisan kod" uzerinden ogrenmen icin hazirlandi.
Hedef: bir satirin neden yazildigini, nereye baglandigini ve neyi etkiledigini anlayabilmek.

## 1) Proje Haritasi

- `src/`: Uygulamanin asıl frontend kodu.
- `src/main.tsx`: Uygulamanin giris noktasi.
- `src/App.tsx`: Sayfa yonlendirme (router) merkezi.
- `src/pages/`: Sayfa komponentleri.
- `src/app/layout/`: Navbar/Layout gibi ortak iskelet.
- `src/data/`: Oyun verisi ve kataloglar.
- `src/lib/`: Yardimci is kurallari (hesaplama, auth, cache client, vb.).
- `api/`: Vercel serverless backend endpointleri.
- `netlify/functions/`: Netlify tarafi backend endpointleri.
- `public/`: Statik dosyalar (logo, ikon, vb.).

## 2) Uygulama Nasil Aciliyor?

`src/main.tsx` akisi:

1. React root olusturulur: `createRoot(...)`
2. Router sarilir: `<BrowserRouter>`
3. Query client sarilir: `<QueryClientProvider>`
4. Asil uygulama render edilir: `<App />`

Bu katmanlarin anlami:

- `BrowserRouter`: URL degisikligine gore sayfa degisir.
- `QueryClientProvider`: API veri yonetimi icin ortak context saglar.
- `StrictMode`: gelistirmede hatalari erken yakalamaya yardim eder.

## 3) Sayfa Yollari (Routing)

`src/App.tsx` icinde:

- `path="games"` -> `GamesPage`
- `path="games/:slug"` -> `GameDetailPage`
- `path="games/genres/:genre"` -> `GenrePage`
- `path="*"` -> `NotFoundPage`

`lazy(...)` neden var?

- Her sayfayi ilk yuklemede degil, gerektiginde indirir.
- Ilk acilis performansini iyilestirir.

`Suspense` neden var?

- Lazy yuklenen sayfa gelene kadar fallback yazi gosterir.

## 4) Senin Sordugun Konu: `function` ve `return` Neden Kullanilir?

Ornek: `src/lib/systemRequirements.ts`

```ts
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
```

Bu fonksiyonun mantigi:

- Girdi: `value`
- Kural: deger `min` altina inmesin, `max` ustune cikmasin
- Cikti: sinirlandirilmis deger

Neden `return` var?

- Fonksiyon bir sonuc uretir.
- Bu sonucu disariya verir.
- `return` olmazsa fonksiyonun sonucu `undefined` olur.

Kullanimi:

- `toScore(value)` fonksiyonu `clamp` cagirir.
- Boylese skorlar 2-10 araliginda zorlanir.

## 5) TypeScript Terimleri (Bu Projede)

### `interface`

Verinin seklini tarif eder.

Ornek:

```ts
export interface CompatibilityResult {
  status: CompatibilityStatus
  targetFps: 30 | 60
  avgFpsLow: number
  notes: string[]
}
```

Anlami:

- Bu tipteki nesnede hangi alanlar olmasi gerektigi netlesir.
- IDE hata yakalar, otomatik tamamlama verir.

### `type`

Alias veya union tanimlar.

Ornek:

```ts
export type CompatibilityStatus = 'karsilar' | 'sinirda' | 'karsilamaz'
```

Anlami:

- Bu alan sadece bu 3 degerden biri olabilir.

### `function`

Tekrar kullanilabilir is parcasi.

### `return`

Fonksiyonun sonucunu disariya dondurur.

### `useState`

Komponent icinde degisen veriyi tutar.

### `useEffect`

Yan etkiler icin kullanilir:

- API cagirmak
- localStorage yazmak
- event listener eklemek

### `useMemo`

Pahali hesaplari gereksiz tekrar etmemek icin sonucu cache'ler.

## 6) Veri Akisi (Oyun Detay Sayfasi)

`src/pages/GameDetailPage.tsx`:

1. URL'den `slug` alinir.
2. `games` listesinden ilgili oyun bulunur.
3. Oyun bulunursa ekran basilir.
4. Sistem gereksinimi icin API cagrisi yapilir.
5. Kullanici donanimi ile oyunun ihtiyaci karsilastirilir.
6. FPS tahmini ve durum (`karsilar/sinirda/karsilamaz`) uretilir.

Bu sayfa ayni zamanda:

- yorumlar
- oduller
- platform detaylari
- dis linkler

gibi birden fazla kaynagi birlestirir.

## 7) `src/lib/systemRequirements.ts` Mantigi

Bu dosya bir "is kurallari motoru" gibi calisir.

Temel bloklar:

- CPU/GPU model listeleri + score'lari
- Oyun icin minimum/onerilen ihtiyac hesaplari
- Kullanici sistemi ile karsilastirma
- Sonuc uretimi (`CompatibilityResult`)

Fonksiyon yaklasimi:

- Her fonksiyon tek bir isi yapar.
- Kucuk fonksiyonlar zincirlenir.
- En ustte `evaluateCompatibility(...)` gibi ana fonksiyon nihai sonucu dondurur.

## 8) Neden Her Sey Dosyalara Bolunmus?

Sebep: bakim kolayligi.

- `pages`: ekrani cizer
- `lib`: hesaplama/is kurali yapar
- `data`: ham veri tutar
- `api`: dis servislere guvenli server-side baglanir

Bu ayrim olmazsa tek dosyada her sey birbirine girer.

## 9) Backend Endpointleri ve Cache

`api/game-requirements.js` ve `api/steam-owned-games.js`:

- Dis kaynaklardan veri ceker.
- Cache kullanir (`api/_cache.js`).
- Sebep:
  - rate-limit riskini azaltmak
  - daha hizli cevap vermek
  - ayni istegi tekrar tekrar dis servise atmamak

## 10) Build, Lint, Deploy

- Gelistirme: `npm run dev`
- Tip + production build: `npm run build`
- Kod kurali kontrolu: `npm run lint`
- Deploy: `vercel --prod --yes`

## 11) "Bu Satir Neye Bagli?" Sorusu Nasil Cevaplanir?

Her yeni satir icin su mini kontrolu yap:

1. Bu satir hangi state veya prop'u okuyor?
2. Bu satir hangi fonksiyonu cagiriyor?
3. Cagirilan fonksiyon hangi dosyada?
4. Bu degisiklik UI'da nerede gorunecek?
5. API/route/cached data etkileniyor mu?

Bu 5 soru, projeyi profesyonelce okumani saglar.

## 12) Ogrenme Plani (Pratik)

### Asama 1: Router ve sayfalar

- `src/main.tsx`, `src/App.tsx`
- Gorev: Yeni bir test sayfasi ac (`/learn-test`)

### Asama 2: Data->UI baglantisi

- `src/data/siteContent.ts` + `src/pages/GamesPage.tsx`
- Gorev: Bir kategori etiketi degistir, etkisini gor.

### Asama 3: Is kurali

- `src/lib/systemRequirements.ts`
- Gorev: `clamp` sinirini degistir, FPS sonucunu incele.

### Asama 4: API ve cache

- `api/game-requirements.js`, `api/_cache.js`
- Gorev: Cache TTL degistir, davranisi test et.

## 13) Siklikla Kullanilan Terimler Sozlugu

- `Component`: Ekran parcasi (React fonksiyonu)
- `Hook`: React ozel fonksiyonlari (`useState`, `useEffect`, ...)
- `Prop`: Komponente disaridan gelen veri
- `State`: Komponentin icindeki degisen veri
- `Type`: TypeScript veri tipi
- `Interface`: Nesne sekli tanimi
- `Union Type`: Birden fazla deger secenegi (`A | B`)
- `Slug`: URL dostu ad (`the-talos-principle-2`)
- `Route`: URL->sayfa eslesmesi
- `Endpoint`: API giris noktasi
- `Cache`: Sonucu gecici saklayip tekrar kullanma
- `Fallback`: Ilk yontem olmazsa alternatif yontem
- `Dedupe`: Tekrarlari temizleme

## 14) Bu Projede "Neden Boyle?" Cevap Ozeti

- TypeScript: hatayi erken yakalamak icin.
- `return`: fonksiyon sonucu vermek icin.
- `useMemo`: gereksiz hesap ve render'i azaltmak icin.
- Cache: dis servis riskini dusurmek icin.
- Dosya ayrimi: okunabilirlik ve bakim kolayligi icin.
- Lazy routes: ilk acilisi hizlandirmak icin.

## 15) Bir Sonraki Adim

Bu dosyayi okuyup su formatta sor:

- "Su dosyada su fonksiyonun akisini adim adim cikar."
- "Su state degisince hangi componentler tekrar render oluyor?"
- "Su satiri silsem ne bozulur?"

Ben her sorunda sana "kod ustunden" ogretecegim.
