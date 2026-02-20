import type { PlatformFamily } from './platformTheme'

export type ExclusiveType = 'full' | 'console' | 'timed' | 'platform'

export interface ExclusiveMetadata {
  platform_family?: PlatformFamily
  is_exclusive?: boolean
  exclusive_type?: ExclusiveType
  exclusive_until?: string | null
}

export const exclusiveTypeLabel = {
  full: 'Full Exclusive',
  console: 'Console Exclusive',
  timed: 'Timed Exclusive',
  platform: 'Platform Exclusive',
} as const
