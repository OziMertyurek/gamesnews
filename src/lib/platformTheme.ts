export type PlatformFamily = 'playstation' | 'xbox' | 'nintendo'
export const platformFamilies: PlatformFamily[] = ['playstation', 'xbox', 'nintendo']

export const isPlatformFamily = (v: unknown): v is PlatformFamily =>
  v === 'playstation' || v === 'xbox' || v === 'nintendo'

export const themeByPlatform = {
  playstation: { pageBg: 'bg-blue-950', accent: 'text-blue-300' },
  xbox: { pageBg: 'bg-green-950', accent: 'text-green-300' },
  nintendo: { pageBg: 'bg-red-800', accent: 'text-red-200' },
} as const
