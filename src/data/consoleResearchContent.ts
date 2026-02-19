export type ConsoleSlug = 'nintendo' | 'playstation' | 'xbox'

export interface ConsoleModelHighlight {
  name: string
  release: string
  media: string
  note: string
}

export interface ConsoleAccessory {
  name: string
  type: string
  compatible: string
  note: string
}

export interface ConsoleGameSeed {
  title: string
  year: number
  exclusivity: string
  note: string
}

export interface ConsoleResearchContent {
  title: string
  intro: string
  timeline: string[]
  models: ConsoleModelHighlight[]
  accessories: ConsoleAccessory[]
  gameSeeds: ConsoleGameSeed[]
  trivia: string[]
}

export const consoleResearchContent: Record<ConsoleSlug, ConsoleResearchContent> = {
  nintendo: {
    title: 'Nintendo',
    intro:
      "Rapor, Nintendo bölümünü ev/el/hibrit ekseninde kademeli modellemeyi öneriyor. Özellikle eski nesillerde bölgesel çıkış ayrıntıları eksik olabildiği için veri şemasında opsiyonel alanlar kullanılmalı.",
    timeline: [
      '1977: Color TV-Game 6 / 15',
      '1983: Famicom',
      '1989: Game Boy',
      '1996: Nintendo 64',
      '2004: Nintendo DS',
      '2011: Nintendo 3DS',
      '2017: Nintendo Switch',
      '2019: Nintendo Switch Lite',
      '2021: Nintendo Switch OLED',
      '2025: Nintendo Switch 2',
    ],
    models: [
      {
        name: 'Nintendo 64',
        release: '1996',
        media: 'Kartuş',
        note: '64-bit nesilde 3D tasarımın ana akıma taşınmasında kritik model.',
      },
      {
        name: 'Nintendo Switch',
        release: '2017-03-03',
        media: 'Kartuş + Dijital',
        note: 'TV/masaüstü/elde taşınabilir hibrit form faktörüyle nesil değiştirdi.',
      },
      {
        name: 'Nintendo Switch 2',
        release: '2025-06-05',
        media: 'Kartuş + Dijital',
        note: '1080p ekran, 4K TV modu ve Joy-Con 2 ile yeni nesil hibrit yaklaşım.',
      },
    ],
    accessories: [
      {
        name: 'Rumble Pak',
        type: 'Aksesuar',
        compatible: 'Nintendo 64',
        note: 'Kontrolcüye takılan titreşim modülü.',
      },
      {
        name: 'Wii Remote Plus',
        type: 'Kontrolcü',
        compatible: 'Wii',
        note: 'MotionPlus entegrasyonuyla hareket algılama deneyimi.',
      },
      {
        name: 'Joy-Con 2 (L/R)',
        type: 'Kontrolcü',
        compatible: 'Switch 2',
        note: 'C düğmesi, HD rumble 2 ve uyumlu oyunlarda mouse kontrolleri.',
      },
    ],
    gameSeeds: [
      {
        title: 'Super Mario 64',
        year: 1996,
        exclusivity: 'console-gen exclusive',
        note: 'Nintendo 64 lansman döneminin en kritik 3D platform oyunu.',
      },
      {
        title: 'Pilotwings 64',
        year: 1996,
        exclusivity: 'console-gen exclusive',
        note: 'N64 lansman döneminde öne çıkan uçuş odaklı yapım.',
      },
      {
        title: 'Pokémon Party mini',
        year: 2001,
        exclusivity: 'full',
        note: 'Pokémon mini için seed kayıt örneği.',
      },
    ],
    trivia: [
      "Color TV-Game Racing 112, Shigeru Miyamoto'nun yer aldığı erken Nintendo projeleri arasında anılıyor.",
      'DS ailesinde Lite/DSi gibi revizyonlar, model ve varyant ayrımının veri şemasında ayrı tutulmasını gerektiriyor.',
      'Switch 2 teknik sayfaları, otomatik veri çıkarımı için yeterli düzeyde yapılandırılmış özellik metni sağlıyor.',
    ],
  },
  playstation: {
    title: 'PlayStation',
    intro:
      'Rapor, PlayStation tarafında resmi tarih şeridi + teknik dokümantasyon + basın bülteni üçlüsünü ana kaynak olarak öneriyor. PS5 ailesi için model grubu yaklaşımı özellikle önemli.',
    timeline: [
      '1994: PlayStation (JP)',
      '2000: PS one ve PlayStation 2',
      '2006: PlayStation 3',
      '2013: PlayStation 4',
      '2016: PS4 Slim ve PS4 Pro',
      '2020: PlayStation 5 / Digital Edition',
      '2023: PS5 slim model grubu',
      '2024: PlayStation 5 Pro',
    ],
    models: [
      {
        name: 'PlayStation 2',
        release: '2000',
        media: 'DVD',
        note: 'DVD oynatma + geri uyumluluk birleşimiyle dönemi belirleyen model.',
      },
      {
        name: 'PlayStation 5',
        release: '2020',
        media: 'Ultra HD Blu-ray / Dijital',
        note: 'Zen2 + RDNA tabanlı mimari, 825 GB özel SSD.',
      },
      {
        name: 'PlayStation 5 Pro',
        release: '2024-11-07',
        media: 'Takılabilir disk sürücüsü ile UHD BD',
        note: 'GPU yükseltmesi + PSSR odaklı ara nesil güç güncellemesi.',
      },
    ],
    accessories: [
      {
        name: 'Memory Card (8MB)',
        type: 'Aksesuar',
        compatible: 'PS1',
        note: 'Bulut öncesi kayıt yönetiminin temel parçası.',
      },
      {
        name: 'DualShock',
        type: 'Kontrolcü',
        compatible: 'PS1',
        note: 'Titreşim motoru ve analog çubuk odaklı nesil geçişi.',
      },
      {
        name: 'DualSense / DualSense Edge',
        type: 'Kontrolcü',
        compatible: 'PS5',
        note: 'Dokunsal geri bildirim, uyarlanabilir tetik ve pro seviye özelleştirme.',
      },
    ],
    gameSeeds: [
      {
        title: 'God of War (2018)',
        year: 2018,
        exclusivity: 'partial',
        note: 'PlayStation markasının en güçlü birinci parti serilerinden biri.',
      },
      {
        title: "Marvel's Spider-Man",
        year: 2018,
        exclusivity: 'partial',
        note: 'Insomniac imzalı, PS ekosistemiyle özdeşleşen amiral gemisi yapım.',
      },
      {
        title: 'The Last of Us Part II',
        year: 2020,
        exclusivity: 'partial',
        note: 'Naughty Dog tarafından geliştirilen, modern PlayStation vitrininin ana oyunlarından.',
      },
      {
        title: 'Ghost of Tsushima',
        year: 2020,
        exclusivity: 'partial',
        note: 'Sucker Punch yapımı, PlayStation tarafında öne çıkan açık dünya aksiyon oyunu.',
      },
      {
        title: "Demon's Souls (Remake)",
        year: 2020,
        exclusivity: 'console-gen exclusive',
        note: 'PS5 lansman döneminin teknik vitrin oyunlarından biri.',
      },
    ],
    trivia: [
      "PlayStation açılış sesi (startup chime) marka kimliğinin önemli bir parçası olarak raporda öne çıkıyor.",
      "PS5 lansmanı diskli + dijital varyantla başladı, 2023'te modüler disk yaklaşımına evrildi.",
      'PS5 Pro teknik duyurusu, sayfada doğrudan spec highlight kutularına dönüştürülebilecek metinler içeriyor.',
    ],
  },
  xbox: {
    title: 'Xbox',
    intro:
      'Rapor, Xbox bölümünde nesiller arası aksesuar uyumluluğunu temel anlatı olarak konumluyor. Teknik karşılaştırmalarda Series X ve Series S verileri resmi TR sayfalarından alınmalı.',
    timeline: [
      '2001: Xbox',
      '2005: Xbox 360',
      '2010: Xbox 360 S',
      '2013: Xbox 360 E ve Xbox One',
      '2017: Xbox One X',
      '2020: Xbox Series X ve Series S',
    ],
    models: [
      {
        name: 'Xbox 360',
        release: '2005-11-22',
        media: 'DVD',
        note: 'Xbox Live ile 7. neslin ana aktörlerinden biri.',
      },
      {
        name: 'Xbox Series X',
        release: '2020-11-10',
        media: '4K Blu-ray',
        note: '8C Zen2 + 12 TFLOP RDNA2 üst segment.',
      },
      {
        name: 'Xbox Series S',
        release: '2020-11-10',
        media: 'Dijital',
        note: '4 TFLOP RDNA2 ile daha erişilebilir giriş modeli.',
      },
    ],
    accessories: [
      {
        name: 'Xbox Kablosuz Oyun Kumandası',
        type: 'Kontrolcü',
        compatible: 'Xbox One / Series / PC',
        note: 'Bluetooth, 3.5 mm jak ve çoklu platform kullanımı.',
      },
      {
        name: 'Xbox Elite Wireless Controller Series 2 - Core',
        type: 'Kontrolcü (Pro)',
        compatible: 'Xbox One / Series / PC',
        note: 'Yüksek özelleştirme ve performans odaklı kullanım.',
      },
      {
        name: 'Seagate Depolama Genişletme Kartı',
        type: 'Aksesuar',
        compatible: 'Series X|S',
        note: 'Dahili SSD performansına yakın genişletme yaklaşımı.',
      },
    ],
    gameSeeds: [],
    trivia: [
      'Xbox tarafında oyun münhasırlığı, PC + bulut yayın modeli nedeniyle dinamik doğrulama gerektiriyor.',
      'Series X sayfalarında aksesuar uyumluluğu net bir ürün stratejisi olarak vurgulanıyor.',
      'Model şemasında revizyonları (360 S, 360 E, One X) ana modelden ayrı tutmak içerik doğruluğunu artırıyor.',
    ],
  },
}
