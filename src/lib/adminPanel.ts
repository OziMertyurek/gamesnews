export interface AdminAuditEntry {
  id: string
  at: string
  adminEmail: string
  action: 'role_change' | 'needs_review_approve'
  target: string
  detail: string
}

const AUDIT_KEY = 'gn_admin_audit_log'
const REVIEW_APPROVED_KEY = 'gn_review_approved_slugs'

function safeParseArray<T>(raw: string | null): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function listAdminAuditLogs(): AdminAuditEntry[] {
  const rows = safeParseArray<AdminAuditEntry>(localStorage.getItem(AUDIT_KEY))
  return rows.sort((a, b) => b.at.localeCompare(a.at))
}

export function pushAdminAuditLog(entry: Omit<AdminAuditEntry, 'id' | 'at'>) {
  const rows = listAdminAuditLogs()
  rows.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    ...entry,
  })
  localStorage.setItem(AUDIT_KEY, JSON.stringify(rows.slice(0, 300)))
}

export function listApprovedNeedsReviewSlugs(): string[] {
  const rows = safeParseArray<string>(localStorage.getItem(REVIEW_APPROVED_KEY))
  return Array.from(new Set(rows.map((row) => String(row))))
}

export function approveNeedsReviewSlug(slug: string) {
  const normalized = String(slug).trim()
  if (!normalized) return
  const rows = listApprovedNeedsReviewSlugs()
  if (rows.includes(normalized)) return
  rows.push(normalized)
  localStorage.setItem(REVIEW_APPROVED_KEY, JSON.stringify(rows))
}
