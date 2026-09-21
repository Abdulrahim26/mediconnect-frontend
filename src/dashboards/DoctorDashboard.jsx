import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true)

        const response = await api.get('/appointments/doctor')

        setAppointments(response.data || [])
      } catch (error) {
        console.error('Doctor appointments error:', error)

        if (error.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view these appointments.',
          )
        } else {
          setError('Unable to load appointments.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'PENDING',
  )

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === 'APPROVED',
  )

  const checkedInAppointments = appointments.filter(
    (appointment) => appointment.status === 'CHECKED_IN',
  )

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'COMPLETED',
  )

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-6 bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading doctor dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage appointments, patient waiting queues, and medical records.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Link
            to="/doctor/appointments"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Manage Appointments
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Approve, reject, and complete patient appointments.
            </p>
          </Link>

          <Link
            to="/doctor/waiting"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Waiting Queue
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              View patients who have checked in and are waiting.
            </p>
          </Link>

          <Link
            to="/doctor/medical-records"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Medical Records
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              View, create, and manage medical records for your patients.
            </p>
          </Link>

          <Link
            to="/doctor/profile"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">
              My Profile
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              View and update your professional profile.
            </p>
          </Link>

        </div>

        <section className="mb-8">

          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Appointment Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {appointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-600">
                {pendingAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <p className="mt-3 text-3xl font-bold text-blue-600">
                {approvedAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Checked In
              </p>

              <p className="mt-3 text-3xl font-bold text-purple-600">
                {checkedInAppointments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-bold text-green-600">
                {completedAppointments.length}
              </p>
            </div>

          </div>

        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            My Appointments
          </h2>

          {appointments.length === 0 ? (

            <div className="rounded-xl bg-slate-50 p-8 text-center">
              <p className="text-slate-600">
                No appointments found.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-slate-200">

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
                      className="border-b border-slate-100"
                    >

                      <td className="px-4 py-4 font-medium text-slate-900">
                        {appointment.patientName || 'â€”'}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.appointmentDate || 'â€”'}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.appointmentTime || 'â€”'}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {appointment.reason || 'â€”'}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
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

export default DoctorDashboard
