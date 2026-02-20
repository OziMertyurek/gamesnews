import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAdminDashboardStats,
  approveNeedsReviewForAdmin,
  getCurrentAdmin,
  listAdminAuditLogForAdmin,
  listAllUsersForAdmin,
  listApprovedNeedsReviewForAdmin,
  logoutAdmin,
  updateUserRoleForAdmin,
} from '../lib/auth'
import { allConsoleExclusiveGames } from '../lib/consoleExclusives'
import { consoleExclusiveNeedsReview } from '../data/consoleExclusiveNeedsReview'
import { games } from '../data/siteContent'
import { getTotalCommentCount } from '../lib/community'

interface AuditRow {
  id: string
  created_at: string
  admin_email: string
  action: string
  target: string
  detail: string
}

export default function AdminPage() {
  const navigate = useNavigate()
  const admin = getCurrentAdmin()
  const [users, setUsers] = useState<Array<{ name: string; email: string; role: 'user' | 'admin' }>>([])
  const [savingEmail, setSavingEmail] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [approvedSlugs, setApprovedSlugs] = useState<string[]>([])
  const [auditRows, setAuditRows] = useState<AuditRow[]>([])
  const [reviewStatus, setReviewStatus] = useState('')
  const [reviewSavingSlug, setReviewSavingSlug] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, activeUsers: 0 })

  const loadUsers = async () => {
    const rows = await listAllUsersForAdmin()
    setUsers(rows)
  }

  const loadAudit = async () => {
    const rows = await listAdminAuditLogForAdmin()
    setAuditRows(rows as AuditRow[])
  }

  const loadApprovals = async () => {
    const rows = await listApprovedNeedsReviewForAdmin()
    setApprovedSlugs(rows)
  }

  useEffect(() => {
    void loadUsers()
    void loadApprovals()
    void loadAudit()
    getAdminDashboardStats().then(setDashboardStats).catch(() => setDashboardStats({ totalUsers: 0, activeUsers: 0 }))
  }, [])

  const handleRoleChange = async (email: string, role: 'user' | 'admin') => {
    setStatusMessage('')
    setSavingEmail(email)
    const result = await updateUserRoleForAdmin(email, role)

    if (!result.ok) {
      setStatusMessage(result.error ?? 'Rol guncellenemedi.')
      setSavingEmail(null)
      return
    }

    setStatusMessage('Rol guncellendi.')
    await Promise.all([loadUsers(), loadAudit()])
    setSavingEmail(null)
  }

  const pendingNeedsReview = useMemo(
    () => consoleExclusiveNeedsReview.filter((row) => !approvedSlugs.includes(row.slug)),
    [approvedSlugs],
  )

  const handleApproveNeedsReview = async (slug: string, title: string) => {
    setReviewStatus('')
    setReviewSavingSlug(slug)
    const result = await approveNeedsReviewForAdmin(slug, title)
    if (!result.ok) {
      setReviewStatus(result.error ?? 'Onay islemi basarisiz.')
      setReviewSavingSlug(null)
      return
    }
    await Promise.all([loadApprovals(), loadAudit()])
    setReviewStatus('Kayit onaylandi ve listeden kaldirildi.')
    setReviewSavingSlug(null)
  }

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const roleOk = roleFilter === 'all' || user.role === roleFilter
      if (!roleOk) return false
      if (!q) return true
      return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    })
  }, [users, searchTerm, roleFilter])

  const stats = useMemo(() => {
    const playstation = allConsoleExclusiveGames.filter((g) => g.platform_family === 'playstation').length
    const xbox = allConsoleExclusiveGames.filter((g) => g.platform_family === 'xbox').length
    const nintendo = allConsoleExclusiveGames.filter((g) => g.platform_family === 'nintendo').length
    const totalComments = getTotalCommentCount()
    const totalGames = new Set([...games.map((g) => g.slug), ...allConsoleExclusiveGames.map((g) => g.slug)]).size
    return {
      total: allConsoleExclusiveGames.length,
      playstation,
      xbox,
      nintendo,
      review: pendingNeedsReview.length,
      users: dashboardStats.totalUsers || users.length,
      activeUsers: dashboardStats.activeUsers,
      totalComments,
      totalGames,
    }
  }, [users.length, pendingNeedsReview.length, dashboardStats.totalUsers, dashboardStats.activeUsers])

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Yonetici Paneli</h1>
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
            Admin Cikis
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <article className="card p-4"><p className="text-xs text-gray-500">Needs Review</p><p className="text-xl text-white font-bold">{stats.review}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Toplam Kullanici</p><p className="text-xl text-white font-bold">{stats.users}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Toplam Yorum</p><p className="text-xl text-white font-bold">{stats.totalComments}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Toplam Oyun</p><p className="text-xl text-white font-bold">{stats.totalGames}</p></article>
        <article className="card p-4"><p className="text-xs text-gray-500">Online Kullanici</p><p className="text-xl text-white font-bold">{stats.activeUsers}</p></article>
      </section>

      <section className="card p-6">
        <h2 className="text-xl text-white font-semibold">Kullanici Hesaplari</h2>
        <p className="text-sm text-gray-400 mt-1">Sitede olusturulan hesaplarin listesi.</p>
        {statusMessage ? <p className="mt-3 text-sm text-blue-300">{statusMessage}</p> : null}

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Isim veya e-posta ara"
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
          >
            <option value="all">Tum roller</option>
            <option value="user">Sadece user</option>
            <option value="admin">Sadece admin</option>
          </select>
          <p className="text-sm text-gray-400 self-center">Gorunen: {filteredUsers.length}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2 pr-4">Ad</th>
                <th className="py-2 pr-4">E-posta</th>
                <th className="py-2 pr-4">Rol</th>
                <th className="py-2 pr-4">Islem</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.email} className="border-b border-gray-800">
                  <td className="py-2 pr-4 text-white">{user.name}</td>
                  <td className="py-2 pr-4 text-gray-300">{user.email}</td>
                  <td className="py-2 pr-4 text-gray-300">
                    <select
                      className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm text-white"
                      value={user.role}
                      disabled={savingEmail === user.email}
                      onChange={(e) => {
                        void handleRoleChange(user.email, e.target.value === 'admin' ? 'admin' : 'user')
                      }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4 text-gray-300">
                    {savingEmail === user.email ? 'Kaydediliyor...' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl text-white font-semibold">Needs Review Onay</h2>
        <p className="text-sm text-gray-400 mt-1">Eksik gorsel veya dogrulama bekleyen kayitlar.</p>
        {reviewStatus ? <p className="mt-2 text-sm text-blue-300">{reviewStatus}</p> : null}
        <div className="mt-4 space-y-3">
          {pendingNeedsReview.length === 0 ? (
            <p className="text-sm text-green-300">Bekleyen kayit yok.</p>
          ) : (
            pendingNeedsReview.map((item) => (
              <article key={item.slug} className="rounded-lg border border-slate-700 bg-slate-900/40 p-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.slug} - {item.platform_family} - reason: {item.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/games/${item.slug}`} className="btn-ghost">Detay</Link>
                  <button
                    className="btn-primary"
                    disabled={reviewSavingSlug === item.slug}
                    onClick={() => {
                      void handleApproveNeedsReview(item.slug, item.title)
                    }}
                  >
                    {reviewSavingSlug === item.slug ? 'Kaydediliyor...' : 'Onayla'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl text-white font-semibold">Audit Log</h2>
        <p className="text-sm text-gray-400 mt-1">Yonetici islemleri kaydi.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2 pr-4">Zaman</th>
                <th className="py-2 pr-4">Admin</th>
                <th className="py-2 pr-4">Aksiyon</th>
                <th className="py-2 pr-4">Hedef</th>
                <th className="py-2 pr-4">Detay</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.slice(0, 50).map((row) => (
                <tr key={row.id} className="border-b border-gray-800">
                  <td className="py-2 pr-4 text-gray-300">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4 text-gray-300">{row.admin_email}</td>
                  <td className="py-2 pr-4 text-gray-300">{row.action}</td>
                  <td className="py-2 pr-4 text-gray-300">{row.target}</td>
                  <td className="py-2 pr-4 text-gray-300">{row.detail}</td>
                </tr>
              ))}
              {auditRows.length === 0 ? (
                <tr>
                  <td className="py-3 text-gray-400" colSpan={5}>Henuz audit kaydi yok.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
