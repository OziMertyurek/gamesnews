import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../lib/auth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const result = loginAdmin(email, password)
    if (!result.ok) {
      setError(result.error ?? 'Admin girişi başarısız.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="max-w-lg mx-auto card p-6">
      <h1 className="text-2xl font-bold text-white">Admin Login</h1>
      <p className="text-gray-400 mt-2">Yönetim paneline erişmek için giriş yap.</p>
      <form className="space-y-4 mt-6" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Admin E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="btn-primary w-full justify-center">Yönetici Girişi</button>
      </form>
    </div>
  )
}
