import { useEffect, useState } from 'react'
import api from '../../api/axios'

const getStatusClasses = (status) => {
  switch (status) {
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

const emptyForm = {
  appointmentDate: '',
  appointmentTime: '',
}

function PatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeView, setActiveView] = useState('all')

  const [reschedulingId, setReschedulingId] = useState(null)
  const [rescheduleForm, setRescheduleForm] = useState(emptyForm)
  const [rescheduling, setRescheduling] = useState(false)

  // ======================================================
  // LOAD APPOINTMENTS
  // ======================================================
  const loadAppointments = async (view = 'all') => {
    try {
      setLoading(true)
      setError('')

      let endpoint = '/appointments/my'

      if (view === 'upcoming') {
        endpoint = '/appointments/upcoming'
      }

      if (view === 'history') {
        endpoint = '/appointments/history'
      }

      const response = await api.get(endpoint)

      setAppointments(response.data || [])
    } catch (error) {
      console.error('Patient appointments error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to view your appointments.',
        )
      } else {
        setError('Unable to load your appointments.')
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

    const fetchInitialAppointments = async () => {
      try {
        const response = await api.get('/appointments/my')

        if (!cancelled) {
          setAppointments(response.data || [])
          setError('')
          setLoading(false)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          'Initial patient appointments error:',
          error,
        )

        if (error.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view your appointments.',
          )
        } else {
          setError('Unable to load your appointments.')
        }

        setLoading(false)
      }
    }

    fetchInitialAppointments()

    return () => {
      cancelled = true
    }
  }, [])

  // ======================================================
  // CHANGE APPOINTMENT VIEW
  // ======================================================
  const handleViewChange = async (view) => {
    setActiveView(view)

    await loadAppointments(view)
  }

  // ======================================================
  // CANCEL APPOINTMENT
  // ======================================================
  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await api.put(
        `/appointments/${appointmentId}/cancel`,
      )

      await loadAppointments(activeView)
    } catch (error) {
      console.error('Cancel appointment error:', error)

      setError(
        error.response?.data?.message ||
          'Unable to cancel appointment.',
      )
    }
  }

  // ======================================================
  // OPEN RESCHEDULE MODAL
  // ======================================================
  const openReschedule = (appointment) => {
    setReschedulingId(appointment.id)

    setRescheduleForm({
      appointmentDate:
        appointment.appointmentDate || '',
      appointmentTime:
        appointment.appointmentTime || '',
    })

    setError('')
  }

  // ======================================================
  // CLOSE RESCHEDULE MODAL
  // ======================================================
  const closeReschedule = () => {
    setReschedulingId(null)
    setRescheduleForm(emptyForm)
  }

  // ======================================================
  // HANDLE RESCHEDULE FORM
  // ======================================================
  const handleRescheduleChange = (event) => {
    const { name, value } = event.target

    setRescheduleForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // ======================================================
  // RESCHEDULE APPOINTMENT
  // ======================================================
  const handleReschedule = async (event) => {
    event.preventDefault()

    if (!reschedulingId) {
      return
    }

    try {
      setRescheduling(true)
      setError('')

      await api.put(
        `/appointments/${reschedulingId}/reschedule`,
        rescheduleForm,
      )

      closeReschedule()

      await loadAppointments(activeView)
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
          'Unable to reschedule appointment.',
      )
    } finally {
      setRescheduling(false)
    }
  }

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">
          Loading your appointments...
        </p>
      </div>
    )
  }

  // ======================================================
  // PAGE
  // ======================================================
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage your upcoming and previous appointments.
          </p>
        </header>

        {/* ==================================================
            ERROR
        ================================================== */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            APPOINTMENT FILTERS
        ================================================== */}
        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => handleViewChange('all')}
              className={`rounded-lg px-5 py-3 font-semibold ${
                activeView === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Appointments
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('upcoming')}
              className={`rounded-lg px-5 py-3 font-semibold ${
                activeView === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Upcoming
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('history')}
              className={`rounded-lg px-5 py-3 font-semibold ${
                activeView === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              History
            </button>

          </div>

        </section>

        {/* ==================================================
            APPOINTMENTS
        ================================================== */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <h2 className="text-xl font-semibold text-slate-900">
              {activeView === 'all'
                ? 'All Appointments'
                : activeView === 'upcoming'
                  ? 'Upcoming Appointments'
                  : 'Appointment History'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {appointments.length} appointment
              {appointments.length !== 1 ? 's' : ''}
            </p>

          </div>

          {appointments.length === 0 ? (
            <div className="p-10 text-center">

              <p className="text-slate-600">
                No appointments found.
              </p>

              <a
                href="/patient/doctors"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Find a Doctor
              </a>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">

                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">
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

                      <td className="max-w-xs px-6 py-4 text-slate-600">
                        {appointment.reason || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status
                            ? appointment.status.replace(
                                '_',
                                ' ',
                              )
                            : 'UNKNOWN'}
                        </span>
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          {/* PENDING / APPROVED */}
                          {(appointment.status === 'PENDING' ||
                            appointment.status === 'APPROVED') && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  openReschedule(
                                    appointment,
                                  )
                                }
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    appointment.id,
                                  )
                                }
                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {/* CHECKED IN */}
                          {appointment.status ===
                            'CHECKED_IN' && (
                            <span className="text-sm font-semibold text-purple-600">
                              Checked In
                            </span>
                          )}

                          {/* COMPLETED */}
                          {appointment.status ===
                            'COMPLETED' && (
                            <span className="text-sm font-semibold text-green-600">
                              Completed
                            </span>
                          )}

                          {/* CANCELLED */}
                          {appointment.status ===
                            'CANCELLED' && (
                            <span className="text-sm font-semibold text-red-600">
                              Cancelled
                            </span>
                          )}

                          {/* REJECTED */}
                          {appointment.status ===
                            'REJECTED' && (
                            <span className="text-sm font-semibold text-red-600">
                              Rejected
                            </span>
                          )}

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ==================================================
            RESCHEDULE MODAL
        ================================================== */}
        {reschedulingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Reschedule Appointment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a new date and time for your
                  appointment.
                </p>

              </div>

              <form onSubmit={handleReschedule}>

                <div className="space-y-4">

                  {/* DATE */}
                  <div>
                    <label
                      htmlFor="appointmentDate"
                      className="mb-1 block text-sm font-semibold text-slate-700"
                    >
                      Appointment Date
                    </label>

                    <input
                      id="appointmentDate"
                      type="date"
                      name="appointmentDate"
                      value={
                        rescheduleForm.appointmentDate
                      }
                      onChange={handleRescheduleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* TIME */}
                  <div>
                    <label
                      htmlFor="appointmentTime"
                      className="mb-1 block text-sm font-semibold text-slate-700"
                    >
                      Appointment Time
                    </label>

                    <input
                      id="appointmentTime"
                      type="time"
                      name="appointmentTime"
                      value={
                        rescheduleForm.appointmentTime
                      }
                      onChange={handleRescheduleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                </div>

                {/* MODAL ACTIONS */}
                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closeReschedule}
                    disabled={rescheduling}
                    className="rounded-lg bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={rescheduling}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {rescheduling
                      ? 'Rescheduling...'
                      : 'Confirm Reschedule'}
                  </button>

                </div>

              </form>

            </section>

          </div>
        )}

      </div>
    </div>
  )
}

export default PatientAppointments