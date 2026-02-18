import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <p className="text-8xl font-black text-gray-800 mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadi</h1>
      <p className="text-gray-400 mb-8">Aradiginiz sayfa mevcut degil.</p>
      <Link to="/" className="btn-primary inline-flex">Ana Sayfaya Don</Link>
    </div>
  )
}
