import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

function Sidebar({ mobileOpen, onClose }) {
  const { user, role } = useAuth()

  const patientLinks = [
    {
      label: 'Dashboard',
      to: '/patient/dashboard',
      icon: '⌂',
    },
    {
      label: 'Find a Doctor',
      to: '/patient/doctors',
      icon: '⚕',
    },
    {
      label: 'Appointments',
      to: '/patient/appointments',
      icon: '▣',
    },
  ]

  const patientHealthLinks = [
    {
      label: 'Medical Records',
      to: '/patient/medical-records',
      icon: '▤',
    },
    {
      label: 'Verification',
      to: '/patient/verification',
      icon: '✓',
    },
  ]

  const doctorLinks = [
    {
      label: 'Dashboard',
      to: '/doctor/dashboard',
      icon: '⌂',
    },
    {
      label: 'Appointments',
      to: '/doctor/appointments',
      icon: '▣',
    },
    {
      label: 'Waiting Queue',
      to: '/doctor/waiting-queue',
      icon: '☷',
    },
  ]

  const doctorClinicalLinks = [
    {
      label: 'Medical Records',
      to: '/doctor/medical-records',
      icon: '▤',
    },
  ]

  const doctorAccountLinks = [
    {
      label: 'My Profile',
      to: '/doctor/profile',
      icon: '◉',
    },
  ]

  const receptionistLinks = [
    {
      label: 'Dashboard',
      to: '/receptionist/dashboard',
      icon: '⌂',
    },
    {
      label: 'Appointments',
      to: '/receptionist/appointments',
      icon: '▣',
    },
  ]

  const adminLinks = [
    {
      label: 'Dashboard',
      to: '/admin/dashboard',
      icon: '⌂',
    },
    {
      label: 'Doctors',
      to: '/admin/doctors',
      icon: '⚕',
    },
    {
      label: 'Departments',
      to: '/admin/departments',
      icon: '▦',
    },
  ]

  const superAdminLinks = [
    {
      label: 'Dashboard',
      to: '/super-admin/dashboard',
      icon: '⌂',
    },
    {
      label: 'Hospitals',
      to: '/super-admin/hospitals',
      icon: '▣',
    },
    {
      label: 'Hospital Administrators',
      to: '/super-admin/hospital-admins',
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

  const mainLinks = getMainLinks()

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-mc-100
          bg-white
          transition-transform
          duration-300
          lg:static
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-mc-100 px-6">
          <div>
            <h1 className="text-xl font-bold text-blue-600">
              MediConnect
            </h1>

            <p className="text-xs text-gray-500">
              Healthcare Management
            </p>
          </div>
        </div>

        {/* User Role */}
        <div className="border-b border-mc-100 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Role
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {getRoleName()}
          </p>

          {user?.email && (
            <p className="mt-1 break-all text-xs text-gray-400">
              {user.email}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {/* Main Navigation */}
          {mainLinks.length > 0 && (
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Main Menu
              </p>

              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      ${isActive ? 'bg-mc-50 text-mc-600' : 'text-slate-600 hover:bg-mc-50 hover:text-mc-700'}
                      `
                    }
                  >
                    <span className="flex w-5 justify-center text-base">
                      {link.icon}
                    </span>

                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Patient Health Section */}
          {role === 'PATIENT' && (
            <div className="mt-7">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Health
              </p>

              <div className="space-y-1">
                {patientHealthLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      ${isActive ? 'bg-mc-50 text-mc-600' : 'text-slate-600 hover:bg-mc-50 hover:text-mc-700'}
                      `
                    }
                  >
                    <span className="flex w-5 justify-center text-base">
                      {link.icon}
                    </span>

                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Clinical Section */}
          {role === 'DOCTOR' && (
            <>
              <div className="mt-7">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Clinical
                </p>

                <div className="space-y-1">
                  {doctorClinicalLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${isActive ? 'bg-mc-50 text-mc-600' : 'text-slate-600 hover:bg-mc-50 hover:text-mc-700'}
                        `
                      }
                    >
                      <span className="flex w-5 justify-center text-base">
                        {link.icon}
                      </span>

                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Account
                </p>

                <div className="space-y-1">
                  {doctorAccountLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${isActive ? 'bg-mc-50 text-mc-600' : 'text-slate-600 hover:bg-mc-50 hover:text-mc-700'}
                        `
                      }
                    >
                      <span className="flex w-5 justify-center text-base">
                        {link.icon}
                      </span>

                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* System Administration Section */}
          {role === 'SUPER_ADMIN' && (
            <div className="mt-7">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                System Administration
              </p>

              <div className="rounded-lg bg-mc-50 px-3 py-3">
                <p className="text-xs leading-5 text-mc-700">
                  Manage hospitals and hospital administrators
                  across the MediConnect system.
                </p>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-400">
            MediConnect
          </p>

          <p className="text-xs text-gray-400">
            Healthcare Management System
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar