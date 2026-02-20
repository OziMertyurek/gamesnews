export function toFriendlyAuthError(message?: string) {
  const raw = String(message ?? '').trim()
  const m = raw.toLowerCase()

  if (!m) return 'Islem basarisiz. Lutfen tekrar dene.'
  if (m.includes('email rate limit exceeded')) return 'Cok fazla deneme yapildi. Lutfen biraz sonra tekrar dene.'
  if (m.includes('invalid login credentials')) return 'E-posta veya sifre hatali.'
  if (m.includes('email not confirmed')) return 'E-posta adresini dogrulaman gerekiyor.'
  if (m.includes('user already registered')) return 'Bu e-posta zaten kayitli.'
  if (m.includes('password should be at least')) return 'Sifre en az 6 karakter olmali.'
  if (m.includes('too many requests')) return 'Cok fazla istek gonderildi. Biraz bekleyip tekrar dene.'
  if (m.includes('network') || m.includes('failed to fetch')) return 'Baglanti sorunu. Internetini kontrol edip tekrar dene.'
  return raw
}
