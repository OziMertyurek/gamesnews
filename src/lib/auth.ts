export interface AuthUser {
  name: string
  email: string
  password: string
}

export interface PublicUser {
  name: string
  email: string
}

const USERS_KEY = 'gn_users'
const CURRENT_USER_KEY = 'gn_current_user'

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
    return { ok: false, error: 'Bu e-posta zaten kayitli.' }
  }
  users.push(user)
  writeUsers(users)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
  return { ok: true }
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!user) return { ok: false, error: 'E-posta veya sifre hatali.' }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
  return { ok: true }
}

export function getCurrentUser(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
    return { name: parsed.name ?? 'Kullanici', email: parsed.email }
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
