import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function ProtectedRoute({ children, allowedSubjects = [], requireAdmin = false }) {
  const { user, profile, isAdmin } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/painel" replace />
  if (allowedSubjects.length > 0 && !isAdmin && !allowedSubjects.includes(profile?.subject)) {
    return <Navigate to="/painel" replace />
  }
  return children
}