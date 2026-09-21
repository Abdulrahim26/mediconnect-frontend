import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          </div>

          <h1 className="text-lg font-bold text-slate-900">
            MediConnect
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute