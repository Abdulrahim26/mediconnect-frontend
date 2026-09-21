import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/appointments/doctor')

      setAppointments(response.data || [])
    } catch (err) {
      console.error('Error fetching doctor appointments:', err)

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

  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  const todayAppointments = appointments.filter((appointment) => {
    if (!appointment.appointmentDate) {
      return false
    }

    return appointment.appointmentDate === todayString
  })

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toUpperCase() === 'PENDING',
  )

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toUpperCase() === 'COMPLETED',
  )

  const waitingAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toUpperCase() === 'CHECKED_IN' ||
      appointment.status?.toUpperCase() === 'WAITING',
  )

  const getPatientName = (appointment) => {
    if (appointment.patientName) {
      return appointment.patientName
    }

    if (appointment.patient?.fullName) {
      return appointment.patient.fullName
    }

    if (
      appointment.patient?.firstName ||
      appointment.patient?.lastName
    ) {
      return `${appointment.patient.firstName || ''} ${
        appointment.patient.lastName || ''
      }`.trim()
    }

    return 'Patient'
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

  return (
    <div className="min-h-full bg-blue-50/40 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Doctor Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Manage your appointments, patient queue, and clinical
            activities.
          </p>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Today's Appointments
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {loading ? '—' : todayAppointments.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                  ▣
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {loading ? '—' : pendingAppointments.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
                  ◷
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Waiting Queue
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {loading ? '—' : waitingAppointments.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-700">
                  ☷
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {loading ? '—' : completedAppointments.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg text-green-700">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access your most frequently used clinical tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/doctor/appointments"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                ▣
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Manage Appointments
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review, approve, reject, and complete patient
                appointments.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                View appointments →
              </p>
            </Link>

            <Link
              to="/doctor/waiting-queue"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                ☷
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Waiting Queue
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                View patients currently waiting for consultation.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Open waiting queue →
              </p>
            </Link>

            <Link
              to="/doctor/medical-records"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                ▤
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Medical Records
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create, review, and manage patient medical records.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Manage records →
              </p>
            </Link>
          </div>
        </section>

        {/* TODAY'S APPOINTMENTS */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-blue-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Today's Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your scheduled appointments for today.
              </p>
            </div>

            <Link
              to="/doctor/appointments"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="text-sm text-slate-500">
                Loading appointments...
              </p>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg text-blue-600">
                ▣
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No appointments today
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                You currently have no appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-blue-100 bg-blue-50/50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {todayAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {getPatientName(appointment)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DoctorDashboard