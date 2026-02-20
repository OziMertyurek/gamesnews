export interface CookiePreferences {
  required: true
  analytics: boolean
  updatedAt: string
}

const COOKIE_PREF_KEY = 'aag_cookie_prefs'

export function setCookie(name: string, value: string, days = 180) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`
}

export function getCookie(name: string) {
  const prefix = `${name}=`
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const entry = part.trim()
    if (entry.startsWith(prefix)) {
      return decodeURIComponent(entry.slice(prefix.length))
    }
  }
  return null
}

export function saveCookiePreferences(preferences: CookiePreferences) {
  setCookie(COOKIE_PREF_KEY, JSON.stringify(preferences), 365)
}

export function readCookiePreferences(): CookiePreferences | null {
  const raw = getCookie(COOKIE_PREF_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>
    return {
      required: true,
      analytics: Boolean(parsed.analytics),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function acceptAllCookies() {
  saveCookiePreferences({
    required: true,
    analytics: true,
    updatedAt: new Date().toISOString(),
  })
}

export function acceptRequiredOnlyCookies() {
  saveCookiePreferences({
    required: true,
    analytics: false,
    updatedAt: new Date().toISOString(),
  })
}
