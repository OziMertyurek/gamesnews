import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, listPublicUsers, logoutUser } from '../../lib/auth'
import { games } from '../../data/siteContent'
import { pcProducts } from '../../data/pcProducts'
import { CONSOLE_LABELS, consoleProducts } from '../../data/consoleProducts'

const platforms = ['pc', 'ps', 'xbox', 'nintendo'] as const
const platformLabels: Record<(typeof platforms)[number], string> = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
}

const genreSearchItems = [
  { slug: 'action', label: 'Aksiyon' },
  { slug: 'rpg', label: 'RPG' },
  { slug: 'strategy', label: 'Strateji' },
  { slug: 'sports', label: 'Spor' },
  { slug: 'racing', label: 'Yaris' },
  { slug: 'horror', label: 'Korku' },
  { slug: 'shooter', label: 'Nisanci' },
  { slug: 'puzzle', label: 'Bulmaca' },
]

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
  label: 'Urunler',
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
      return 'Urun'
    default:
      return 'Sonuc'
  }
}

export default function Navbar() {
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authVersion, setAuthVersion] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onStorage = () => setAuthVersion((value) => value + 1)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
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

  const user = getCurrentUser()

  const searchItems = useMemo(() => {
    const profileItems: SearchItem[] = listPublicUsers().map((profile) => ({
      id: `profile-${profile.email}`,
      kind: 'profil',
      title: profile.name,
      subtitle: profile.email,
      to: `/kullanici/${encodeURIComponent(profile.email)}`,
    }))

    const categoryItems: SearchItem[] = genreSearchItems.map((genre) => ({
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
      subtitle: `${game.genre} • ${game.releaseYear}`,
      to: `/games/${game.slug}`,
    }))

    const pcProductItems: SearchItem[] = pcProducts.map((product) => ({
      id: `pc-product-${product.id}`,
      kind: 'urun',
      title: product.name,
      subtitle: `PC • ${product.category}`,
      href: product.link,
    }))

    const consoleProductItems: SearchItem[] = consoleProducts.map((product) => ({
      id: `console-product-${product.id}`,
      kind: 'urun',
      title: product.name,
      subtitle: `${CONSOLE_LABELS[product.platform]} • ${product.category}`,
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
          Cikis
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

        <div className="pb-3" ref={searchRef}>
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
              placeholder="Profil, kategori, oyun veya urun ara..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Sonuc bulunamadi.</p>
                ) : (
                  <ul>
                    {searchResults.map((item) => (
                      <li key={item.id} className="border-b border-gray-800 last:border-none">
                        {item.to ? (
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
                            onClick={() => runSearchTarget(item)}
                          >
                            <p className="text-sm text-white font-medium">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{kindLabel(item.kind)} • {item.subtitle}</p>
                          </button>
                        ) : (
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
                            onClick={() => runSearchTarget(item)}
                          >
                            <p className="text-sm text-white font-medium">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{kindLabel(item.kind)} • {item.subtitle}</p>
                          </button>
                        )}
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
