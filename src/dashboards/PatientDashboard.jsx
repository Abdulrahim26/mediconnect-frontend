import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function getStatusClasses(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700'

    case 'APPROVED':
      return 'bg-blue-100 text-blue-700'

    case 'CHECKED_IN':
      return 'bg-purple-100 text-purple-700'

    case 'COMPLETED':
      return 'bg-green-100 text-green-700'

    case 'CANCELLED':
      return 'bg-red-100 text-red-700'

    case 'REJECTED':
      return 'bg-red-100 text-red-700'

    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'PENDING':
      return 'Pending'

    case 'APPROVED':
      return 'Approved'

    case 'CHECKED_IN':
      return 'Checked In'

    case 'COMPLETED':
      return 'Completed'

    case 'CANCELLED':
      return 'Cancelled'

    case 'REJECTED':
      return 'Rejected'

    default:
      return status || 'Unknown'
  }
}

function PatientDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState('all')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchAppointments = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/appointments/my')

        if (!cancelled) {
          setAppointments(
            Array.isArray(response.data)
              ? response.data
              : [],
          )
        }
      } catch (error) {
        console.error(
          'Patient appointments error:',
          error,
        )

        if (!cancelled) {
          if (error.response?.status === 401) {
            setError(
              'Your session has expired. Please log in again.',
            )
          } else if (error.response?.status === 403) {
            setError(
              'You do not have permission to view your appointments.',
            )
          } else {
            setError(
              'Unable to load your appointments.',
            )
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAppointments()

    return () => {
      cancelled = true
    }
  }, [])

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === 'PENDING' ||
          appointment.status === 'APPROVED' ||
          appointment.status === 'CHECKED_IN',
      ),
    [appointments],
  )

  const completedAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === 'COMPLETED',
      ),
    [appointments],
  )

  const cancelledAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === 'CANCELLED' ||
          appointment.status === 'REJECTED',
      ),
    [appointments],
  )

  const historyAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === 'COMPLETED' ||
          appointment.status === 'CANCELLED' ||
          appointment.status === 'REJECTED',
      ),
    [appointments],
  )

  const displayedAppointments =
    view === 'upcoming'
      ? upcomingAppointments
      : view === 'history'
        ? historyAppointments
        : appointments

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?',
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)
      setError('')

      const response = await api.put(
        `/appointments/${appointmentId}/cancel`,
      )

      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (appointment) =>
              appointment.id === appointmentId
                ? response.data
                : appointment,
          ),
      )
    } catch (error) {
      console.error(
        'Cancel appointment error:',
        error,
      )

      setError(
        error.response?.data?.message ||
          'Unable to cancel this appointment.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleReschedule = async (appointment) => {
    const newDate = window.prompt(
      'Enter the new appointment date (YYYY-MM-DD):',
      appointment.appointmentDate || '',
    )

    if (!newDate) {
      return
    }

    const newTime = window.prompt(
      'Enter the new appointment time (HH:MM):',
      appointment.appointmentTime || '',
    )

    if (!newTime) {
      return
    }

    try {
      setActionLoading(true)
      setError('')

      const request = {
        appointmentDate: newDate,
        appointmentTime: newTime,
        reason: appointment.reason,
      }

      const response = await api.put(
        `/appointments/${appointment.id}/reschedule`,
        request,
      )

      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (item) =>
              item.id === appointment.id
                ? response.data
                : item,
          ),
      )
    } catch (error) {
      console.error('========== RESCHEDULE ERROR ==========')
      console.error('Status:', error.response?.status)
      console.error('Response data:', error.response?.data)
      console.error('Response headers:', error.response?.headers)
      console.error('Request data:', error.config?.data)
      console.error('Request URL:', error.config?.url)
      console.error('======================================')

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Unable to reschedule this appointment.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-lg font-medium text-slate-600">
            Loading patient dashboard...
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
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Patient Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Manage your healthcare appointments and medical records.
          </p>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">
              {error}
            </p>

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

        {/* QUICK ACTIONS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access your most important healthcare services.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/patient/doctors"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                âš•
              </div>

              <h3 className="font-bold text-slate-900">
                Find a Doctor
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Search for doctors by specialty, department, or hospital.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Find a doctor â†’
              </p>
            </Link>

            <Link
              to="/patient/book-appointment"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl text-green-700">
                +
              </div>

              <h3 className="font-bold text-slate-900">
                Book Appointment
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Schedule an appointment with a doctor.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Book now â†’
              </p>
            </Link>

            <Link
              to="/patient/appointments"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl text-purple-700">
                â–£
              </div>

              <h3 className="font-bold text-slate-900">
                My Appointments
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                View and manage all your appointments.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                View appointments â†’
              </p>
            </Link>

            <Link
              to="/patient/verification"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-700">
                âœ“
              </div>

              <h3 className="font-bold text-slate-900">
                Identity & Insurance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Verify your Ghana Card and NHIS information and manage your insurance details.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Verify details â†’
              </p>
            </Link>

          </div>
        </section>

        {/* APPOINTMENT STATISTICS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Appointment Overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {appointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Upcoming
              </p>

              <p className="mt-3 text-3xl font-bold text-blue-600">
                {upcomingAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-bold text-green-600">
                {completedAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>

              <p className="mt-3 text-3xl font-bold text-red-600">
                {cancelledAppointments.length}
              </p>
            </div>

          </div>
        </section>

        {/* APPOINTMENTS */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-slate-200 p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  My Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View your appointment schedule and status.
                </p>
              </div>

              <Link
                to="/patient/appointments"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all appointments â†’
              </Link>

            </div>

            {/* FILTERS */}

            <div className="mt-5 flex flex-wrap gap-2">

              {[
                {
                  key: 'all',
                  label: 'All',
                },
                {
                  key: 'upcoming',
                  label: 'Upcoming',
                },
                {
                  key: 'history',
                  label: 'History',
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setView(item.key)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    view === item.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}

            </div>

          </div>

          {/* CONTENT */}

          {displayedAppointments.length === 0 ? (

            <div className="p-8 text-center sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                â–£
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No appointments found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no appointments available for the selected view.
              </p>

              {view !== 'history' && (
                <Link
                  to="/patient/book-appointment"
                  className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Book an Appointment
                </Link>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px] text-left">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Doctor
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {displayedAppointments.map(
                    (appointment) => (

                      <tr
                        key={appointment.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        {/* DOCTOR */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-900">
                            {appointment.doctorName || 'Doctor'}
                          </p>

                          {appointment.specialty && (
                            <p className="mt-1 text-xs text-slate-500">
                              {appointment.specialty}
                            </p>
                          )}

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {appointment.appointmentDate || 'â€”'}
                        </td>

                        {/* TIME */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {appointment.appointmentTime || 'â€”'}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              appointment.status,
                            )}`}
                          >
                            {getStatusLabel(
                              appointment.status,
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex flex-wrap gap-2">

                            {(appointment.status ===
                              'PENDING' ||
                              appointment.status ===
                                'APPROVED') && (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    actionLoading
                                  }
                                  onClick={() =>
                                    handleReschedule(
                                      appointment,
                                    )
                                  }
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {actionLoading
                                    ? 'Please wait...'
                                    : 'Reschedule'}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    actionLoading
                                  }
                                  onClick={() =>
                                    handleCancel(
                                      appointment.id,
                                    )
                                  }
                                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {appointment.status ===
                              'CHECKED_IN' && (
                              <span className="text-xs font-semibold text-purple-600">
                                Checked In
                              </span>
                            )}

                            {appointment.status ===
                              'COMPLETED' && (
                              <span className="text-xs font-semibold text-green-600">
                                Completed
                              </span>
                            )}

                            {(appointment.status ===
                              'CANCELLED' ||
                              appointment.status ===
                                'REJECTED') && (
                              <span className="text-xs font-semibold text-red-600">
                                {getStatusLabel(
                                  appointment.status,
                                )}
                              </span>
                            )}

                          </div>

                        </td>

                      </tr>

                    ),
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </div>
  )
}

export default PatientDashboard
