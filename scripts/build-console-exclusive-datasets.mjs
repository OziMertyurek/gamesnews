import fs from 'node:fs/promises'

const platformSource = {
  playstation: 'https://en.wikipedia.org/wiki/List_of_Sony_Interactive_Entertainment_video_games',
  xbox: 'https://en.wikipedia.org/wiki/List_of_Xbox_Game_Studios_video_games',
  nintendo: 'https://en.wikipedia.org/wiki/List_of_Nintendo_franchises',
}

const datasets = {
  playstation: [
    ['gran-turismo','Gran Turismo','Gran Turismo (1997 video game)',1997,['PS1'],'full'],
    ['ape-escape','Ape Escape','Ape Escape',1999,['PS1'],'full'],
    ['ico','Ico','Ico',2001,['PS2'],'full'],
    ['shadow-of-the-colossus','Shadow of the Colossus','Shadow of the Colossus',2005,['PS2'],'full'],
    ['god-of-war-2005','God of War','God of War (2005 video game)',2005,['PS2'],'full'],
    ['god-of-war-ii','God of War II','God of War II',2007,['PS2'],'full'],
    ['resistance-fall-of-man','Resistance: Fall of Man','Resistance: Fall of Man',2006,['PS3'],'full'],
    ['uncharted-drakes-fortune','Uncharted: Drake\'s Fortune','Uncharted: Drake\'s Fortune',2007,['PS3'],'full'],
    ['littlebigplanet','LittleBigPlanet','LittleBigPlanet (2008 video game)',2008,['PS3'],'full'],
    ['killzone-2','Killzone 2','Killzone 2',2009,['PS3'],'full'],
    ['inFamous-2009'.toLowerCase(),'inFAMOUS','Infamous (2009 video game)',2009,['PS3'],'full'],
    ['demons-souls-2009','Demon\'s Souls','Demon\'s Souls',2009,['PS3'],'full'],
    ['the-last-of-us','The Last of Us','The Last of Us',2013,['PS3','PS4'],'console'],
    ['bloodborne','Bloodborne','Bloodborne',2015,['PS4'],'full'],
    ['until-dawn','Until Dawn','Until Dawn',2015,['PS4','PS5'],'console'],
    ['uncharted-4-a-thiefs-end','Uncharted 4: A Thief\'s End','Uncharted 4: A Thief\'s End',2016,['PS4'],'console'],
    ['the-last-guardian','The Last Guardian','The Last Guardian',2016,['PS4'],'full'],
    ['horizon-zero-dawn','Horizon Zero Dawn','Horizon Zero Dawn',2017,['PS4'],'console'],
    ['marvels-spider-man-2018','Marvel\'s Spider-Man','Spider-Man (2018 video game)',2018,['PS4','PS5'],'console'],
    ['days-gone','Days Gone','Days Gone',2019,['PS4'],'console'],
    ['ghost-of-tsushima','Ghost of Tsushima','Ghost of Tsushima',2020,['PS4','PS5'],'console'],
    ['demons-souls-2020','Demon\'s Souls','Demon\'s Souls (2020 video game)',2020,['PS5'],'full'],
    ['returnal','Returnal','Returnal (video game)',2021,['PS5'],'console'],
    ['ratchet-and-clank-rift-apart','Ratchet & Clank: Rift Apart','Ratchet & Clank: Rift Apart',2021,['PS5'],'console'],
    ['gran-turismo-7','Gran Turismo 7','Gran Turismo 7',2022,['PS4','PS5'],'full'],
    ['horizon-forbidden-west','Horizon Forbidden West','Horizon Forbidden West',2022,['PS4','PS5'],'console'],
    ['helldivers-2','Helldivers 2','Helldivers 2',2024,['PS5'],'console'],
    ['stellar-blade','Stellar Blade','Stellar Blade',2024,['PS5'],'full'],
    ['astro-bot-2024','Astro Bot','Astro Bot',2024,['PS5'],'full'],
    ['sackboy-a-big-adventure','Sackboy: A Big Adventure','Sackboy: A Big Adventure',2020,['PS4','PS5'],'console'],
  ],
  xbox: [
    ['halo-combat-evolved','Halo: Combat Evolved','Halo: Combat Evolved',2001,['Xbox'],'console'],
    ['project-gotham-racing','Project Gotham Racing','Project Gotham Racing',2001,['Xbox'],'full'],
    ['forza-motorsport','Forza Motorsport','Forza Motorsport (2005 video game)',2005,['Xbox'],'console'],
    ['kameo-elements-of-power','Kameo','Kameo',2005,['Xbox 360'],'full'],
    ['perfect-dark-zero','Perfect Dark Zero','Perfect Dark Zero',2005,['Xbox 360'],'full'],
    ['gears-of-war','Gears of War','Gears of War',2006,['Xbox 360'],'console'],
    ['halo-2','Halo 2','Halo 2',2004,['Xbox'],'console'],
    ['halo-3','Halo 3','Halo 3',2007,['Xbox 360'],'console'],
    ['forza-motorsport-2','Forza Motorsport 2','Forza Motorsport 2',2007,['Xbox 360'],'console'],
    ['fable-ii','Fable II','Fable II',2008,['Xbox 360'],'full'],
    ['gears-of-war-2','Gears of War 2','Gears of War 2',2008,['Xbox 360'],'console'],
    ['halo-3-odst','Halo 3: ODST','Halo 3: ODST',2009,['Xbox 360'],'console'],
    ['forza-motorsport-3','Forza Motorsport 3','Forza Motorsport 3',2009,['Xbox 360'],'console'],
    ['fable-iii','Fable III','Fable III',2010,['Xbox 360'],'console'],
    ['halo-reach','Halo: Reach','Halo: Reach',2010,['Xbox 360'],'console'],
    ['forza-motorsport-4','Forza Motorsport 4','Forza Motorsport 4',2011,['Xbox 360'],'console'],
    ['gears-of-war-3','Gears of War 3','Gears of War 3',2011,['Xbox 360'],'console'],
    ['forza-horizon','Forza Horizon','Forza Horizon',2012,['Xbox 360'],'console'],
    ['halo-4','Halo 4','Halo 4',2012,['Xbox 360'],'console'],
    ['sunset-overdrive','Sunset Overdrive','Sunset Overdrive',2014,['Xbox One'],'console'],
    ['forza-horizon-2','Forza Horizon 2','Forza Horizon 2',2014,['Xbox 360','Xbox One'],'console'],
    ['halo-5-guardians','Halo 5: Guardians','Halo 5: Guardians',2015,['Xbox One'],'platform'],
    ['forza-horizon-3','Forza Horizon 3','Forza Horizon 3',2016,['Xbox One'],'console'],
    ['gears-of-war-4','Gears of War 4','Gears of War 4',2016,['Xbox One'],'console'],
    ['forza-motorsport-7','Forza Motorsport 7','Forza Motorsport 7',2017,['Xbox One'],'console'],
    ['sea-of-thieves','Sea of Thieves','Sea of Thieves',2018,['Xbox One','Series X|S'],'console'],
    ['forza-horizon-4','Forza Horizon 4','Forza Horizon 4',2018,['Xbox One','Series X|S'],'console'],
    ['gears-5','Gears 5','Gears 5',2019,['Xbox One','Series X|S'],'console'],
    ['halo-infinite','Halo Infinite','Halo Infinite',2021,['Xbox One','Series X|S'],'console'],
    ['forza-horizon-5','Forza Horizon 5','Forza Horizon 5',2021,['Xbox One','Series X|S'],'console'],
  ],
  nintendo: [
    ['super-mario-bros','Super Mario Bros.','Super Mario Bros.',1985,['NES'],'full'],
    ['the-legend-of-zelda','The Legend of Zelda','The Legend of Zelda (video game)',1986,['NES'],'full'],
    ['metroid','Metroid','Metroid',1986,['NES'],'full'],
    ['super-mario-world','Super Mario World','Super Mario World',1990,['SNES'],'full'],
    ['the-legend-of-zelda-a-link-to-the-past','The Legend of Zelda: A Link to the Past','The Legend of Zelda: A Link to the Past',1991,['SNES'],'full'],
    ['star-fox','Star Fox','Star Fox (1993 video game)',1993,['SNES'],'full'],
    ['super-metroid','Super Metroid','Super Metroid',1994,['SNES'],'full'],
    ['super-mario-64','Super Mario 64','Super Mario 64',1996,['N64'],'full'],
    ['mario-kart-64','Mario Kart 64','Mario Kart 64',1996,['N64'],'full'],
    ['the-legend-of-zelda-ocarina-of-time','The Legend of Zelda: Ocarina of Time','The Legend of Zelda: Ocarina of Time',1998,['N64'],'full'],
    ['super-smash-bros','Super Smash Bros.','Super Smash Bros.',1999,['N64'],'full'],
    ['animal-crossing-2001','Animal Crossing','Animal Crossing (video game)',2001,['GameCube'],'full'],
    ['luigis-mansion','Luigi\'s Mansion','Luigi\'s Mansion',2001,['GameCube'],'full'],
    ['pikmin','Pikmin','Pikmin (video game)',2001,['GameCube'],'full'],
    ['metroid-prime','Metroid Prime','Metroid Prime',2002,['GameCube'],'full'],
    ['the-legend-of-zelda-the-wind-waker','The Legend of Zelda: The Wind Waker','The Legend of Zelda: The Wind Waker',2002,['GameCube'],'full'],
    ['wii-sports','Wii Sports','Wii Sports',2006,['Wii'],'full'],
    ['super-mario-galaxy','Super Mario Galaxy','Super Mario Galaxy',2007,['Wii'],'full'],
    ['mario-kart-wii','Mario Kart Wii','Mario Kart Wii',2008,['Wii'],'full'],
    ['xenoblade-chronicles','Xenoblade Chronicles','Xenoblade Chronicles',2010,['Wii'],'full'],
    ['super-mario-maker','Super Mario Maker','Super Mario Maker',2015,['Wii U'],'platform'],
    ['splatoon','Splatoon','Splatoon',2015,['Wii U'],'platform'],
    ['the-legend-of-zelda-breath-of-the-wild','The Legend of Zelda: Breath of the Wild','The Legend of Zelda: Breath of the Wild',2017,['Wii U','Switch'],'platform'],
    ['super-mario-odyssey','Super Mario Odyssey','Super Mario Odyssey',2017,['Switch'],'full'],
    ['mario-kart-8-deluxe','Mario Kart 8 Deluxe','Mario Kart 8 Deluxe',2017,['Switch'],'platform'],
    ['super-smash-bros-ultimate','Super Smash Bros. Ultimate','Super Smash Bros. Ultimate',2018,['Switch'],'full'],
    ['animal-crossing-new-horizons','Animal Crossing: New Horizons','Animal Crossing: New Horizons',2020,['Switch'],'full'],
    ['metroid-dread','Metroid Dread','Metroid Dread',2021,['Switch'],'full'],
    ['xenoblade-chronicles-3','Xenoblade Chronicles 3','Xenoblade Chronicles 3',2022,['Switch'],'full'],
    ['the-legend-of-zelda-tears-of-the-kingdom','The Legend of Zelda: Tears of the Kingdom','The Legend of Zelda: Tears of the Kingdom',2023,['Switch'],'full'],
  ],
}

async function fetchWiki(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'dataset-builder/1.0' } })
      if (!res.ok) return null
      const data = await res.json()
      const image = data.thumbnail?.source || data.originalimage?.source || null
      const page = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
      return { image, page }
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
  return null
}

function renderConst(name, data) {
  return `export const ${name} = ${JSON.stringify(data, null, 2)} as const\n`
}

const output = {}
const needsReview = []

for (const [family, rows] of Object.entries(datasets)) {
  const result = []
  for (const row of rows) {
    const [slug, title, wikiTitle, release_year, platforms, exclusive_type] = row
    const wiki = await fetchWiki(wikiTitle)
    const image_url = wiki?.image ?? null
    const sources = [wiki?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/ /g, '_'))}`, platformSource[family]]
    const item = {
      slug,
      title,
      release_year,
      platforms,
      platform_family: family,
      is_exclusive: true,
      exclusive_type,
      exclusive_until: null,
      image_url,
      sources,
    }
    result.push(item)
    if (!image_url) {
      needsReview.push({ ...item, reason: 'image_not_found' })
    }
  }
  output[family] = result
}

await fs.writeFile('src/data/consoleExclusivePlaystation.ts', renderConst('consoleExclusivePlaystation', output.playstation))
await fs.writeFile('src/data/consoleExclusiveXbox.ts', renderConst('consoleExclusiveXbox', output.xbox))
await fs.writeFile('src/data/consoleExclusiveNintendo.ts', renderConst('consoleExclusiveNintendo', output.nintendo))
await fs.writeFile('src/data/consoleExclusiveNeedsReview.ts', renderConst('consoleExclusiveNeedsReview', needsReview))

console.log({
  playstation: output.playstation.length,
  xbox: output.xbox.length,
  nintendo: output.nintendo.length,
  needsReview: needsReview.length,
})
