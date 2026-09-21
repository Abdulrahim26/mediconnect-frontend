import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function SuperAdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalHospitals: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalDepartments: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          '/super-admin/dashboard',
        )

        if (!cancelled) {
          setDashboard({
            totalHospitals:
              response.data?.totalHospitals || 0,

            totalDoctors:
              response.data?.totalDoctors || 0,

            totalPatients:
              response.data?.totalPatients || 0,

            totalAppointments:
              response.data?.totalAppointments || 0,

            totalDepartments:
              response.data?.totalDepartments || 0,
          })
        }
      } catch (error) {
        console.error(
          'System Admin dashboard error:',
          error,
        )

        if (!cancelled) {
          if (error.response?.status === 401) {
            setError(
              'Your session has expired. Please log in again.',
            )
          } else if (error.response?.status === 403) {
            setError(
              'You do not have permission to access the System Admin dashboard.',
            )
          } else {
            setError(
              'Unable to load System Admin dashboard information.',
            )
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const statistics = [
    {
      label: 'Hospitals',
      value: dashboard.totalHospitals,
      description: 'Registered healthcare facilities',
      icon: 'ðŸ¥',
      iconClasses: 'bg-blue-100 text-blue-700',
      valueClasses: 'text-blue-600',
    },
    {
      label: 'Doctors',
      value: dashboard.totalDoctors,
      description: 'Healthcare professionals',
      icon: 'âš•',
      iconClasses: 'bg-green-100 text-green-700',
      valueClasses: 'text-green-600',
    },
    {
      label: 'Patients',
      value: dashboard.totalPatients,
      description: 'Registered patients',
      icon: 'ðŸ‘¤',
      iconClasses: 'bg-purple-100 text-purple-700',
      valueClasses: 'text-purple-600',
    },
    {
      label: 'Appointments',
      value: dashboard.totalAppointments,
      description: 'Appointments across the platform',
      icon: 'â–£',
      iconClasses: 'bg-orange-100 text-orange-700',
      valueClasses: 'text-orange-600',
    },
    {
      label: 'Departments',
      value: dashboard.totalDepartments,
      description: 'Healthcare departments',
      icon: 'â–¦',
      iconClasses: 'bg-indigo-100 text-indigo-700',
      valueClasses: 'text-indigo-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-lg font-medium text-slate-600">
            Loading System Admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <header className="mb-8">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              MediConnect Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              System Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Monitor the MediConnect platform and manage
              hospitals and hospital administrators.
            </p>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div>
              <p className="text-sm font-semibold">
                Dashboard Error
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-sm font-bold text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              âœ•
            </button>
          </div>
        )}

        {/* PLATFORM STATISTICS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current statistics across the MediConnect system.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p
                      className={`mt-3 text-3xl font-bold ${stat.valueClasses}`}
                    >
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.iconClasses}`}
                  >
                    {stat.icon}
                  </div>

                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* QUICK ACTIONS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access the most important system administration tools.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* HOSPITAL MANAGEMENT */}

            <Link
              to="/super-admin/hospitals"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                    ðŸ¥
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Hospital Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    View registered hospitals and create new
                    healthcare facilities on the MediConnect platform.
                  </p>
                </div>

                <span className="hidden rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 sm:inline-flex">
                  Manage
                </span>

              </div>

              <p className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Manage hospitals â†’
              </p>
            </Link>

            {/* HOSPITAL ADMIN MANAGEMENT */}

            <Link
              to="/super-admin/hospital-admins/create"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl text-purple-700">
                    ðŸ‘¤
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Hospital Administrators
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create hospital administrator accounts and
                    assign administrators to healthcare facilities.
                  </p>
                </div>

                <span className="hidden rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 sm:inline-flex">
                  Create
                </span>

              </div>

              <p className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Create hospital admin â†’
              </p>
            </Link>

          </div>
        </section>

        {/* ADMINISTRATION MODULES */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              System Administration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the organizations and administrative accounts
              that make up the MediConnect platform.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">

            {/* HOSPITAL MODULE */}

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg text-blue-700">
                  ðŸ¥
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    Administration module
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    Hospital Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create and view hospitals registered on
                    the MediConnect platform.
                  </p>

                  <Link
                    to="/super-admin/hospitals"
                    className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Open hospital management â†’
                  </Link>
                </div>

              </div>
            </div>

            {/* ADMIN MODULE */}

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg text-purple-700">
                  ðŸ‘¤
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    Administration module
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    Hospital Administrators
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create administrator accounts and assign
                    them to specific hospitals.
                  </p>

                  <Link
                    to="/super-admin/hospital-admins/create"
                    className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create hospital admin â†’
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default SuperAdminDashboard

