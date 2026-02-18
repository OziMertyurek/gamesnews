import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PC_CATEGORIES, pcProducts } from '../data/pcProducts'
import { CONSOLE_CATEGORIES, CONSOLE_LABELS, consoleProducts, type ConsoleCategory, type ConsolePlatform, type ConsoleProduct } from '../data/consoleProducts'
import type { PCCategory, PCProduct, PeripheralSubcategory } from '../data/pcProducts'

type SortKey = 'price-asc' | 'price-desc' | 'name-asc' | 'updatedAt-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-asc', label: 'Fiyat: Dusukten Yuksege' },
  { value: 'price-desc', label: 'Fiyat: Yuksekten Dusuge' },
  { value: 'name-asc', label: 'Isim: A-Z' },
  { value: 'updatedAt-desc', label: 'En Son Guncellenen' },
]

const PC_CATEGORY_COLORS: Record<PCCategory, string> = {
  CPU: 'bg-blue-900/60 text-blue-300 border-blue-700',
  GPU: 'bg-purple-900/60 text-purple-300 border-purple-700',
  RAM: 'bg-green-900/60 text-green-300 border-green-700',
  SSD: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
  Monitor: 'bg-pink-900/60 text-pink-300 border-pink-700',
  'Cevre Birimi': 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
}

const CONSOLE_CATEGORY_COLORS: Record<ConsoleCategory, string> = {
  Konsol: 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  Gamepad: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
  Kulaklik: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  Aksesuar: 'bg-amber-900/60 text-amber-300 border-amber-700',
}

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="140" y="90" width="320" height="220" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="4"/><circle cx="215" cy="170" r="26" fill="%23334155"/><path d="M190 270l74-70 46 42 44-32 56 60H190z" fill="%23334155"/></svg>'

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-950 border border-blue-800 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors" aria-label="Kaldir">
        x
      </button>
    </span>
  )
}

function PCProductCard({ product }: { product: PCProduct }) {
  return (
    <div className="card flex flex-col group hover:border-blue-700 transition-colors duration-200">
      <div className="relative overflow-hidden bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <span className={`badge border self-start ${PC_CATEGORY_COLORS[product.category]}`}>{product.category}</span>
        {product.peripheralSubcategory && <span className="badge border self-start bg-indigo-900/60 text-indigo-300 border-indigo-700">{product.peripheralSubcategory}</span>}
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{product.specs}</p>

        <div className="mt-auto pt-3 border-t border-gray-800 flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-bold text-white">
              {product.price.toLocaleString('tr-TR')}
              <span className="text-base font-normal text-gray-400 ml-1">TL</span>
            </p>
            <p className="text-xs text-gray-500">Aralik: {product.priceMin.toLocaleString('tr-TR')} - {product.priceMax.toLocaleString('tr-TR')} TL</p>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm shrink-0">
            Kaynaga git
          </a>
        </div>

        <p className="text-[11px] text-gray-600">Kaynak sayisi: {product.sourceOfferCount} satici</p>
      </div>
    </div>
  )
}

function ConsoleProductCard({ product }: { product: ConsoleProduct }) {
  const avg = Math.round((product.priceMin + product.priceMax) / 2)
  return (
    <div className="card flex flex-col group hover:border-blue-700 transition-colors duration-200">
      <div className="relative overflow-hidden bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <span className={`badge border self-start ${CONSOLE_CATEGORY_COLORS[product.category]}`}>{product.category}</span>
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{product.specs}</p>

        <div className="mt-auto pt-3 border-t border-gray-800 flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-bold text-white">
              {avg.toLocaleString('tr-TR')}
              <span className="text-base font-normal text-gray-400 ml-1">TL</span>
            </p>
            <p className="text-xs text-gray-500">Aralik: {product.priceMin.toLocaleString('tr-TR')} - {product.priceMax.toLocaleString('tr-TR')} TL</p>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm shrink-0">
            Magazaya git
          </a>
        </div>
      </div>
    </div>
  )
}

function PCProductsView() {
  const [selectedCategories, setSelectedCategories] = useState<PCCategory[]>([])
  const [selectedPeripheralTypes, setSelectedPeripheralTypes] = useState<PeripheralSubcategory[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')
  const [search, setSearch] = useState('')
  const peripheralTypes: PeripheralSubcategory[] = ['Klavye', 'Mouse', 'Kulaklik']
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const allStores = useMemo(() => [...new Set(pcProducts.map((p) => p.store))].sort(), [])
  const allBrands = useMemo(() => [...new Set(pcProducts.map((p) => p.brand))].sort(), [])

  const toggleFilter = <T,>(arr: T[], setter: (v: T[]) => void, value: T) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  const filtered = useMemo(() => {
    let result = [...pcProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.peripheralSubcategory?.toLowerCase().includes(q) ?? false),
      )
    }

    if (selectedCategories.length) result = result.filter((p) => selectedCategories.includes(p.category))
    if (selectedPeripheralTypes.length) {
      result = result.filter((p) => p.peripheralSubcategory && selectedPeripheralTypes.includes(p.peripheralSubcategory))
    }
    if (selectedStores.length) result = result.filter((p) => selectedStores.includes(p.store))
    if (selectedBrands.length) result = result.filter((p) => selectedBrands.includes(p.brand))
    if (inStockOnly) result = result.filter((p) => p.inStock)
    if (priceMin !== '') result = result.filter((p) => p.price >= Number(priceMin))
    if (priceMax !== '') result = result.filter((p) => p.price <= Number(priceMax))

    switch (sortKey) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        break
      case 'updatedAt-desc':
        result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        break
    }

    return result
  }, [search, selectedCategories, selectedPeripheralTypes, selectedStores, selectedBrands, inStockOnly, sortKey, priceMin, priceMax])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPeripheralTypes([])
    setSelectedStores([])
    setSelectedBrands([])
    setInStockOnly(false)
    setPriceMin('')
    setPriceMax('')
    setSearch('')
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedPeripheralTypes.length > 0 || selectedStores.length > 0 || selectedBrands.length > 0 || inStockOnly || priceMin !== '' || priceMax !== '' || search.trim() !== ''

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link to="/" className="hover:text-gray-300 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-300">PC Urunleri</span>
        </div>
        <h1 className="text-3xl font-bold text-white">PC Urunleri</h1>
        <p className="text-gray-400 mt-1">Yuksek performans bilesenleri ve ortalama fiyat araliklari.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0 space-y-5">
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Ara</h2>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Urun ara..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Kategori</h2>
            <div className="space-y-2">
              {PC_CATEGORIES.map((cat) => {
                const count = pcProducts.filter((p) => p.category === cat).length
                const active = selectedCategories.includes(cat)
                return (
                  <label key={cat} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={active} onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                      <span className={`text-sm transition-colors ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{cat}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{count}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Cevre Birimi Alt Kategori</h2>
            <div className="space-y-2">
              {peripheralTypes.map((type) => {
                const count = pcProducts.filter((p) => p.category === 'Cevre Birimi' && p.peripheralSubcategory === type).length
                const active = selectedPeripheralTypes.includes(type)
                return (
                  <label key={type} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={active} onChange={() => toggleFilter(selectedPeripheralTypes, setSelectedPeripheralTypes, type)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                      <span className={`text-sm transition-colors ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{type}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{count}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Fiyat (TL)</h2>
            <div className="flex gap-2">
              <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Magaza</h2>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {allStores.map((store) => {
                const active = selectedStores.includes(store)
                return (
                  <label key={store} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={active} onChange={() => toggleFilter(selectedStores, setSelectedStores, store)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    <span className={`text-sm transition-colors ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{store}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Marka</h2>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {allBrands.map((brand) => {
                const active = selectedBrands.includes(brand)
                return (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={active} onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    <span className={`text-sm transition-colors ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{brand}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
              <span className="text-sm text-gray-300">Sadece stokta olanlar</span>
            </label>
          </div>

          {hasActiveFilters && <button onClick={clearFilters} className="btn-ghost w-full justify-center text-sm">Filtreleri Temizle</button>}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <p className="text-sm text-gray-400"><span className="text-white font-semibold">{filtered.length}</span> urun bulundu</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Sirala:</label>
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && <FilterChip label={`"${search}"`} onRemove={() => setSearch('')} />}
              {selectedCategories.map((cat) => <FilterChip key={cat} label={cat} onRemove={() => toggleFilter(selectedCategories, setSelectedCategories, cat)} />)}
              {selectedPeripheralTypes.map((type) => <FilterChip key={type} label={type} onRemove={() => toggleFilter(selectedPeripheralTypes, setSelectedPeripheralTypes, type)} />)}
              {selectedStores.map((store) => <FilterChip key={store} label={store} onRemove={() => toggleFilter(selectedStores, setSelectedStores, store)} />)}
              {selectedBrands.map((brand) => <FilterChip key={brand} label={brand} onRemove={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} />)}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-400 font-medium">Urun bulunamadi</p>
              <button onClick={clearFilters} className="btn-primary mt-4 mx-auto">Filtreleri Temizle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((product) => <PCProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConsoleProductsView({ platform }: { platform: ConsolePlatform }) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<ConsoleCategory[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')

  const label = CONSOLE_LABELS[platform]

  const toggleCategory = (category: ConsoleCategory) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const filtered = useMemo(() => {
    const base = consoleProducts.filter((p) => p.platform === platform)
    let result = [...base]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }

    if (selectedCategories.length > 0) result = result.filter((p) => selectedCategories.includes(p.category))
    if (inStockOnly) result = result.filter((p) => p.inStock)

    switch (sortKey) {
      case 'price-asc':
        result.sort((a, b) => a.priceMin - b.priceMin)
        break
      case 'price-desc':
        result.sort((a, b) => b.priceMax - a.priceMax)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        break
      case 'updatedAt-desc':
        result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        break
    }

    return result
  }, [platform, search, selectedCategories, inStockOnly, sortKey])

  const hasFilters = search.trim() !== '' || selectedCategories.length > 0 || inStockOnly

  const clear = () => {
    setSearch('')
    setSelectedCategories([])
    setInStockOnly(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link to="/" className="hover:text-gray-300 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-300">{label} Urunleri</span>
        </div>
        <h1 className="text-3xl font-bold text-white">{label} Urunleri</h1>
        <p className="text-gray-400 mt-2">Bu sayfada sadece konsol urunleri, gamepad, kulaklik ve aksesuarlar yer alir. Oyun listesi yoktur.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="card p-4 space-y-4 lg:col-span-1">
          <div>
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Ara</h2>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`${label} urunu ara...`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Kategori</h2>
            <div className="space-y-2">
              {CONSOLE_CATEGORIES.map((cat) => {
                const count = consoleProducts.filter((p) => p.platform === platform && p.category === cat).length
                return (
                  <label key={cat} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="w-4 h-4 rounded accent-blue-500" />
                      <span className="text-sm text-gray-300">{cat}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{count}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-gray-300">Sadece stokta olanlar</span>
          </label>

          <div>
            <label className="text-xs text-gray-500">Sirala:</label>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
              {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {hasFilters && <button onClick={clear} className="btn-ghost w-full justify-center text-sm">Filtreleri Temizle</button>}
        </aside>

        <div className="lg:col-span-3">
          <p className="text-sm text-gray-400 mb-4"><span className="text-white font-semibold">{filtered.length}</span> urun bulundu</p>
          {filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-gray-400">Sonuca uygun urun bulunamadi.</p>
              <button onClick={clear} className="btn-primary mt-4">Temizle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => <ConsoleProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { platform } = useParams<{ platform: string }>()
  if (platform === 'pc') return <PCProductsView />
  if (platform === 'ps' || platform === 'xbox' || platform === 'nintendo') return <ConsoleProductsView platform={platform} />

  return (
    <div className="card p-10 text-center">
      <h1 className="text-2xl font-bold text-white">Platform bulunamadi</h1>
      <p className="text-gray-400 mt-2">Lutfen gecerli bir urun platformu sec.</p>
      <Link to="/" className="btn-primary mt-4">Ana Sayfaya Don</Link>
    </div>
  )
}
