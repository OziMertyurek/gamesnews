import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth'
import { toFriendlyAuthError } from '../lib/errorMessages'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const result = await loginUser(email, password)
    if (!result.ok) {
      setError(toFriendlyAuthError(result.error ?? 'Giris basarisiz.'))
      return
    }
    navigate('/profil')
  }

  return (
    <div className="max-w-lg mx-auto card p-6">
      <h1 className="text-2xl font-bold text-white">Login</h1>
      <p className="text-gray-400 mt-2">Hesabina giris yap ve profilini gor.</p>

      <form className="space-y-4 mt-6" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-gray-300 mb-1">E-posta</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Sifre</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" className="btn-primary w-full justify-center">Giris Yap</button>
      </form>

      <p className="text-sm text-gray-400 mt-4">
        Hesabin yok mu? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign Up</Link>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Admin girisi icin <Link to="/admin/login" className="text-blue-400 hover:text-blue-300">/admin/login</Link> adresini kullan.
      </p>
    </div>
  )
}
