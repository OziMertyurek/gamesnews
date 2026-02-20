import { gameExternalData } from '../data/gameExternalData'
import type { GameItem, Platform } from '../data/siteContent'
import {
  allConsoleExclusiveGames,
  type ConsoleExclusiveGame,
} from './consoleExclusives'

const platformByFamily: Record<ConsoleExclusiveGame['platform_family'], Platform> = {
  playstation: 'ps',
  xbox: 'xbox',
  nintendo: 'nintendo',
}

const storeByFamily: Record<ConsoleExclusiveGame['platform_family'], { name: string; makeUrl: (title: string) => string; icon: string }> = {
  playstation: {
    name: 'PlayStation Store',
    makeUrl: (title) => `https://store.playstation.com/en-us/search/${encodeURIComponent(title)}`,
    icon: 'PS',
  },
  xbox: {
    name: 'Xbox Store',
    makeUrl: (title) => `https://www.xbox.com/en-US/Search/Results?q=${encodeURIComponent(title)}`,
    icon: 'XB',
  },
  nintendo: {
    name: 'Nintendo eShop',
    makeUrl: (title) => `https://www.nintendo.com/us/search/#q=${encodeURIComponent(title)}&p=1&cat=gme&sort=df`,
    icon: 'NS',
  },
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveExternal(slug: string, title: string) {
  const direct = gameExternalData[slug]
  if (direct) return direct

  const titleSlug = normalize(title)
  const byTitleSlug = gameExternalData[titleSlug]
  if (byTitleSlug) return byTitleSlug

  return null
}

export function findConsoleGameBySlug(slug: string) {
  return allConsoleExclusiveGames.find((item) => item.slug === slug) ?? null
}

export function mapConsoleGameToDetail(item: ConsoleExclusiveGame): GameItem {
  const external = resolveExternal(item.slug, item.title)
  const metacriticUrl = external?.metacriticUrl || `https://www.metacritic.com/search/${encodeURIComponent(item.title)}/?page=1&category=13`
  const howLongToBeatUrl = external?.howLongToBeatUrl || `https://howlongtobeat.com/?q=${encodeURIComponent(item.title)}`
  const gamespotArticleUrl = external?.gamespotArticleUrl || `https://www.gamespot.com/search/?q=${encodeURIComponent(item.title)}`
  const storeInfo = storeByFamily[item.platform_family]

  return {
    slug: item.slug,
    title: item.title,
    genre: 'exclusive',
    platforms: [platformByFamily[item.platform_family]],
    releaseYear: item.release_year,
    score: external?.metacriticScore ? Number((external.metacriticScore / 10).toFixed(1)) : 0,
    summary: `${item.title}, ${storeInfo.name} tarafinda yayinlanan console exclusive katalog oyunlarindan biridir.`,
    metacriticScore: external?.metacriticScore ?? null,
    howLongToBeatMainHours: external?.howLongToBeatMainHours ?? null,
    howLongToBeatMainExtraHours: external?.howLongToBeatMainExtraHours ?? null,
    howLongToBeatCompletionistHours: external?.howLongToBeatCompletionistHours ?? null,
    metacriticUrl,
    howLongToBeatUrl,
    gamespotArticleUrl,
    youtubeTrailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.title} trailer`)}`,
    youtubeGameplayUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.title} gameplay`)}`,
    platform_family: item.platform_family,
    is_exclusive: true,
    exclusive_type: item.exclusive_type,
    exclusive_until: item.exclusive_until,
    store_links: [
      {
        label: storeInfo.name,
        url: storeInfo.makeUrl(item.title),
        details: item.platforms,
        icon: storeInfo.icon,
      },
    ],
    source_urls: item.sources,
    image_url: item.image_url,
  }
}
