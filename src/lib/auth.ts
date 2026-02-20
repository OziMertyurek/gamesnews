export interface AuthUser {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface PublicUser {
  name: string
  email: string
}

const USERS_KEY = 'gn_users'
const CURRENT_USER_KEY = 'gn_current_user'
const CURRENT_ADMIN_KEY = 'gn_current_admin'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@allaroundgame.local'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'Admin123!'

function readUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signupUser(user: AuthUser): { ok: boolean; error?: string } {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: 'Bu e-posta zaten kayıtlı.' }
  }
  users.push({ ...user, role: user.role ?? 'user' })
  writeUsers(users)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
  return { ok: true }
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!user) return { ok: false, error: 'E-posta veya şifre hatalı.' }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
  return { ok: true }
}

export function getCurrentUser(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
    return { name: parsed.name ?? 'Kullanıcı', email: parsed.email }
  } catch {
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function listPublicUsers(): PublicUser[] {
  return readUsers().map((user) => ({
    name: user.name,
    email: user.email,
  }))
}

export function getPublicUserByEmail(email: string): PublicUser | null {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  const found = readUsers().find((user) => user.email.toLowerCase() === normalized)
  if (!found) return null
  return {
    name: found.name,
    email: found.email,
  }
}

export function loginAdmin(email: string, password: string): { ok: boolean; error?: string } {
  const normalized = email.trim().toLowerCase()
  if (normalized !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { ok: false, error: 'Admin e-posta veya şifre hatalı.' }
  }

  localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify({
    name: 'System Admin',
    email: ADMIN_EMAIL,
    role: 'admin',
  }))
  return { ok: true }
}

export function getCurrentAdmin(): { name: string; email: string; role: 'admin' } | null {
  try {
    const raw = localStorage.getItem(CURRENT_ADMIN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.email !== ADMIN_EMAIL) return null
    return {
      name: parsed.name ?? 'System Admin',
      email: parsed.email,
      role: 'admin',
    }
  } catch {
    return null
  }
}

export function logoutAdmin() {
  localStorage.removeItem(CURRENT_ADMIN_KEY)
}

export function listAllUsersForAdmin() {
  return readUsers().map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role ?? 'user',
  }))
}
