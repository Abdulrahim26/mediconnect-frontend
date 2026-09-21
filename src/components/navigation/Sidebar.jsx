import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

function Sidebar({ mobileOpen, onClose }) {
  const { user, role } = useAuth()
  const location = useLocation()

  const patientLinks = [
    {
      label: 'Dashboard',
      path: '/patient/dashboard',
      icon: '⌂',
    },
    {
      label: 'Find a Doctor',
      path: '/patient/doctors',
      icon: '⚕',
    },
    {
      label: 'Appointments',
      path: '/patient/appointments',
      icon: '▣',
    },
  ]

  const patientHealthLinks = [
    {
      label: 'Medical Records',
      path: '/patient/medical-records',
      icon: '▤',
    },
    {
      label: 'Verification',
      path: '/patient/verification',
      icon: '✓',
    },
  ]

  const patientAccountLinks = [
    {
      label: 'My Profile',
      path: '/patient/profile',
      icon: '👤',
    },
  ]

  const doctorLinks = [
    {
      label: 'Dashboard',
      path: '/doctor/dashboard',
      icon: '⌂',
    },
    {
      label: 'Appointments',
      path: '/doctor/appointments',
      icon: '▣',
    },
    {
      label: 'Waiting Queue',
      path: '/doctor/waiting-queue',
      icon: '◷',
    },
  ]

  const doctorClinicalLinks = [
    {
      label: 'Medical Records',
      path: '/doctor/medical-records',
      icon: '▤',
    },
  ]

  const doctorAccountLinks = [
    {
      label: 'My Profile',
      path: '/doctor/profile',
      icon: '👤',
    },
  ]

  const receptionistLinks = [
    {
      label: 'Dashboard',
      path: '/receptionist/dashboard',
      icon: '⌂',
    },
    {
      label: 'Appointments',
      path: '/receptionist/appointments',
      icon: '▣',
    },
  ]

  const adminLinks = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: '⌂',
    },
    {
      label: 'Doctors',
      path: '/admin/doctors',
      icon: '⚕',
    },
    {
      label: 'Departments',
      path: '/admin/departments',
      icon: '▦',
    },
    {
      label: 'Receptionists',
      path: '/admin/receptionists',
      icon: '♟',
    },
  ]

  const superAdminLinks = [
    {
      label: 'Dashboard',
      path: '/super-admin/dashboard',
      icon: '⌂',
    },
    {
      label: 'Hospitals',
      path: '/super-admin/hospitals',
      icon: '🏥',
    },
    {
      label: 'Hospital Administrators',
      path: '/super-admin/hospital-admins',
      icon: '👤',
    },
  ]

  const getMainLinks = () => {
    switch (role) {
      case 'PATIENT':
        return patientLinks

      case 'DOCTOR':
        return doctorLinks

      case 'RECEPTIONIST':
        return receptionistLinks

      case 'HOSPITAL_ADMIN':
        return adminLinks

      case 'SUPER_ADMIN':
        return superAdminLinks

      default:
        return []
    }
  }

  const getRoleName = () => {
    switch (role) {
      case 'PATIENT':
        return 'Patient'

      case 'DOCTOR':
        return 'Doctor'

      case 'RECEPTIONIST':
        return 'Receptionist'

      case 'HOSPITAL_ADMIN':
        return 'Hospital Administrator'

      case 'SUPER_ADMIN':
        return 'System Administrator'

      default:
        return 'User'
    }
  }

  const getUserName = () => {
    if (user?.fullName) {
      return user.fullName
    }

    if (user?.name) {
      return user.name
    }

    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }

    if (user?.username) {
      return user.username
    }

    return user?.email || 'User'
  }

  const isActive = (path) => {
    if (location.pathname === path) {
      return true
    }

    if (
      path !== '/patient/dashboard' &&
      path !== '/doctor/dashboard' &&
      path !== '/receptionist/dashboard' &&
      path !== '/admin/dashboard' &&
      path !== '/super-admin/dashboard'
    ) {
      return location.pathname.startsWith(`${path}/`)
    }

    return false
  }

  const handleNavigation = () => {
    if (onClose) {
      onClose()
    }
  }

  const renderLinks = (links) => {
    return links.map((link) => {
      const active = isActive(link.path)

      return (
        <Link
          key={link.path}
          to={link.path}
          onClick={handleNavigation}
          className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            active
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition ${
              active
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700'
            }`}
          >
            {link.icon}
          </span>

          <span className="min-w-0 flex-1 truncate">
            {link.label}
          </span>
        </Link>
      )
    })
  }

  const mainLinks = getMainLinks()

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-blue-100 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* BRAND */}

        <div className="flex h-20 shrink-0 items-center border-b border-blue-100 px-5">
          <Link
            to={
              role === 'PATIENT'
                ? '/patient/dashboard'
                : role === 'DOCTOR'
                  ? '/doctor/dashboard'
                  : role === 'RECEPTIONIST'
                    ? '/receptionist/dashboard'
                    : role === 'HOSPITAL_ADMIN'
                      ? '/admin/dashboard'
                      : role === 'SUPER_ADMIN'
                        ? '/super-admin/dashboard'
                        : '/login'
            }
            onClick={handleNavigation}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm">
              M
            </div>

            <div>
              <p className="text-lg font-bold leading-tight text-slate-900">
                MediConnect
              </p>

              <p className="text-xs font-medium text-blue-600">
                Healthcare Management
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 lg:hidden"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* USER SUMMARY */}

        <div className="border-b border-blue-100 bg-blue-50/60 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {getUserName()
                .split(' ')
                .map((part) => part.charAt(0))
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {getUserName()}
              </p>

              <p className="truncate text-xs font-medium text-blue-600">
                {getRoleName()}
              </p>
            </div>
          </div>

          {user?.email && (
            <p className="mt-3 truncate text-xs text-slate-500">
              {user.email}
            </p>
          )}
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {renderLinks(mainLinks)}
          </div>

          {role === 'PATIENT' && (
            <>
              <div className="mt-7">
                <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Health
                </p>

                <div className="space-y-2">
                  {renderLinks(patientHealthLinks)}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account
                </p>

                <div className="space-y-2">
                  {renderLinks(patientAccountLinks)}
                </div>
              </div>
            </>
          )}

          {role === 'DOCTOR' && (
            <>
              <div className="mt-7">
                <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clinical
                </p>

                <div className="space-y-2">
                  {renderLinks(doctorClinicalLinks)}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account
                </p>

                <div className="space-y-2">
                  {renderLinks(doctorAccountLinks)}
                </div>
              </div>
            </>
          )}

          {role === 'SUPER_ADMIN' && (
            <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm text-blue-700">
                  ⚙
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    System Access
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    You have access to platform-wide administration tools.
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* FOOTER */}

        <div className="shrink-0 border-t border-blue-100 bg-white p-4">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">
              MediConnect
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Healthcare Management System
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar