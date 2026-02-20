import { createClient } from '@supabase/supabase-js'

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

const CURRENT_USER_KEY = 'gn_current_user'
const CURRENT_ADMIN_KEY = 'gn_current_admin'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

function setCurrentUser(user: { name: string; email: string } | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY)
    return
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

function setCurrentAdmin(admin: { name: string; email: string; role: 'admin' } | null) {
  if (!admin) {
    localStorage.removeItem(CURRENT_ADMIN_KEY)
    return
  }
  localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(admin))
}

async function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase baglantisi tanimli degil. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY gerekli.')
  }
  return supabase
}

async function ensureProfile(name: string, email: string, role: 'user' | 'admin' = 'user') {
  const client = await ensureSupabase()
  const { error } = await client
    .from('profiles')
    .upsert({ name, email, role }, { onConflict: 'email' })
  if (error) throw new Error(error.message)
}

async function getAccessToken() {
  const client = await ensureSupabase()
  const { data } = await client.auth.getSession()
  return data.session?.access_token ?? ''
}

export async function signupUser(user: AuthUser): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = await ensureSupabase()
    const { data, error } = await client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: { name: user.name },
      },
    })
    if (error) return { ok: false, error: error.message }

    const sessionUser = data.user
    if (sessionUser?.email) {
      await ensureProfile(user.name, sessionUser.email, 'user')
      setCurrentUser({ name: user.name, email: sessionUser.email })
    }

    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Kayit basarisiz.' }
  }
}

export async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = await ensureSupabase()
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }

    const metadata = data.user?.user_metadata as { name?: string } | undefined
    const safeEmail = data.user?.email ?? email
    const name = metadata?.name || safeEmail.split('@')[0]

    await ensureProfile(name, safeEmail, 'user')
    setCurrentUser({ name, email: safeEmail })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Giris basarisiz.' }
  }
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

export async function logoutUser() {
  if (supabase) {
    await supabase.auth.signOut()
  }
  setCurrentUser(null)
  setCurrentAdmin(null)
}

export function listPublicUsers(): PublicUser[] {
  return []
}

export function getPublicUserByEmail(_email: string): PublicUser | null {
  return null
}

export async function loginAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = await ensureSupabase()
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }

    const safeEmail = data.user?.email?.toLowerCase() ?? ''
    if (!safeEmail) return { ok: false, error: 'Admin kullanicisi bulunamadi.' }

    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('name,email,role')
      .eq('email', safeEmail)
      .single()

    if (profileError) return { ok: false, error: profileError.message }
    if (profile?.role !== 'admin') {
      await client.auth.signOut()
      return { ok: false, error: 'Admin yetkisi gerekli.' }
    }

    setCurrentAdmin({
      name: String(profile.name ?? 'System Admin'),
      email: String(profile.email ?? safeEmail),
      role: 'admin',
    })
    setCurrentUser({
      name: String(profile.name ?? safeEmail.split('@')[0]),
      email: safeEmail,
    })

    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Admin girisi basarisiz.' }
  }
}

export function getCurrentAdmin(): { name: string; email: string; role: 'admin' } | null {
  try {
    const raw = localStorage.getItem(CURRENT_ADMIN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
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
  if (supabase) {
    void supabase.auth.signOut()
  }
  setCurrentAdmin(null)
}

async function fetchAdminApi(path: string, init?: RequestInit) {
  const token = await getAccessToken()
  if (!token) {
    return { ok: false, error: 'Supabase oturumu yok. Lutfen tekrar admin login olun.' }
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: typeof payload?.error === 'string' ? payload.error : 'Admin API hatasi.' }
  }

  return { ok: true, payload }
}

export async function listAllUsersForAdmin(): Promise<Array<{ name: string; email: string; role: 'user' | 'admin' }>> {
  const result = await fetchAdminApi('/api/admin-users', { method: 'GET' })
  if (!result.ok) return []

  const rows = Array.isArray(result.payload?.users) ? result.payload.users : []
  return rows.map((row: Record<string, unknown>) => ({
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    role: row.role === 'admin' ? 'admin' : 'user',
  }))
}

export async function updateUserRoleForAdmin(email: string, role: 'user' | 'admin') {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { ok: false, error: 'Gecersiz e-posta.' }

  const result = await fetchAdminApi('/api/admin-user-role', {
    method: 'POST',
    body: JSON.stringify({ email: normalized, role }),
  })

  if (!result.ok) {
    return { ok: false, error: result.error }
  }

  return { ok: true }
}

export async function listAdminAuditLogForAdmin() {
  const result = await fetchAdminApi('/api/admin-audit-log', { method: 'GET' })
  if (!result.ok) return []
  return Array.isArray(result.payload?.rows) ? result.payload.rows : []
}

export async function listApprovedNeedsReviewForAdmin(): Promise<string[]> {
  const result = await fetchAdminApi('/api/admin-review-approvals', { method: 'GET' })
  if (!result.ok) return []
  const rows = Array.isArray(result.payload?.slugs) ? result.payload.slugs : []
  return rows.map((row: unknown) => String(row))
}

export async function approveNeedsReviewForAdmin(slug: string, title: string) {
  const result = await fetchAdminApi('/api/admin-review-approvals', {
    method: 'POST',
    body: JSON.stringify({ slug, title }),
  })
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
