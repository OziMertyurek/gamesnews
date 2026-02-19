import { Link, useLocation } from 'react-router-dom'

const consoleMap: Record<string, { title: string; description: string }> = {
  nintendo: {
    title: 'Nintendo',
    description: 'Nintendo oyunları ve içerikleri burada listelenecek.',
  },
  playstation: {
    title: 'PlayStation',
    description: 'PlayStation oyunları ve içerikleri burada listelenecek.',
  },
  xbox: {
    title: 'Xbox',
    description: 'Xbox oyunları ve içerikleri burada listelenecek.',
  },
}

export default function ConsolePlatformPage() {
  const location = useLocation()
  const slug = location.pathname.split('/').pop() ?? ''
  const current = consoleMap[slug] ?? {
    title: 'Konsollar',
    description: 'Bu alan yakında konsol içerikleri ile doldurulacak.',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-300 transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-gray-300">Konsollar</span>
        <span>/</span>
        <span className="text-blue-300">{current.title}</span>
      </div>

      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">{current.title}</h1>
        <p className="text-gray-400 mt-2">{current.description}</p>
      </section>
    </div>
  )
}
