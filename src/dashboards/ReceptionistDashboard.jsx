import { useEffect, useState } from 'react'
import api from '../api/axios'

function ReceptionistDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [appointments, setAppointments] = useState([])

  const [loading, setLoading] = useState(true)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)

  // Tracks only the appointment currently being checked in.
  const [checkingInId, setCheckingInId] = useState(null)

  const [error, setError] = useState('')
  const [appointmentError, setAppointmentError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [patient, setPatient] = useState('')
  const [doctor, setDoctor] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')

  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/receptionist/dashboard')

      setDashboard(response.data)
    } catch (error) {
      console.error('Receptionist dashboard error:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to access this dashboard.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to load dashboard data.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // LOAD APPOINTMENTS
  // ======================================================

  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true)
      setAppointmentError('')

      const response = await api.get(
        '/receptionist/appointments',
      )

      setAppointments(response.data || [])
    } catch (error) {
      console.error('Receptionist appointments error:', error)

      if (error.response?.status === 401) {
        setAppointmentError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setAppointmentError(
          'You do not have permission to view appointments.',
        )
      } else {
        setAppointmentError(
          error.response?.data?.message ||
            'Unable to load appointments.',
        )
      }
    } finally {
      setAppointmentsLoading(false)
    }
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadDashboard()
    loadAppointments()
  }, [])

  // ======================================================
  // SEARCH APPOINTMENTS
  // ======================================================

  const searchAppointments = async () => {
    try {
      setAppointmentsLoading(true)
      setAppointmentError('')
      setSuccessMessage('')

      const params = {}

      if (patient.trim()) {
        params.patient = patient.trim()
      }

      if (doctor.trim()) {
        params.doctor = doctor.trim()
      }

      if (status) {
        params.status = status
      }

      if (date) {
        params.date = date
      }

      const response = await api.get(
        '/receptionist/appointments/search',
        {
          params,
        },
      )

      setAppointments(response.data || [])
    } catch (error) {
      console.error('Appointment search error:', error)

      if (error.response?.status === 401) {
        setAppointmentError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setAppointmentError(
          'You do not have permission to search appointments.',
        )
      } else {
        setAppointmentError(
          error.response?.data?.message ||
            'Unable to search appointments.',
        )
      }
    } finally {
      setAppointmentsLoading(false)
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
    setSuccessMessage('')
    setAppointmentError('')

    await loadAppointments()
  }

  // ======================================================
  // CHECK IN PATIENT
  // ======================================================

  const checkInPatient = async (appointmentId) => {
    // Prevent accidental double-clicks.
    if (checkingInId) {
      return
    }

    try {
      setCheckingInId(appointmentId)
      setAppointmentError('')
      setSuccessMessage('')

      await api.put(
        `/appointments/${appointmentId}/check-in`,
      )

      /*
       * Update the appointment immediately in the UI.
       * We don't need to wait for the entire appointment
       * list to reload before showing the new status.
       */
      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: 'CHECKED_IN',
              }
            : appointment,
        ),
      )

      setSuccessMessage(
        'Patient checked in successfully.',
      )

      /*
       * Refresh only the dashboard statistics.
       * The appointment itself has already been updated
       * instantly above.
       */
      await loadDashboard()
    } catch (error) {
      console.error('Check-in error:', error)

      if (error.response?.status === 400) {
        setAppointmentError(
          error.response?.data?.message ||
            'This appointment cannot be checked in.',
        )
      } else if (error.response?.status === 401) {
        setAppointmentError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setAppointmentError(
          'You do not have permission to check in patients.',
        )
      } else {
        setAppointmentError(
          error.response?.data?.message ||
            'Unable to check in patient.',
        )
      }
    } finally {
      setCheckingInId(null)
    }
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-lg font-medium text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  // ======================================================
  // DASHBOARD ERROR
  // ======================================================

  if (error) {
    return (
      <div className="min-h-full bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">
              Dashboard Error
            </h1>

            <p className="mt-3 text-slate-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Try Again
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE TITLE */}

        <section className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Receptionist Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            {dashboard?.hospitalName || 'Hospital'} Â· Search, filter and check in patients.
          </p>
        </section>

        {/* STATS */}

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Appointment Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Total
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {dashboard?.totalAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-600">
                {dashboard?.pendingAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <p className="mt-3 text-3xl font-bold text-blue-600">
                {dashboard?.approvedAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Checked In
              </p>

              <p className="mt-3 text-3xl font-bold text-purple-600">
                {dashboard?.checkedInAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-bold text-green-600">
                {dashboard?.completedAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>

              <p className="mt-3 text-3xl font-bold text-red-600">
                {dashboard?.cancelledAppointments ?? 0}
              </p>
            </div>

          </div>
        </section>

        {/* APPOINTMENTS */}

        <section className="rounded-2xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Hospital Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter and check in patients.
            </p>
          </div>

          <div className="p-6">

            {/* FILTERS */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <input
                type="text"
                value={patient}
                onChange={(event) =>
                  setPatient(event.target.value)
                }
                placeholder="Search patient"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="text"
                value={doctor}
                onChange={(event) =>
                  setDoctor(event.target.value)
                }
                placeholder="Search doctor"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  All statuses
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="CHECKED_IN">
                  Checked In
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* BUTTONS */}

            <div className="mt-4 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={searchAppointments}
                disabled={appointmentsLoading}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {appointmentsLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Searching...
                  </span>
                ) : (
                  'Search'
                )}
              </button>

              <button
                type="button"
                onClick={clearFilters}
                disabled={appointmentsLoading}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

            </div>

            {/* SUCCESS */}

            {successMessage && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            {/* ERROR */}

            {appointmentError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {appointmentError}
              </div>
            )}

            {/* TABLE */}

            <div className="mt-6 overflow-x-auto">

              <table className="min-w-full text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">

                    <th className="px-4 py-4 font-semibold">
                      Patient
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Doctor
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Time
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Reason
                    </th>

                    <th className="px-4 py-4 font-semibold">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {appointmentsLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                          Loading appointments...
                        </div>
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-4 py-4 font-medium text-slate-900">
                          {appointment.patientName || 'â€”'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {appointment.doctorName || 'â€”'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {appointment.appointmentDate || 'â€”'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {appointment.appointmentTime || 'â€”'}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              appointment.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-700'
                                : appointment.status === 'CHECKED_IN'
                                  ? 'bg-purple-100 text-purple-700'
                                  : appointment.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-700'
                                    : appointment.status === 'CANCELLED' ||
                                        appointment.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {appointment.status
                              ? appointment.status.replaceAll('_', ' ')
                              : 'UNKNOWN'}
                          </span>

                        </td>

                        <td className="max-w-xs px-4 py-4 text-slate-600">
                          {appointment.reason || 'â€”'}
                        </td>

                        <td className="px-4 py-4">

                          {appointment.status === 'APPROVED' ? (
                            <button
                              type="button"
                              onClick={() =>
                                checkInPatient(
                                  appointment.id,
                                )
                              }
                              disabled={
                                checkingInId !== null
                              }
                              className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {checkingInId === appointment.id ? (
                                <>
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                  Checking...
                                </>
                              ) : (
                                'Check In'
                              )}
                            </button>
                          ) : appointment.status ===
                            'CHECKED_IN' ? (
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600">
                              <span className="h-2 w-2 rounded-full bg-purple-500" />
                              Checked In
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              â€”
                            </span>
                          )}

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default ReceptionistDashboard
