import { useParams } from 'react-router-dom'

const PLATFORM_LABELS = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
} as const

type PlatformKey = keyof typeof PLATFORM_LABELS

function isPlatform(value: string | undefined): value is PlatformKey {
  return value === 'pc' || value === 'ps' || value === 'xbox' || value === 'nintendo'
}

export default function ProductsPage() {
  const { platform } = useParams<{ platform: string }>()

  if (!isPlatform(platform)) {
    return (
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Gecersiz Sayfa</h1>
          <p className="text-gray-400 mt-2">Bu bolum bulunamadi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-10">
      <section className="card p-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">{PLATFORM_LABELS[platform]}</h1>
        <p className="text-gray-300 mt-3">Bu sayfadaki eski satis icerikleri kaldirildi.</p>
        <p className="text-gray-400 mt-2">Yakinda yeni icerik eklenecek.</p>
      </section>
    </div>
  )
}
