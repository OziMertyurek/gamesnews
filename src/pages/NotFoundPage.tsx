import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <p className="text-8xl font-black text-gray-800 mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadı</h1>
      <p className="text-gray-400 mb-8">Aradığınız sayfa mevcut değil.</p>
      <Link to="/" className="btn-primary inline-flex">Ana Sayfaya Dön</Link>
    </div>
  )
}
