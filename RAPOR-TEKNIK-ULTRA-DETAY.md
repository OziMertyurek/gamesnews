# AllAroundGame Ultra Detay Teknik Rapor

Hazırlayan: Codex  
Tarih: 2026-02-18  
Proje: `allaroundgame`  
Çalışma dizini: `c:\Users\MSI\Desktop\yeni yeni yeni`

---

## 1) Yönetici Özeti (Teknik)

Bu proje; oyun keşfi, ürün kataloğu, topluluk etkileşimi (yorum), kullanıcı profili ve Steam kütüphane entegrasyonunu tek bir SPA içinde birleştiren React + TypeScript tabanlı bir uygulamaya dönüştürülmüştür.  
Geliştirme sürecinde:

1. Veri kapsamı ciddi şekilde büyütüldü (oyun + ürün + ödül veri setleri).
2. Navigasyon ve arama deneyimi platform ölçeğine uygun hale getirildi.
3. Steam tarafında CORS/proxy gerçekliği dikkate alınarak hibrit istek mimarisi kuruldu.
4. TGA verisi entegre edildi, ardından kullanıcı kararıyla riskli/hatalı görülen bir liste bloğu sadeleştirme amacıyla kaldırıldı.
5. UI metinleri Türkçe karakter standardına alındı.
6. Deploy akışı (Vercel/Netlify) ve SPA rewrite/redirect kuralları stabilize edildi.

Son durum: Kod çalışır, lint/build geçer, ana kullanıcı akışları tamamdır; ancak üretim sertleştirmesi için backend kimlik/servisleşme ve bundle parçalama önerilir.

---

## 2) Metodoloji ve Veri Kaynağı

Bu rapor hazırlanırken:

1. Git geçmişi (`git log`, `git show --stat`) analiz edildi.
2. Uygulama route, sayfa, data ve lib katmanları satır bazlı incelendi.
3. Yapılandırma dosyaları (Vite/Vercel/Netlify) üzerinden operasyon akışı çıkarıldı.
4. Veri dosyaları üzerinden yaklaşık hacim ve kapsam metrikleri üretildi.

Not: Bazı büyük TS veri dosyalarında ürün verisi “statik + runtime türetme” karışık olduğu için toplam adetler formül üzerinden hesaplanmıştır.

---

## 3) Sistem Mimarisi

## 3.1 Uygulama tipi

1. Single Page Application (SPA)
2. Framework: React 19 + TypeScript + Vite
3. Routing: React Router
4. UI: Tailwind
5. Veri yaklaşımı: büyük ölçüde local/static data + localStorage persistence

## 3.2 Katmanlar

1. `src/pages/*`: kullanıcıya görünen ekranlar.
2. `src/app/layout/*`: navbar/footer/layout.
3. `src/data/*`: oyun/ürün/ödül/dış kaynak veri katmanı.
4. `src/lib/*`: domain logic (auth, awards, community, steam).
5. `api/*` ve `netlify/functions/*`: serverless proxy endpointleri.

## 3.3 Çalışma modeli

1. Client-side route geçişleri.
2. Profil, yorum, oynanmış oyun, Steam eşleşmesi localStorage’da tutulur.
3. Steam oyun çekme sürecinde önce backend proxy, sonra tarayıcı fallback denenir.
4. Build çıktısı `dist/` olarak host edilir; SPA yönlendirmeleri host kuralı ile çözülür.

---

## 4) Route Haritası ve İşlev Matrisi

Kaynak: `src/App.tsx`

1. `/`: Ana sayfa (hero, platform kartları, reklam alanı mockları, CTA akışı)
2. `/products/:platform`: ürün sayfası (PC + konsol platformları)
3. `/games`: tür tabanlı oyun keşif ekranı
4. `/games/alfabetik`: A-Z oyun dizini
5. `/oduller`: TGA arşiv/kategori/leaderboard ekranı
6. `/games/genres/:genre`: tür detay listesi
7. `/games/:slug`: oyun detay, yorum, kaynak linkleri
8. `/iletisim`: iletişim/reklam iletişim ekranı
9. `/login`: giriş
10. `/signup`: kayıt
11. `/profil`: kullanıcı profil/steam/sitede oynadıklarım
12. `/kullanici/:email`: public profil görüntüleme
13. `*`: 404

Toplam route tanımı: 14 (layout wrapper dahil).

---

## 5) Veri Katmanı İncelemesi

## 5.1 Oyun veri modeli

Dosya: `src/data/siteContent.ts`

`GameItem` alanları:

1. Kimlik: `slug`, `title`
2. Sınıflama: `genre`, `platforms`
3. Zaman/puan: `releaseYear`, `score`
4. Açıklama: `summary`
5. Harici veri: `metacriticScore`, `howLongToBeat*`
6. Linkler: `metacriticUrl`, `howLongToBeatUrl`, `gamespotArticleUrl`, `youtube*`

Ek teknik notlar:

1. `gameGenres` ile tür kataloğu yönetiliyor.
2. `genreTitlePools` + `createGenreGames` ile oyun tabanı türetiliyor.
3. `resolveExternalData` fonksiyonu `gameExternalData` ile fuzzy eşleştirme yapıyor.
4. Eşleşme yoksa fallback linkler otomatik üretiliyor.

### Kapsam metrikleri

1. Tür sayısı: 22
2. Tür başına title pool: 8
3. Hesaplanan oyun toplamı: 176
4. `gameExternalData` kayıt sayımı: ~246 entry (regex tabanlı)

## 5.2 PC ürün veri modeli

Dosya: `src/data/pcProducts.ts`

`PCProduct` alanları:

1. Kimlik/isim: `id`, `name`
2. Sınıf: `category`, `peripheralSubcategory?`
3. Fiyat: `price`, `priceMin`, `priceMax`
4. Kaynak: `store`, `link`, `sourceOfferCount`
5. Sunum: `image`, `brand`, `specs`
6. Operasyonel: `updatedAt`, `inStock`

### Veri üretim stratejisi

Dosya hem statik seed hem runtime üretim içerir:

1. Başlangıçta seed ürünler var.
2. Sonra `monitorNames`, çevre birimi listeleri, RAM/SSD listeleri map edilerek yeni ürünler oluşturuluyor.
3. Son aşamada `estimatedModelPrice()` ile model tabanlı fiyat normalize ediliyor.
4. `rangeByCategory` ile min/max dinamik olarak yeniden hesaplanıyor.

### Hacim (hesap)

1. Seed id sayımı: 89
2. Monitor listesi: 61
3. Klavye: 30
4. Mouse: 25
5. Kulaklık: 27
6. RAM ek listesi: 35
7. SSD ek listesi: 40
8. Runtime ek toplam: 218
9. Tahmini toplam PC ürün: 307

## 5.3 Konsol ürün veri modeli

Dosya: `src/data/consoleProducts.ts`

1. Platformlar: `ps`, `xbox`, `nintendo`
2. Kategoriler: `Konsol`, `Gamepad`, `Kulaklik`, `Aksesuar`
3. Katalog girdileri platform bazlı sabit listelerden üretiliyor.
4. Fiyatlar `categoryRanges` + index dağılımı ile türetiliyor.

## 5.4 Ödül veri modeli

Dosya: `src/data/tgaAwards.ts`

1. `tgaYearRecords`: 2018–2024 arası yıllık kayıtlar
2. `tgaCurrentAwardsYear`: 2025
3. `tgaCurrentCategoryAwards`: güncel kategori listesi (slug bazlı)

Hacim:

1. Yıl kayıtları: 7
2. Güncel kategori slug: ~29

---

## 6) Domain Logic Katmanı

## 6.1 Auth (`src/lib/auth.ts`)

Model:

1. Tamamen localStorage bazlıdır.
2. Şema:
   - `gn_users`
   - `gn_current_user`
3. Fonksiyonlar:
   - `signupUser`
   - `loginUser`
   - `logoutUser`
   - `getCurrentUser`
   - `listPublicUsers`
   - `getPublicUserByEmail`

Risk:

1. Hash yok, backend yok, token yok.
2. Tamamen client trust model.
3. Demo/prototip için uygun, production için yetersiz.

## 6.2 Community (`src/lib/community.ts`)

Şema:

1. `gn_user_profiles_v1`
2. `gn_game_comments_v1`

Fonksiyonlar:

1. Steam bağlantı bilgisi saklama.
2. Steam oyun listesi saklama ve sıralama.
3. “Sitede oynadım” toggle.
4. Oyun yorumları CRUD (id + createdAt + owner kontrolü).

Güçlü yan:

1. Domain ayrımı net.
2. Sayfa katmanı sade kalıyor.

Sınırlama:

1. Çok cihaz senkronu yok.
2. Veri kaybı riski (tarayıcı temizleme).

## 6.3 Awards (`src/lib/awards.ts`)

1. Başlık normalize eşleştirmesi (`normalize`, `titleMatch`).
2. Oyun kategorisi filtresi (`isGameCategory`) ile oyun dışı kategorileri dışlama.
3. Oyun bazlı ödül özeti üretme (`getGameAwardSummary`).
4. Leaderboard üretimi (`getAwardedGamesLeaderboard`).
5. TGA katalog üretimi (`getAllTgaGamesCatalog`).

Gözlem:

1. String normalize + includes eşleşmesi esnek ama false positive riski taşır.
2. Kategori filtreleri doğru seçilmediğinde kişi/esports sızıntısı olabilir.

## 6.4 Steam (`src/lib/steam.ts`)

Akış:

1. `fetchSteamOwnedGames(apiKey, steamIdOrProfile)`
2. Önce `tryBackendProxy` (2 endpoint zinciri)
3. Olmazsa `resolveSteamId` + `fetchJsonWithFallback`
4. CORS engeli için proxy servis fallbackları denenir
5. Sonuç `SteamOwnedGame[]` normalize edilir

Hata yönetimi:

1. API key format validasyonu var.
2. SteamID64 17 hane kontrolü var.
3. Kullanıcıya anlaşılır error string veriliyor.

---

## 7) UI/UX ve Etkileşim Katmanı

## 7.1 Navbar davranışı

Dosya: `src/app/layout/Navbar.tsx`

1. Desktop dropdown + mobile nav birlikte yönetiliyor.
2. Arama kutusu scroll ile collapsible.
3. Flicker önlemek için:
   - scroll delta eşiği
   - toggle mesafe eşiği
   - toggle zaman eşiği/cooldown
4. Search result click ile route/href ayrımı yapılır.

## 7.2 Ürün ekranı davranışı

Dosya: `src/pages/ProductsPage.tsx`

1. Çoklu filtreler birleşik şekilde uygulanıyor.
2. Filter chip üzerinden tekil geri alma var.
3. `hasActiveFilters` üzerinden conditional UI gösterimi.
4. Görsel yükleme hatasında fallback SVG.
5. Aralık + ortalama fiyat şeffaf sunuluyor.

## 7.3 Oyun detay davranışı

Dosya: `src/pages/GameDetailPage.tsx`

1. Oyun yoksa fallback kart.
2. HLTB/Metacritic eksikse tahmini hesaplama.
3. Ödül rozetleri + kategori listesi.
4. Yorum formu auth’a bağlı.
5. Yorum silme yalnızca sahibi için.

---

## 8) Entegrasyon ve Servis Akışı

## 8.1 Vite dev proxy

Dosya: `vite.config.ts`

1. Dev middleware `/api/steam-owned-games` sunar.
2. Request body parse edilir.
3. SteamID resolve + owned games server-side fetch yapılır.
4. CORS headerları eklenir.

## 8.2 Vercel serverless

Dosya: `api/steam-owned-games.js`

1. POST endpoint.
2. API key + steamId/profile validasyonu.
3. ResolveVanityURL + GetOwnedGames çağrısı.
4. Normalize response döner.
5. Hata yönetimi + CORS header var.

## 8.3 Netlify function

Dosya: `netlify/functions/steam-owned-games.js`

1. Vercel endpoint’inin function karşılığı.
2. `event.httpMethod` tabanlı routing.
3. Aynı business logic.

## 8.4 Hosting rewrite/redirect

1. `vercel.json`:
   - `/api/*` API’ye
   - diğer tüm route `index.html`
2. `netlify.toml`:
   - API redirect function’a
   - SPA fallback redirect

---

## 9) Commit Bazlı Teknik Etki Analizi

## 9.1 `6abc861` (büyük kırılım)

Özet:

1. TGA veri seti eklendi (`src/data/tgaAwards.ts` + scripts).
2. Award helper katmanı eklendi (`src/lib/awards.ts`).
3. Community + Steam logic eklendi (`src/lib/community.ts`, `src/lib/steam.ts`).
4. Awards page ve profile entegrasyonları geldi.
5. Vite dev proxy ve serverless endpointler eklendi.

Etki:

1. Uygulama “sadece katalog” olmaktan çıkıp “veri ilişkili platform” oldu.
2. Teknik karmaşıklık arttı ama özellik seti güçlü şekilde genişledi.

## 9.2 `ea1c87a` (keşif kırılımı)

1. Global arama sistemi eklendi.
2. Public profile route eklendi.
3. Auth/public user data nav aramaya bağlandı.

Etki:

1. Bilgi erişimi tek giriş noktası kazandı.
2. Navigasyon yoğunluğu arttı, sonradan stabilizasyon ihtiyacı doğdu.

## 9.3 `9e943aa` (stabilizasyon + görsel iyileştirme)

1. Navbar scroll davranışı stabilize edildi.
2. Home platform kart görselleri yenilendi.

Etki:

1. “anlık aç/kapa” kullanıcı şikayeti düşürüldü.

## 9.4 `e5693f0` (PC katalog büyütme)

1. Monitor/peripheral veri seti genişledi.
2. ProductsPage fallback/filtre davranışları iyileşti.

Etki:

1. Ürün keşif katmanı ciddi biçimde zenginleşti.

## 9.5 `9aecd88` + `18a0940` (rebrand + fiyat modeli)

1. Marka adı AllAroundGame’e taşındı.
2. Fiyat gösterimleri ve ürün modeli iyileştirildi.
3. Ek veri scriptleri ve dış veri güncellemeleri işlendi.

Etki:

1. Hem görsel kimlik hem ticari (ürün/fiyat) güven algısı yükseldi.

## 9.6 `309aeaf` (sadeleştirme hamlesi)

1. TGA havuz section kaldırıldı.
2. GamesPage sadeleşti.
3. Awards ve detail tarafında eşleşme/fallback düzenlendi.

Etki:

1. Yanlış pozitif gösterim riski düşürüldü.
2. Kullanıcı odaklı netlik arttı.

## 9.7 `d91a7f7` (dil kalite hamlesi)

1. 15 dosyada TR karakter standardizasyonu.
2. UI mesajlarının okunabilirliği artırıldı.

Etki:

1. Lokal kullanıcı deneyimi belirgin düzeldi.

---

## 10) Hata Analizi (RCA: Root Cause Analysis)

## 10.1 Steam “Failed to fetch”

Semptom:

1. Steam oyunları çekilemiyor.

Kök neden:

1. Tarayıcı-origin doğrudan Steam API çağrısı CORS/policy kısıtına takılıyor.

Kalıcı çözüm:

1. Serverless proxy endpointi kullanmak.
2. Frontend fallbackı sadece ikinci seçenek olarak tutmak.
3. Prod ortamında API key’i env’den almak.

## 10.2 Navbar flicker

Semptom:

1. Scroll sırasında search bar sürekli açılıp kapanıyor.

Kök neden:

1. Scroll event + layout reflow + eşiksiz toggle kombinasyonu.

Çözüm:

1. Toggle kararına minimum mesafe ve minimum süre eşiği.

## 10.3 Ödül listesine oyun dışı kayıt sızması

Semptom:

1. Kişi/esports girdisi oyun gibi görünmesi.

Kök neden:

1. Metin normalize eşleştirme + kategori allowlist/denylist dengesizliği.

Çözüm:

1. Filtre sıkılaştırma.
2. Son kullanıcı kararıyla ilgili section’ın kaldırılması (en güvenli sadeleşme).

## 10.4 Toplu metin dönüşümünde parse kırılması

Semptom:

1. TypeScript parse errors.

Kök neden:

1. Otomatik replace’in kod tokenlarını da etkilemesi.

Çözüm:

1. Değişiklik geri alındı.
2. Manuel dosya bazlı güvenli düzenleme.

---

## 11) Güvenlik Değerlendirmesi

## 11.1 Mevcut riskler

1. LocalStorage auth spoof edilebilir.
2. İstemcide API key girişi kullanıcı hatasına/ifşaya açık.
3. Public profile route email bazlı olduğu için enumerate riski var.
4. Yorum sistemi client-side olduğu için manipülasyon mümkün.

## 11.2 Önerilen sertleştirme

1. Auth backend’e taşınmalı (JWT/session + refresh).
2. Steam API key istemciye hiç açılmamalı (sadece backend secret).
3. Public profile id email yerine opaque id olmalı.
4. Yorumlar backend persistence + rate limit + moderation katmanı almalı.
5. CSP, X-Frame-Options, Referrer-Policy başlıkları host düzeyinde aktif edilmeli.

---

## 12) Performans Değerlendirmesi

Gözlem:

1. Build çıktısında ana bundle için >500kb uyarısı var.

Neden:

1. Büyük statik TS veri dosyaları.
2. Tüm route ve data’nın tek bundle’a yakın yüklenmesi.

Öneriler:

1. Route-level lazy loading (`React.lazy` + suspense).
2. Büyük data dosyalarını async chunk’a bölmek.
3. `manualChunks` stratejisi.
4. Görsel/data cache stratejisi (CDN + immutable headers).

---

## 13) Test ve Kalite Güvence Durumu

Mevcut:

1. `npm run lint` düzenli geçecek şekilde kontrol edildi.
2. `npm run build` başarılı.
3. Manuel kullanıcı geri bildirimi odaklı UAT yapıldı.

Eksik:

1. Birim test yok.
2. E2E test yok.
3. Görsel regresyon testi yok.

Önerilen test matrisi:

1. Auth flow: signup/login/logout.
2. Search flow: her kind için sonuç doğrulama.
3. Products: filtre kombinasyonları.
4. Game detail: yorum create/delete ownership.
5. Steam: proxy success/failure path.
6. Routing: SPA refresh fallback (Vercel/Netlify).

---

## 14) Operasyon ve DevOps Notları

1. Vercel ve Netlify aynı repo ile destekleniyor.
2. SPA rewrite/redirect kuralları mevcut.
3. Steam endpoint iki platformda da tanımlı.
4. README deploy adımları mevcut.

Operasyonel iyileştirme:

1. CI pipeline’a lint/build zorunlu gate.
2. Preview deploy + smoke test.
3. Release tagging ve changelog standardı.

---

## 15) Teknik Borç Envanteri

P1:

1. Auth backend migration.
2. Steam proxy tek kaynak zorunlu kullanım.
3. Encoding/mojibake temizliği (`pcProducts` metinleri).

P2:

1. Bundle split/performance planı.
2. Award eşleşme canonical id modeli.

P3:

1. Admin panel veya veri güncelleme dashboard.
2. Analitik event tracking (search click-through, filter usage).

---

## 16) Sprint Bazlı Uygulanabilir Yol Haritası

Sprint 1 (Stabilizasyon):

1. Auth ve Steam güvenlik sertleştirme.
2. UTF-8 veri temizleme scripti.
3. Üretim ortamı hata logging altyapısı.

Sprint 2 (Performans):

1. Route lazy loading.
2. Data chunk ayrıştırması.
3. Kritik sayfalarda first contentful paint iyileştirme.

Sprint 3 (Ürünleşme):

1. Backend yorum sistemi.
2. Profil paylaşım modelinin güvenli ID’ye geçişi.
3. Admin/data maintenance panel.

---

## 17) Sonuç ve Teknik Karar Özeti

1. Proje, başlangıç seviyesinden çok daha kapsamlı bir ürün prototipine taşındı.
2. Kullanıcıdan gelen doğrudan geri bildirimlerle hızlı iterasyon yapıldı.
3. En riskli noktalar doğru tespit edildi ve kısa vadeli koruyucu çözümler uygulandı.
4. Uzun vadeli üretim kalitesi için yapılacaklar net: backendleşme, güvenlik sertleştirme, performans parçalama.

Bu rapor, mevcut kod tabanının hem “ne yapıldı” hem “neden böyle yapıldı” hem de “bundan sonra nasıl ürünleşir” sorularına teknik düzeyde yanıt vermek üzere hazırlanmıştır.

