import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, listPublicUsers, logoutUser } from '../../lib/auth'
import { gameGenres, games } from '../../data/siteContent'
import { pcProducts } from '../../data/pcProducts'
import { CONSOLE_LABELS, consoleProducts } from '../../data/consoleProducts'

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

type SearchKind = 'profil' | 'kategori' | 'oyun' | 'urun'

interface SearchItem {
  id: string
  kind: SearchKind
  title: string
  subtitle: string
  to?: string
  href?: string
}

const productMenu: NavItem = {
  label: 'Ürünler',
  items: platforms.map((p) => ({ label: platformLabels[p], to: `/products/${p}` })),
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
}

function kindLabel(kind: SearchKind) {
  switch (kind) {
    case 'profil':
      return 'Profil'
    case 'kategori':
      return 'Kategori'
    case 'oyun':
      return 'Oyun'
    case 'urun':
      return 'Ürün'
    default:
      return 'Sonuç'
  }
}

export default function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const lastScrollYRef = useRef(0)
  const lastToggleYRef = useRef(0)
  const lastToggleAtRef = useRef(0)
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authVersion, setAuthVersion] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  useEffect(() => {
    const onStorage = () => setAuthVersion((value) => value + 1)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const setHeaderOffset = () => {
      const height = header.offsetHeight || 96
      document.documentElement.style.setProperty('--header-offset', `${height + 12}px`)
    }

    setHeaderOffset()
    const observer = new ResizeObserver(setHeaderOffset)
    observer.observe(header)
    window.addEventListener('resize', setHeaderOffset)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', setHeaderOffset)
    }
  }, [])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!searchRef.current) return
      if (event.target instanceof Node && searchRef.current.contains(event.target)) return
      setSearchOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    lastToggleYRef.current = window.scrollY

    const onScroll = () => {
      const current = window.scrollY
      const delta = current - lastScrollYRef.current
      const scrollingDown = delta > 2
      const scrollingUp = delta < -2
      const now = performance.now()

      if (current < 20) {
        setSearchCollapsed(false)
      } else if (!searchOpen && !mobileOpen) {
        // Header height degisimi anlik scroll farki uretebildigi icin
        // ac/kapa kararini esik ve kisa kilit suresi ile stabilize et.
        const sinceLastToggle = now - lastToggleAtRef.current
        const movedFromToggle = current - lastToggleYRef.current

        if (!searchCollapsed && scrollingDown && current > 120 && movedFromToggle > 16 && sinceLastToggle > 220) {
          setSearchCollapsed(true)
          lastToggleYRef.current = current
          lastToggleAtRef.current = now
        } else if (searchCollapsed && scrollingUp && movedFromToggle < -10 && sinceLastToggle > 180) {
          setSearchCollapsed(false)
          lastToggleYRef.current = current
          lastToggleAtRef.current = now
        }
      }

      lastScrollYRef.current = current
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen, searchOpen, searchCollapsed])

  const user = getCurrentUser()

  const searchItems = useMemo(() => {
    void authVersion

    const profileItems: SearchItem[] = listPublicUsers().map((profile) => ({
      id: `profile-${profile.email}`,
      kind: 'profil',
      title: profile.name,
      subtitle: profile.email,
      to: `/kullanici/${encodeURIComponent(profile.email)}`,
    }))

    const categoryItems: SearchItem[] = gameGenres.map((genre) => ({
      id: `genre-${genre.slug}`,
      kind: 'kategori',
      title: genre.label,
      subtitle: 'Oyun Kategorisi',
      to: `/games/genres/${genre.slug}`,
    }))

    const gameItems: SearchItem[] = games.map((game) => ({
      id: `game-${game.slug}`,
      kind: 'oyun',
      title: game.title,
      subtitle: `${game.genre} - ${game.releaseYear}`,
      to: `/games/${game.slug}`,
    }))

    const pcProductItems: SearchItem[] = pcProducts.map((product) => ({
      id: `pc-product-${product.id}`,
      kind: 'urun',
      title: product.name,
      subtitle: `PC - ${product.category}`,
      href: product.link,
    }))

    const consoleProductItems: SearchItem[] = consoleProducts.map((product) => ({
      id: `console-product-${product.id}`,
      kind: 'urun',
      title: product.name,
      subtitle: `${CONSOLE_LABELS[product.platform]} - ${product.category}`,
      href: product.link,
    }))

    return [...profileItems, ...categoryItems, ...gameItems, ...pcProductItems, ...consoleProductItems]
  }, [authVersion])

  const searchResults = useMemo(() => {
    const q = normalize(searchQuery.trim())
    if (q.length < 2) return []

    return searchItems
      .map((item) => {
        const title = normalize(item.title)
        const subtitle = normalize(item.subtitle)
        if (!title.includes(q) && !subtitle.includes(q)) return null

        let score = 0
        if (title.startsWith(q)) score += 40
        if (title.includes(q)) score += 20
        if (subtitle.includes(q)) score += 8
        if (item.kind === 'profil') score += 6
        if (item.kind === 'oyun') score += 4

        return { item, score }
      })
      .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => entry.item)
  }, [searchItems, searchQuery])

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
          Çıkış
        </button>
      </div>
    )
  }, [user])

  function runSearchTarget(item: SearchItem) {
    if (item.to) navigate(item.to)
    if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
    setSearchOpen(false)
    setSearchQuery('')
    setMobileOpen(false)
  }

  return (
    <header ref={headerRef} className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-500">AllAroundGame</span>
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
              Ödüller
            </NavLink>

            <NavLink
              to="/iletisim"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              İletişim
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

        <div
          ref={searchRef}
          className={`overflow-hidden transition-all duration-300 ease-out ${
            searchCollapsed
              ? 'max-h-0 pb-0 opacity-0 -translate-y-1 pointer-events-none overflow-hidden'
              : 'max-h-24 pb-3 opacity-100 translate-y-0 overflow-visible'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setSearchOpen(true)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchResults[0]) {
                  event.preventDefault()
                  runSearchTarget(searchResults[0])
                }
              }}
              placeholder="Profil, kategori, oyun veya ürün ara..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Sonuç bulunamadı.</p>
                ) : (
                  <ul>
                    {searchResults.map((item) => (
                      <li key={item.id} className="border-b border-gray-800 last:border-none">
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
                          onClick={() => runSearchTarget(item)}
                        >
                          <p className="text-sm text-white font-medium">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{kindLabel(item.kind)} - {item.subtitle}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-800 mt-1 pt-3 space-y-1">
            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürünler</p>
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
            <NavLink to="/oduller" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Ödüller</NavLink>
            <NavLink to="/iletisim" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>İletişim</NavLink>
            <div className="px-2 pt-2">{authBlock}</div>
          </nav>
        )}
      </div>
    </header>
  )
}
