import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-blue-500">Games</span>
            <span className="text-xl font-black text-white">News</span>
            <span className="text-gray-500 text-sm ml-2">Turkiye'nin oyun platformu</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link to="/products/pc" className="hover:text-white transition-colors">Urunler</Link>
            <Link to="/games" className="hover:text-white transition-colors">Oyunlar</Link>
            <Link to="/iletisim" className="hover:text-white transition-colors">Iletisim</Link>
          </nav>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} GamesNews</p>
        </div>
      </div>
    </footer>
  )
}
