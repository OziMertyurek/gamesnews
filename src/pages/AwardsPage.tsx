import { useMemo, useState } from 'react'
import { tgaCurrentAwardsYear, tgaCurrentCategoryAwards, tgaYearRecords } from '../data/tgaAwards'
import { getAwardedGamesLeaderboard } from '../lib/awards'

const availableYears = [...tgaYearRecords].sort((a, b) => b.year - a.year).map((year) => year.year)

export default function AwardsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] ?? new Date().getFullYear())
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(tgaCurrentCategoryAwards[0]?.slug ?? '')

  const yearData = tgaYearRecords.find((item) => item.year === selectedYear) ?? tgaYearRecords[0]
  const selectedCategory = tgaCurrentCategoryAwards.find((item) => item.slug === selectedCategorySlug) ?? tgaCurrentCategoryAwards[0]
  const leaderboard = useMemo(() => getAwardedGamesLeaderboard(10), [])
  const maxWins = leaderboard[0]?.wins ?? 1

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">The Game Awards Arşivi</h1>
        <p className="text-gray-400 mt-2">2018'den günümüze kazananlar ve kategori bazlı adaylar.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {availableYears.map((year) => (
            <button
              key={year}
              className={year === selectedYear ? 'btn-primary text-sm py-1.5 px-3' : 'btn-ghost text-sm py-1.5 px-3'}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {yearData && (
        <section className="card p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Game of the Year</p>
              <p className="text-2xl font-semibold text-white mt-2">{yearData.gameOfTheYear.winner ?? 'Veri yok'}</p>
              <p className="text-xs text-gray-500 mt-3">Adaylar</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {yearData.gameOfTheYear.nominees.map((nominee) => (
                  <span key={`${yearData.year}-${nominee}`} className="badge bg-blue-950 text-blue-200">
                    {nominee}
                  </span>
                ))}
                {yearData.gameOfTheYear.nominees.length === 0 && <span className="text-sm text-gray-400">Aday verisi yok</span>}
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Kaynak</p>
              <a href={yearData.source} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 text-sm mt-2 inline-block">
                {yearData.source}
              </a>
              <p className="text-gray-400 text-sm mt-4">Kategori kazananları: {yearData.categoryWinners.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Kategori</th>
                  <th className="py-2 pr-4">Kazanan</th>
                  <th className="py-2 pr-4">Stüdyo/Not</th>
                </tr>
              </thead>
              <tbody>
                {yearData.categoryWinners.map((row) => (
                  <tr key={`${yearData.year}-${row.category}-${row.game}`} className="border-b border-gray-800">
                    <td className="py-2 pr-4 text-gray-200">{row.category}</td>
                    <td className="py-2 pr-4 text-white font-medium">{row.game}</td>
                    <td className="py-2 pr-4 text-gray-400">{row.studio ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-white">{tgaCurrentAwardsYear} Kategori Adayları</h2>
          <p className="text-sm text-gray-400">Kategori seç, kazanan ve aday listesini gör.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {tgaCurrentCategoryAwards.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategorySlug(category.slug)}
              className={selectedCategory?.slug === category.slug ? 'btn-primary text-xs py-2 px-2 justify-center' : 'btn-ghost text-xs py-2 px-2 justify-center'}
            >
              {category.category}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Seçili kategori</p>
            <h3 className="text-lg font-semibold text-white mt-2">{selectedCategory.category}</h3>
            <p className="text-sm text-gray-400 mt-2">Kazanan</p>
            <p className="text-white font-medium">{selectedCategory.winner ?? 'Veri yok'}</p>
            <p className="text-sm text-gray-400 mt-3">Adaylar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategory.nominees.length > 0 ? selectedCategory.nominees.map((nominee) => (
                <span key={`${selectedCategory.slug}-${nominee}`} className="badge bg-blue-950 text-blue-200">{nominee}</span>
              )) : <span className="text-sm text-gray-400">Aday verisi yok</span>}
            </div>
          </div>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold text-white">Kategori Kazanma Dağılımı (2018-güncel)</h2>
        <p className="text-sm text-gray-400 mt-1">En çok kategori kazanan 10 oyun.</p>
        <div className="mt-4 space-y-3">
          {leaderboard.map((entry) => (
            <div key={entry.title}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-200">{entry.title}</span>
                <span className="text-blue-300">{entry.wins}</span>
              </div>
              <div className="h-2 rounded bg-gray-800 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(entry.wins / maxWins) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
