import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../../lib/auth'

const platforms = ['pc', 'ps', 'xbox', 'nintendo'] as const
const platformLabels: Record<(typeof platforms)[number], string> = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

interface DropdownItem {
  label: string
  to: string
}

interface NavItem {
  label: string
  items: DropdownItem[]
}

const productMenu: NavItem = {
  label: 'Urunler',
  items: platforms.map((p) => ({ label: platformLabels[p], to: `/products/${p}` })),
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [, setAuthVersion] = useState(0)

  useEffect(() => {
    const onStorage = () => setAuthVersion((value) => value + 1)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const user = getCurrentUser()

  const authBlock = useMemo(() => {
    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <NavLink to="/login" className="btn-ghost text-sm py-1.5 px-3">Login</NavLink>
          <NavLink to="/signup" className="btn-primary text-sm py-1.5 px-3">Sign Up</NavLink>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <NavLink to="/profil" className="btn-ghost text-sm py-1.5 px-3">Profil</NavLink>
        <button
          className="btn-ghost text-sm py-1.5 px-3"
          onClick={() => {
            logoutUser()
            setAuthVersion((value) => value + 1)
          }}
        >
          Cikis
        </button>
      </div>
    )
  }, [user])

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-500">Games</span>
            <span className="text-2xl font-black text-white">News</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu(productMenu.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1">
                {productMenu.label}
                <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMenu === productMenu.label && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1">
                    {productMenu.items.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm transition-colors ${
                            isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`
                        }
                        onClick={() => setOpenMenu(null)}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/games"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Oyunlar
            </NavLink>

            <NavLink
              to="/oduller"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Oduller
            </NavLink>

            <NavLink
              to="/iletisim"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Iletisim
            </NavLink>
          </nav>

          <div className="hidden md:block">{authBlock}</div>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-800 mt-1 pt-3 space-y-1">
            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urunler</p>
            {productMenu.items.map((sub) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-lg mx-1 ${
                    isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {sub.label}
              </NavLink>
            ))}
            <NavLink to="/games" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Oyunlar</NavLink>
            <NavLink to="/oduller" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Oduller</NavLink>
            <NavLink to="/iletisim" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Iletisim</NavLink>
            <div className="px-2 pt-2">{authBlock}</div>
          </nav>
        )}
      </div>
    </header>
  )
}
