import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function ProtectedRoute({ children, allowedRoles }) {
  const {
    isAuthenticated,
    role,
    isLoading,
  } = useAuth()

  // ======================================================
  // WAIT FOR AUTHENTICATION RESTORATION
  // ======================================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-mc-100 border-t-mc-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading MediConnect...
          </p>
        </div>
      </div>
    )
  }

  // ======================================================
  // NOT AUTHENTICATED
  // ======================================================

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ======================================================
  // WRONG ROLE
  // ======================================================

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute

