import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../lib/auth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  if (!user) {
    return (
      <div className="card p-10 text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Profil icin giris gerekli</h1>
        <p className="text-gray-400 mt-2">Profilini gormek icin once login ol.</p>
        <div className="flex gap-3 justify-center mt-5">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/signup" className="btn-ghost">Sign Up</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section className="card p-6">
        <h1 className="text-3xl font-bold text-white">Profil</h1>
        <p className="text-gray-400 mt-2">Hesap bilgilerin</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-xs text-gray-500">Ad Soyad</p>
            <p className="text-white font-medium mt-1">{user.name}</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-xs text-gray-500">E-posta</p>
            <p className="text-white font-medium mt-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="btn-ghost"
            onClick={() => {
              logoutUser()
              navigate('/login')
            }}
          >
            Cikis Yap
          </button>
        </div>
      </section>

      <section className="card p-6 border-dashed border-gray-700">
        <h2 className="text-lg font-semibold text-white">Topluluk Ozellikleri</h2>
        <p className="text-gray-400 mt-2">Ileride favori urunler, favori oyun listeleri ve bildirim ayarlari bu alana eklenecek.</p>
      </section>
    </div>
  )
}
