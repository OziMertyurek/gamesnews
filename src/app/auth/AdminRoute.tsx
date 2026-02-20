import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentAdmin } from '../../lib/auth'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const admin = getCurrentAdmin()
  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
