import { useEffect, useState } from 'react'
import {
  acceptAllCookies,
  acceptRequiredOnlyCookies,
  readCookiePreferences,
  type CookiePreferences,
} from '../../lib/cookies'

export default function CookieBanner() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setPreferences(readCookiePreferences())
    setReady(true)
  }, [])

  if (!ready || preferences) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70]">
      <div className="mx-auto max-w-4xl card p-4">
        <h3 className="text-white font-semibold">Cerez Tercihleri</h3>
        <p className="mt-2 text-sm text-gray-300">
          Site deneyimi icin zorunlu cerezleri kullaniriz. Analitik cerezleri istege baglidir.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="btn-primary"
            onClick={() => {
              acceptAllCookies()
              setPreferences(readCookiePreferences())
            }}
          >
            Tumunu Kabul Et
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              acceptRequiredOnlyCookies()
              setPreferences(readCookiePreferences())
            }}
          >
            Sadece Zorunlu
          </button>
        </div>
      </div>
    </div>
  )
}
