import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function PatientDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/appointments/my')

      setAppointments(response.data || [])
    } catch (err) {
      console.error('Error fetching patient appointments:', err)

      if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to view your appointments.',
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Unable to load your appointments.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?',
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(appointmentId)
      setError('')

      await api.put(`/appointments/${appointmentId}/cancel`)

      await fetchAppointments()
    } catch (err) {
      console.error('Error cancelling appointment:', err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Unable to cancel the appointment.')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleReschedule = (appointmentId) => {
    window.location.href = `/patient/book-appointment?reschedule=${appointmentId}`
  }

  const upcomingAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const status = appointment.status?.toUpperCase()

      return (
        status !== 'COMPLETED' &&
        status !== 'CANCELLED' &&
        status !== 'CANCELED' &&
        status !== 'REJECTED'
      )
    })
  }, [appointments])

  const completedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.status?.toUpperCase() === 'COMPLETED',
    )
  }, [appointments])

  const cancelledAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const status = appointment.status?.toUpperCase()

      return (
        status === 'CANCELLED' ||
        status === 'CANCELED' ||
        status === 'REJECTED'
      )
    })
  }, [appointments])

  const filteredAppointments = useMemo(() => {
    switch (filter) {
      case 'UPCOMING':
        return upcomingAppointments

      case 'COMPLETED':
        return completedAppointments

      case 'CANCELLED':
        return cancelledAppointments

      default:
        return appointments
    }
  }, [
    filter,
    appointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
  ])

  const getDoctorName = (appointment) => {
    if (appointment.doctorName) {
      return appointment.doctorName
    }

    if (appointment.doctor?.fullName) {
      return appointment.doctor.fullName
    }

    if (
      appointment.doctor?.firstName ||
      appointment.doctor?.lastName
    ) {
      return `${appointment.doctor.firstName || ''} ${
        appointment.doctor.lastName || ''
      }`.trim()
    }

    return 'Doctor'
  }

  const formatStatus = (status) => {
    if (!status) {
      return 'Unknown'
    }

    return status
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  }

  const getStatusClasses = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700'

      case 'APPROVED':
        return 'bg-blue-50 text-blue-700'

      case 'CHECKED_IN':
      case 'WAITING':
        return 'bg-indigo-50 text-indigo-700'

      case 'COMPLETED':
        return 'bg-green-50 text-green-700'

      case 'CANCELLED':
      case 'CANCELED':
      case 'REJECTED':
        return 'bg-red-50 text-red-700'

      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const canModifyAppointment = (status) => {
    const normalizedStatus = status?.toUpperCase()

    return (
      normalizedStatus === 'PENDING' ||
      normalizedStatus === 'APPROVED'
    )
  }

  return (
    <div className="min-h-full bg-blue-50/40 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Patient Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Manage your appointments, doctors, and healthcare
            information.
          </p>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/patient/doctors"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                ⚕
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Find a Doctor
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Search for doctors by name, specialty, or department.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Find a doctor →
              </p>
            </Link>

            <Link
              to="/patient/book-appointment"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                +
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Book Appointment
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Schedule an appointment with a healthcare
                professional.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Book now →
              </p>
            </Link>

            <Link
              to="/patient/medical-records"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                ▤
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Medical Records
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                View your medical history and healthcare records.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                View records →
              </p>
            </Link>
          </div>
        </section>

        {/* STATISTICS */}

        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Appointments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? '—' : appointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Upcoming
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? '—' : upcomingAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? '—' : completedAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? '—' : cancelledAppointments.length}
              </p>
            </div>
          </div>
        </section>

        {/* APPOINTMENTS */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  My Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your appointments.
                </p>
              </div>

              <Link
                to="/patient/appointments"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all appointments →
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ['ALL', 'All'],
                ['UPCOMING', 'Upcoming'],
                ['COMPLETED', 'Completed'],
                ['CANCELLED', 'Cancelled'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="text-sm text-slate-500">
                Loading appointments...
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg text-blue-600">
                ▣
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No appointments found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                You do not have any appointments in this category.
              </p>

              <Link
                to="/patient/book-appointment"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Book an appointment
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="border-b border-blue-100 bg-blue-50/50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Time
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="transition hover:bg-blue-50/40"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-slate-900">
                          {getDoctorName(appointment)}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {appointment.appointmentDate || '—'}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {appointment.appointmentTime || '—'}
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                          {appointment.reason || '—'}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              appointment.status,
                            )}`}
                          >
                            {formatStatus(appointment.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {canModifyAppointment(
                            appointment.status,
                          ) ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleReschedule(appointment.id)
                                }
                                className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(appointment.id)
                                }
                                disabled={
                                  actionLoading === appointment.id
                                }
                                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionLoading === appointment.id
                                  ? 'Cancelling...'
                                  : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredAppointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {getDoctorName(appointment)}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.appointmentDate || '—'}
                          {' · '}
                          {appointment.appointmentTime || '—'}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          appointment.status,
                        )}`}
                      >
                        {formatStatus(appointment.status)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-blue-50/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {appointment.reason || 'No reason provided'}
                      </p>
                    </div>

                    {canModifyAppointment(appointment.status) && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleReschedule(appointment.id)
                          }
                          className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          Reschedule
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCancel(appointment.id)
                          }
                          disabled={
                            actionLoading === appointment.id
                          }
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === appointment.id
                            ? 'Cancelling...'
                            : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default PatientDashboard