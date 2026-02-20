import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentAdmin, listAllUsersForAdmin, logoutAdmin } from '../lib/auth'
import { allConsoleExclusiveGames } from '../lib/consoleExclusives'
import { consoleExclusiveNeedsReview } from '../data/consoleExclusiveNeedsReview'

export default function AdminPage() {
  const navigate = useNavigate()
  const admin = getCurrentAdmin()
  const users = useMemo(() => listAllUsersForAdmin(), [])

  const stats = useMemo(() => {
    const playstation = allConsoleExclusiveGames.filter((g) => g.platform_family === 'playstation').length
    const xbox = allConsoleExclusiveGames.filter((g) => g.platform_family === 'xbox').length
    const nintendo = allConsoleExclusiveGames.filter((g) => g.platform_family === 'nintendo').length
    return {
      total: allConsoleExclusiveGames.length,
      playstation,
      xbox,
      nintendo,
      review: consoleExclusiveNeedsReview.length,
      users: users.length,
    }
  }, [users.length])

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Yönetici Paneli</h1>
            <p className="text-sm text-gray-400 mt-1">
              Oturum: {admin?.name} ({admin?.email})
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/" className="btn-ghost">Siteye Don</Link>
              <Link to="/games" className="btn-ghost">Oyunlara Git</Link>
            </div>
          </div>
          <button
            className="btn-ghost"
            onClick={() => {
              logoutAdmin()
              navigate('/admin/login')
            }}
          >
            Admin Çıkış
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <article className="card p-4"><p className="text-xs text-gray-500">Toplam Exclusive</p><p className="text-xl text-white font-bold">{stats.total}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">PlayStation</p><p className="text-xl text-white font-bold">{stats.playstation}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Xbox</p><p className="text-xl text-white font-bold">{stats.xbox}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Nintendo</p><p className="text-xl text-white font-bold">{stats.nintendo}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Needs Review</p><p className="text-xl text-white font-bold">{stats.review}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Kullanıcı</p><p className="text-xl text-white font-bold">{stats.users}</p></article>
      </section>

      <section className="card p-6">
        <h2 className="text-xl text-white font-semibold">Kullanıcı Hesapları</h2>
        <p className="text-sm text-gray-400 mt-1">Sitede oluşturulan hesapların listesi.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2 pr-4">Ad</th>
                <th className="py-2 pr-4">E-posta</th>
                <th className="py-2 pr-4">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b border-gray-800">
                  <td className="py-2 pr-4 text-white">{user.name}</td>
                  <td className="py-2 pr-4 text-gray-300">{user.email}</td>
                  <td className="py-2 pr-4 text-gray-300">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
