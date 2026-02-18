export type ConsolePlatform = 'ps' | 'xbox' | 'nintendo'
export type ConsoleCategory = 'Konsol' | 'Gamepad' | 'Kulaklik' | 'Aksesuar'

export interface ConsoleProduct {
  id: string
  platform: ConsolePlatform
  name: string
  category: ConsoleCategory
  priceMin: number
  priceMax: number
  store: string
  link: string
  image: string
  brand: string
  updatedAt: string
  inStock: boolean
  specs: string
}

const stores = ['Akakce Coklu Satici', 'Hepsiburada', 'Trendyol', 'N11', 'Amazon TR']

const platformTitles: Record<ConsolePlatform, string> = {
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

type CatalogItem = {
  category: ConsoleCategory
  name: string
  image: string
  brand: string
}

const REAL_IMAGES = {
  ps5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Black_and_white_Playstation_5_base_edition_with_controller.png/330px-Black_and_white_Playstation_5_base_edition_with_controller.png',
  portal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/PlayStation_Portal.jpg/330px-PlayStation_Portal.jpg',
  psvr2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/PSVR2_%28Non-Stereoscopic%29.png/330px-PSVR2_%28Non-Stereoscopic%29.png',
  psCamera: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sony-PlayStation-4-Camera-Mk1.jpg/960px-Sony-PlayStation-4-Camera-Mk1.jpg',
  xboxSeries: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Xbox_Series_X_S_color.svg/330px-Xbox_Series_X_S_color.svg.png',
  xboxController: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Microsoft-Xbox-One-controller.jpg/330px-Microsoft-Xbox-One-controller.jpg',
  switchLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Nintendo_Switch_logo.svg/330px-Nintendo_Switch_logo.svg.png',
  joyCon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nintendo_Switch_Joy-Con_Controllers.png/330px-Nintendo_Switch_Joy-Con_Controllers.png',
  switchPro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Nintendo-Switch-Pro-Controller-FL.jpg/330px-Nintendo-Switch-Pro-Controller-FL.jpg',
  headphones: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/S%C5%82uchawki_referencyjne_K-701_firmy_AKG.jpg/330px-S%C5%82uchawki_referencyjne_K-701_firmy_AKG.jpg',
  sdCard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/SD_Cards.svg/330px-SD_Cards.svg.png',
  dock: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ThinkPad_Ultra_docking_station.JPG/330px-ThinkPad_Ultra_docking_station.JPG',
  gameController: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/SNES-Controller-in-Hand.jpg/330px-SNES-Controller-in-Hand.jpg',
} as const

const catalogByPlatform: Record<ConsolePlatform, CatalogItem[]> = {
  ps: [
    { category: 'Konsol', name: 'Sony PlayStation 5 Slim Digital Edition', image: REAL_IMAGES.ps5, brand: 'Sony' },
    { category: 'Konsol', name: 'Sony PlayStation 5 Slim Standard Edition', image: REAL_IMAGES.ps5, brand: 'Sony' },
    { category: 'Konsol', name: 'Sony PlayStation 5 Pro', image: REAL_IMAGES.ps5, brand: 'Sony' },
    { category: 'Gamepad', name: 'Sony DualSense Wireless Controller', image: REAL_IMAGES.gameController, brand: 'Sony' },
    { category: 'Gamepad', name: 'Sony DualSense Edge Wireless Controller', image: REAL_IMAGES.gameController, brand: 'Sony' },
    { category: 'Gamepad', name: 'Sony DualShock 4 Wireless Controller', image: REAL_IMAGES.gameController, brand: 'Sony' },
    { category: 'Kulaklik', name: 'Sony PULSE 3D Wireless Headset', image: REAL_IMAGES.headphones, brand: 'Sony' },
    { category: 'Kulaklik', name: 'Sony INZONE H9 Wireless Gaming Headset', image: REAL_IMAGES.headphones, brand: 'Sony' },
    { category: 'Kulaklik', name: 'Razer Kaira for PlayStation', image: REAL_IMAGES.headphones, brand: 'Razer' },
    { category: 'Aksesuar', name: 'Sony PlayStation Portal Remote Player', image: REAL_IMAGES.portal, brand: 'Sony' },
    { category: 'Aksesuar', name: 'Sony PlayStation VR2', image: REAL_IMAGES.psvr2, brand: 'Sony' },
    { category: 'Aksesuar', name: 'Sony PlayStation HD Camera', image: REAL_IMAGES.psCamera, brand: 'Sony' },
  ],
  xbox: [
    { category: 'Konsol', name: 'Microsoft Xbox Series X', image: REAL_IMAGES.xboxSeries, brand: 'Microsoft' },
    { category: 'Konsol', name: 'Microsoft Xbox Series S', image: REAL_IMAGES.xboxSeries, brand: 'Microsoft' },
    { category: 'Konsol', name: 'Microsoft Xbox Series X 2TB Galaxy Black', image: REAL_IMAGES.xboxSeries, brand: 'Microsoft' },
    { category: 'Gamepad', name: 'Xbox Wireless Controller', image: REAL_IMAGES.xboxController, brand: 'Microsoft' },
    { category: 'Gamepad', name: 'Xbox Elite Wireless Controller Series 2', image: REAL_IMAGES.xboxController, brand: 'Microsoft' },
    { category: 'Gamepad', name: 'Razer Wolverine V2 Chroma for Xbox', image: REAL_IMAGES.xboxController, brand: 'Razer' },
    { category: 'Kulaklik', name: 'Xbox Wireless Headset', image: REAL_IMAGES.headphones, brand: 'Microsoft' },
    { category: 'Kulaklik', name: 'SteelSeries Arctis Nova 7X', image: REAL_IMAGES.headphones, brand: 'SteelSeries' },
    { category: 'Kulaklik', name: 'HyperX CloudX Stinger Core', image: REAL_IMAGES.headphones, brand: 'HyperX' },
    { category: 'Aksesuar', name: 'Seagate Storage Expansion Card for Xbox Series X|S', image: REAL_IMAGES.sdCard, brand: 'Seagate' },
    { category: 'Aksesuar', name: 'Xbox Play and Charge Kit', image: REAL_IMAGES.gameController, brand: 'Microsoft' },
    { category: 'Aksesuar', name: 'PowerA Charging Stand for Xbox Wireless Controllers', image: REAL_IMAGES.dock, brand: 'PowerA' },
  ],
  nintendo: [
    { category: 'Konsol', name: 'Nintendo Switch OLED Model', image: REAL_IMAGES.switchLogo, brand: 'Nintendo' },
    { category: 'Konsol', name: 'Nintendo Switch', image: REAL_IMAGES.switchLogo, brand: 'Nintendo' },
    { category: 'Konsol', name: 'Nintendo Switch Lite', image: REAL_IMAGES.switchLogo, brand: 'Nintendo' },
    { category: 'Gamepad', name: 'Nintendo Switch Pro Controller', image: REAL_IMAGES.switchPro, brand: 'Nintendo' },
    { category: 'Gamepad', name: 'Nintendo Joy-Con (L/R) Wireless Controllers', image: REAL_IMAGES.joyCon, brand: 'Nintendo' },
    { category: 'Gamepad', name: '8BitDo Ultimate Bluetooth Controller', image: REAL_IMAGES.switchPro, brand: '8BitDo' },
    { category: 'Kulaklik', name: 'Logitech G435 LIGHTSPEED', image: REAL_IMAGES.headphones, brand: 'Logitech' },
    { category: 'Kulaklik', name: 'SteelSeries Arctis 1 Wireless', image: REAL_IMAGES.headphones, brand: 'SteelSeries' },
    { category: 'Kulaklik', name: 'Razer Barracuda X', image: REAL_IMAGES.headphones, brand: 'Razer' },
    { category: 'Aksesuar', name: 'Nintendo Switch Dock Set', image: REAL_IMAGES.dock, brand: 'Nintendo' },
    { category: 'Aksesuar', name: 'HORI Split Pad Pro', image: REAL_IMAGES.gameController, brand: 'HORI' },
    { category: 'Aksesuar', name: 'SanDisk microSDXC for Nintendo Switch', image: REAL_IMAGES.sdCard, brand: 'SanDisk' },
  ],
}

const categoryRanges: Record<ConsoleCategory, [number, number]> = {
  Konsol: [12000, 58000],
  Gamepad: [1700, 14500],
  Kulaklik: [1400, 16500],
  Aksesuar: [1000, 24000],
}

function buildConsoleProducts(platform: ConsolePlatform): ConsoleProduct[] {
  const items = catalogByPlatform[platform]
  return items.map((item, index) => {
    const [minBase, maxBase] = categoryRanges[item.category]
    const avg = minBase + Math.round(((maxBase - minBase) * ((index % 8) + 1)) / 9)
    const low = Math.round(avg * 0.86)
    const high = Math.round(avg * 1.14)
    return {
      id: `${platform}-${String(index + 1).padStart(3, '0')}`,
      platform,
      name: item.name,
      category: item.category,
      priceMin: Math.max(minBase, low),
      priceMax: Math.min(maxBase, high),
      store: stores[index % stores.length],
      link: `https://www.google.com/search?q=${encodeURIComponent(`${item.name} fiyat`)}`,
      image: item.image,
      brand: item.brand,
      updatedAt: '2026-02-18',
      inStock: index % 6 !== 0,
      specs: `${platformTitles[platform]} ile uyumlu ${item.category.toLowerCase()} urunu`,
    }
  })
}

export const consoleProducts: ConsoleProduct[] = [
  ...buildConsoleProducts('ps'),
  ...buildConsoleProducts('xbox'),
  ...buildConsoleProducts('nintendo'),
]

export const CONSOLE_LABELS: Record<ConsolePlatform, string> = {
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

export const CONSOLE_CATEGORIES: ConsoleCategory[] = ['Konsol', 'Gamepad', 'Kulaklik', 'Aksesuar']
