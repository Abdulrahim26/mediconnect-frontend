import { useEffect, useState } from 'react'
import api from '../../api/axios'

function DoctorWaitingQueue() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchQueue = async () => {
      try {
        const response = await api.get('/appointments/waiting')

        if (mounted) {
          setAppointments(response.data || [])
        }
      } catch (error) {
        console.error('Waiting queue error:', error)

        if (mounted) {
          setError(
            error.response?.data?.message ||
            'Unable to load waiting queue.'
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchQueue()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">
          Loading waiting queue...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Waiting Queue
          </h1>

          <p className="mt-2 text-slate-600">
            Patients currently waiting to be attended to.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <p className="text-sm text-slate-500">
              Patients Waiting
            </p>
            <p className="mt-1 text-3xl font-bold text-mc-600">
              {appointments.length}
            </p>
          </div>

          {appointments.length === 0 ? (
            <div className="rounded-xl bg-mc-50 p-8 text-center">
              <p className="text-mc-700">
                No patients are currently waiting.
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
                        <span className="rounded-full bg-mc-50 px-3 py-1 text-sm font-semibold text-mc-700">
                          {appointment.status}
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

export default DoctorWaitingQueue