import { useEffect, useState } from 'react'
import api from '../api/axios'

const statuses = [
  'PENDING',
  'APPROVED',
  'CHECKED_IN',
  'REJECTED',
  'CANCELLED',
  'COMPLETED',
]

const getStatusClasses = (appointmentStatus) => {
  switch (appointmentStatus) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-700'

    case 'APPROVED':
      return 'bg-blue-100 text-blue-700'

    case 'CHECKED_IN':
      return 'bg-purple-100 text-purple-700'

    case 'COMPLETED':
      return 'bg-green-100 text-green-700'

    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-100 text-red-700'

    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [patient, setPatient] = useState('')
  const [doctor, setDoctor] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')

  // ======================================================
  // LOAD ALL HOSPITAL APPOINTMENTS
  // ======================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/appointments/hospital')

      setAppointments(response.data || [])
    } catch (error) {
      console.error('Appointments error:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to view hospital appointments.',
        )
      } else {
        setError('Unable to load appointments.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    let cancelled = false

    const loadAppointments = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/appointments/hospital')

        if (!cancelled) {
          setAppointments(response.data || [])
        }
      } catch (error) {
        console.error('Appointments error:', error)

        if (!cancelled) {
          if (error.response?.status === 401) {
            setError(
              'Your session has expired. Please log in again.',
            )
          } else if (error.response?.status === 403) {
            setError(
              'You do not have permission to view hospital appointments.',
            )
          } else {
            setError('Unable to load appointments.')
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAppointments()

    return () => {
      cancelled = true
    }
  }, [])

  // ======================================================
  // SEARCH / FILTER
  // ======================================================

  const searchAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      let response

      /*
       * Confirmed backend endpoints:
       *
       * GET /appointments/hospital
       * GET /appointments/hospital/status/{status}
       *
       * Patient, doctor and date filtering is therefore
       * performed on the frontend.
       */

      if (status) {
        response = await api.get(
          `/appointments/hospital/status/${status}`,
        )
      } else {
        response = await api.get('/appointments/hospital')
      }

      let results = response.data || []

      const patientSearch = patient.trim().toLowerCase()
      const doctorSearch = doctor.trim().toLowerCase()

      if (patientSearch) {
        results = results.filter((appointment) =>
          (appointment.patientName || '')
            .toLowerCase()
            .includes(patientSearch),
        )
      }

      if (doctorSearch) {
        results = results.filter((appointment) =>
          (appointment.doctorName || '')
            .toLowerCase()
            .includes(doctorSearch),
        )
      }

      if (date) {
        results = results.filter(
          (appointment) =>
            appointment.appointmentDate === date,
        )
      }

      setAppointments(results)
    } catch (error) {
      console.error('Search appointments error:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to search appointments.',
        )
      } else {
        setError('Unable to search appointments.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  const clearFilters = async () => {
    setPatient('')
    setDoctor('')
    setStatus('')
    setDate('')

    await fetchAppointments()
  }

  // ======================================================
  // CHECK IN PATIENT
  // ======================================================

  const handleCheckIn = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to check in this patient?',
    )

    if (!confirmed) {
      return
    }

    try {
      setLoading(true)
      setError('')

      await api.put(
        `/appointments/${appointmentId}/check-in`,
      )

      /*
       * Reload using the currently selected filters.
       */
      await searchAppointments()
    } catch (error) {
      console.error('Check-in error:', error)

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            'This appointment cannot be checked in.',
        )
      } else if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to check in patients.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to check in patient.',
        )
      }

      setLoading(false)
    }
  }

  const hasFilters =
    patient.trim() ||
    doctor.trim() ||
    status ||
    date

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Receptionist
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Appointment Management
            </h1>

            <p className="mt-2 text-slate-600">
              View, search and check in hospital appointments.
            </p>
          </div>
        </header>

        {/* FILTERS */}

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Search Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Filter appointments by patient, doctor, status or date.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <label
                htmlFor="patient"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Patient
              </label>

              <input
                id="patient"
                type="text"
                placeholder="Patient name"
                value={patient}
                onChange={(event) =>
                  setPatient(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="doctor"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Doctor
              </label>

              <input
                id="doctor"
                type="text"
                placeholder="Doctor name"
                value={doctor}
                onChange={(event) =>
                  setDoctor(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  All statuses
                </option>

                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Date
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* FILTER ACTIONS */}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={searchAppointments}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>

            <button
              type="button"
              onClick={clearFilters}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>

            {error.includes('session') && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/login'
                }}
                className="shrink-0 font-semibold underline hover:no-underline"
              >
                Login
              </button>
            )}
          </div>
        )}

        {/* APPOINTMENTS */}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* SECTION HEADER */}

          <div className="flex flex-col gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Hospital Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {appointments.length} appointment
                {appointments.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {hasFilters && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Filters active
              </span>
            )}
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center p-10">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading appointments...
                </p>
              </div>
            </div>
          ) : appointments.length === 0 ? (

            /* EMPTY STATE */

            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📅
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No appointments found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {hasFilters
                  ? 'Try adjusting your search filters.'
                  : 'There are currently no hospital appointments.'}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {appointment.patientName || '—'}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {appointment.doctorName
                          ? `Dr. ${appointment.doctorName}`
                          : '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {appointment.appointmentDate || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {appointment.appointmentTime || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status
                            ? appointment.status.replace('_', ' ')
                            : 'UNKNOWN'}
                        </span>
                      </td>

                      <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                        <span
                          className="block truncate"
                          title={appointment.reason || ''}
                        >
                          {appointment.reason || '—'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {appointment.status === 'APPROVED' ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleCheckIn(appointment.id)
                            }
                            disabled={loading}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Check In
                          </button>
                        ) : appointment.status ===
                          'CHECKED_IN' ? (
                          <span className="text-sm font-semibold text-purple-600">
                            Checked In
                          </span>
                        ) : appointment.status ===
                          'COMPLETED' ? (
                          <span className="text-sm font-semibold text-green-600">
                            Completed
                          </span>
                        ) : appointment.status ===
                          'CANCELLED' ? (
                          <span className="text-sm font-semibold text-red-600">
                            Cancelled
                          </span>
                        ) : appointment.status ===
                          'REJECTED' ? (
                          <span className="text-sm font-semibold text-red-600">
                            Rejected
                          </span>
                        ) : appointment.status ===
                          'PENDING' ? (
                          <span className="text-sm text-slate-400">
                            Waiting for doctor
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>
      </div>
    </main>
  )
}

export default ReceptionistAppointments