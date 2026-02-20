import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser, searchPublicProfiles } from '../../lib/auth'

type SearchKind = 'profil' | 'kategori' | 'oyun'

interface SearchItem {
  id: string
  kind: SearchKind
  title: string
  subtitle: string
  to?: string
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
    default:
      return 'Sonuç'
  }
}

export default function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchCatalogLoadingRef = useRef(false)
  const lastScrollYRef = useRef(0)
  const lastToggleYRef = useRef(0)
  const lastToggleAtRef = useRef(0)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authVersion, setAuthVersion] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchCollapsed, setSearchCollapsed] = useState(false)
  const [catalogSearchItems, setCatalogSearchItems] = useState<SearchItem[]>([])
  const [profileSearchItems, setProfileSearchItems] = useState<SearchItem[]>([])
  const [consolesOpen, setConsolesOpen] = useState(false)
  const consolesActive = location.pathname.startsWith('/konsollar/') || location.pathname.startsWith('/consoles/')

  const loadCatalogSearchItems = useCallback(async () => {
    if (searchCatalogLoadingRef.current || catalogSearchItems.length > 0) return
    searchCatalogLoadingRef.current = true

    try {
      const [{ gameGenres, games }, { dedupeGamesByTitle, filterGenresWithGames }] = await Promise.all([
        import('../../data/siteContent'),
        import('../../lib/gameCatalog'),
      ])

      const nonEmptyGenres = filterGenresWithGames(gameGenres, games)
      const categoryItems: SearchItem[] = nonEmptyGenres.map((genre) => ({
        id: `genre-${genre.slug}`,
        kind: 'kategori',
        title: genre.label,
        subtitle: 'Oyun Kategorisi',
        to: `/games/genres/${genre.slug}`,
      }))

      const gameItems: SearchItem[] = dedupeGamesByTitle(games).map((game) => ({
        id: `game-${game.slug}`,
        kind: 'oyun',
        title: game.title,
        subtitle: `${game.genre} - ${game.releaseYear}`,
        to: `/games/${game.slug}`,
      }))

      setCatalogSearchItems([...categoryItems, ...gameItems])
    } finally {
      searchCatalogLoadingRef.current = false
    }
  }, [catalogSearchItems.length])

  const loadProfileSearchItems = useCallback(async (query: string) => {
    const rows = await searchPublicProfiles(query)
    setProfileSearchItems(rows.map((profile) => ({
      id: `profile-${profile.id}`,
      kind: 'profil',
      title: profile.name,
      subtitle: 'Kullanici Profili',
      to: `/kullanici/id/${encodeURIComponent(profile.id)}`,
    })))
  }, [])

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
    return [...profileSearchItems, ...catalogSearchItems]
  }, [catalogSearchItems, profileSearchItems, authVersion])

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
        if (item.kind === 'profil') score += 10
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
          onClick={async () => {
            await logoutUser()
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
    setSearchOpen(false)
    setSearchQuery('')
    setMobileOpen(false)
  }

  return (
    <header ref={headerRef} className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 relative">
        <Link to="/" className="hidden md:flex absolute left-4 top-0 h-full w-52 items-center justify-center z-10" aria-label="AllAroundGame">
          <img
            src="/site-logo.png"
            alt="AllAroundGame"
            className="h-full w-full object-contain p-2"
            loading="eager"
            decoding="async"
          />
        </Link>

        <div className="flex items-center justify-between h-20 md:pl-52">
          <Link to="/" className="flex items-center gap-2 md:hidden" aria-label="AllAroundGame">
            <img
              src="/site-logo.png"
              alt="AllAroundGame"
              className="h-12 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
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

            <div
              className="relative"
              onMouseEnter={() => setConsolesOpen(true)}
              onMouseLeave={() => setConsolesOpen(false)}
            >
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  consolesActive ? 'text-blue-400 bg-blue-950' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                type="button"
                onClick={() => setConsolesOpen((value) => !value)}
                aria-expanded={consolesOpen}
                aria-haspopup="menu"
              >
                Konsollar
              </button>
              <div
                className={`absolute left-0 top-full z-[70] min-w-[180px] rounded-lg border border-gray-700 bg-gray-900 shadow-xl transition-all duration-150 ${
                  consolesOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1'
                }`}
              >
                <NavLink to="/consoles/nintendo" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-t-lg" onClick={() => setConsolesOpen(false)}>Nintendo</NavLink>
                <NavLink to="/consoles/xbox" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setConsolesOpen(false)}>Xbox</NavLink>
                <NavLink to="/consoles/playstation" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-b-lg" onClick={() => setConsolesOpen(false)}>PlayStation</NavLink>
              </div>
            </div>

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
          className={`md:pl-52 overflow-hidden transition-all duration-300 ease-out ${
            searchCollapsed
              ? 'max-h-0 pb-0 opacity-0 -translate-y-1 pointer-events-none overflow-hidden'
              : 'max-h-24 pb-3 opacity-100 translate-y-0 overflow-visible'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                setSearchOpen(true)
                void loadCatalogSearchItems()
              }}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setSearchOpen(true)
                if (event.target.value.trim().length > 0) {
                  void loadCatalogSearchItems()
                  void loadProfileSearchItems(event.target.value)
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchResults[0]) {
                  event.preventDefault()
                  runSearchTarget(searchResults[0])
                }
              }}
              placeholder="Profil, kategori veya oyun ara..."
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
            <NavLink to="/games" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Oyunlar</NavLink>
            <div className="px-4 pt-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Konsollar</p>
              <NavLink to="/consoles/nintendo" className="block px-2 py-1.5 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Nintendo</NavLink>
              <NavLink to="/consoles/xbox" className="block px-2 py-1.5 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Xbox</NavLink>
              <NavLink to="/consoles/playstation" className="block px-2 py-1.5 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>PlayStation</NavLink>
            </div>
            <NavLink to="/oduller" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Ödüller</NavLink>
            <NavLink to="/iletisim" className="block px-4 py-2 text-sm rounded-lg mx-1 text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>İletişim</NavLink>
            <div className="px-2 pt-2">{authBlock}</div>
          </nav>
        )}
      </div>
    </header>
  )
}
