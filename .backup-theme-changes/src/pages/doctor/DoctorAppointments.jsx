import { useEffect, useState } from 'react'
import api from '../../api/axios'

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/appointments/doctor')

      setAppointments(response.data || [])
    } catch (error) {
      console.error('Doctor appointments error:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError('You do not have permission to manage appointments.')
      } else {
        setError('Unable to load appointments.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadAppointments()
    }

    load()
  }, [])

  const handleAction = async (id, action) => {
    try {
      await api.put(`/appointments/${id}/${action}`)

      await loadAppointments()
    } catch (error) {
      console.error(`Appointment ${action} error:`, error)
      setError(`Unable to ${action} appointment.`)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50">
        <p className="text-lg text-slate-600">
          Loading appointments...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mc-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-mc-100 bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAppointments}
            className="mt-5 rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Appointments
          </h1>

          <p className="mt-2 text-slate-600">
            Approve, reject, complete, or cancel patient appointments.
          </p>
        </header>

        <section className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          {appointments.length === 0 ? (
            <div className="rounded-xl bg-mc-50 p-8 text-center">
              <p className="text-mc-700">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-mc-100">

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Patient
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Time
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Reason
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-mc-100"
                    >

                      <td className="px-4 py-4 font-medium text-slate-900">
                        {appointment.patientName}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.appointmentDate}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.appointmentTime}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.reason}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-mc-50 px-3 py-1 text-sm font-medium text-mc-700">
                          {appointment.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex flex-wrap gap-2">

                          {appointment.status === 'PENDING' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAction(
                                    appointment.id,
                                    'approve'
                                  )
                                }
                                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAction(
                                    appointment.id,
                                    'reject'
                                  )
                                }
                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {appointment.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAction(
                                  appointment.id,
                                  'complete'
                                )
                              }
                              className="rounded-lg bg-mc-600 px-3 py-2 text-sm font-semibold text-white hover:bg-mc-700"
                            >
                              Complete
                            </button>
                          )}

                          {appointment.status === 'CHECKED_IN' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAction(
                                  appointment.id,
                                  'complete'
                                )
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              Complete
                            </button>
                          )}

                          {(appointment.status === 'PENDING' ||
                            appointment.status === 'APPROVED') && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAction(
                                  appointment.id,
                                  'doctor-cancel'
                                )
                              }
                              className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                              Cancel
                            </button>
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

      </div>
    </div>
  )
}

export default DoctorAppointments