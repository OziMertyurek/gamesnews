import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicProfileById, type PublicUser } from '../lib/auth'

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      const row = await getPublicProfileById(id ?? '')
      if (!active) return
      setUser(row)
      setLoading(false)
    }
    void run()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <p className="text-gray-400">Profil yukleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Kullanici bulunamadi</h1>
        <p className="text-gray-400 mt-2">Aradigin profil bulunamadi veya gizli.</p>
        <Link to="/" className="btn-primary mt-5">Ana Sayfaya Don</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-400 mt-2">Kullanici Profili</p>
        <p className="text-sm text-gray-500 mt-4">Bu profilde e-posta bilgisi gizlidir.</p>
      </section>
    </div>
  )
}
