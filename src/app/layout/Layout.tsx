import { Link, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { getCurrentAdmin } from '../../lib/auth'

function SideAdSlot({ title, side }: { title: string; side: 'left' | 'right' }) {
  return (
    <aside className={`hidden 2xl:block fixed z-40 w-40 ${side === 'left' ? 'left-6' : 'right-6'}`} style={{ top: 'var(--header-offset, 96px)' }}>
      <div className="card p-4 border-dashed border-blue-700/60 bg-blue-950/20 min-h-[520px]">
        <p className="text-[11px] text-blue-300 uppercase tracking-wider">Reklam Alani</p>
        <h3 className="text-white font-semibold mt-2">{title}</h3>
        <p className="text-xs text-gray-400 mt-2">Dikey reklam gorunumu (300x600)</p>
        <p className="text-xs text-blue-300 mt-4">Buraya reklam vermek icin iletisime gecin.</p>
      </div>
    </aside>
  )
}

export default function Layout() {
  const admin = getCurrentAdmin()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {admin && (
        <div className="px-4 pt-3">
          <div className="min-w-0 max-w-7xl w-full mx-auto">
            <Link to="/admin" className="btn-ghost text-amber-200 border-amber-700/50 hover:bg-amber-900/30">
              Yonetici Paneli
            </Link>
          </div>
        </div>
      )}
      <SideAdSlot title="Sol Dikey Reklam" side="left" />
      <SideAdSlot title="Sag Dikey Reklam" side="right" />
      <main className="flex-1 px-4 py-8">
        <div className="min-w-0 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
