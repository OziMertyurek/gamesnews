import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function SideAdSlot({ title, side }: { title: string; side: 'left' | 'right' }) {
  return (
    <aside className={`hidden 2xl:block fixed z-40 w-40 ${side === 'left' ? 'left-6' : 'right-6'}`} style={{ top: 'var(--header-offset, 96px)' }}>
      <div className="card p-4 border-dashed border-blue-700/60 bg-blue-950/20 min-h-[520px]">
        <p className="text-[11px] text-blue-300 uppercase tracking-wider">Reklam Alanı</p>
        <h3 className="text-white font-semibold mt-2">{title}</h3>
        <p className="text-xs text-gray-400 mt-2">Dikey reklam görünümü (300x600)</p>
        <p className="text-xs text-blue-300 mt-4">Buraya reklam vermek için iletişime geçin.</p>
      </div>
    </aside>
  )
}

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SideAdSlot title="Sol Dikey Reklam" side="left" />
      <SideAdSlot title="Sağ Dikey Reklam" side="right" />
      <main className="flex-1 px-4 py-8">
        <div className="min-w-0 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
