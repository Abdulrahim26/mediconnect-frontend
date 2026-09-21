import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function MedicalRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/medical-records/my-records')

        setRecords(response.data || [])
      } catch (error) {
        console.error('Medical records error:', error)

        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view medical records.',
          )
        } else {
          setError(
            error.response?.data?.message ||
              'Unable to load medical records.',
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return '—'
    }

    const date = new Date(dateTime)

    if (Number.isNaN(date.getTime())) {
      return dateTime
    }

    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">
          Loading medical records...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50 px-4">

        <section className="w-full max-w-lg rounded-2xl border border-mc-100 bg-white p-8 text-center shadow-lg">

          <h1 className="text-2xl font-bold text-red-600">
            Medical Records Error
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <Link
            to="/patient/dashboard"
            className="mt-6 inline-block rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
          >
            Back to Dashboard
          </Link>

        </section>

      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Medical Records
          </h1>

          <p className="mt-2 text-slate-600">
            View your medical history and records from completed appointments.
          </p>
        </header>

        {/* SUMMARY */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Records
            </p>

            <p className="mt-2 text-3xl font-bold text-mc-600">
              {records.length}
            </p>

          </div>

          <div className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Medical History
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {records.length > 0
                ? 'Records available'
                : 'No records yet'}
            </p>

          </div>

          <div className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Latest Record
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {records.length > 0
                ? formatDate(records[0].createdAt)
                : 'No records'}
            </p>

          </div>

        </section>

        {/* MEDICAL HISTORY */}
        <section className="overflow-hidden rounded-2xl border border-mc-100 bg-white shadow-sm">

          <div className="border-b border-mc-100 p-6">

            <h2 className="text-xl font-semibold text-slate-900">
              Medical History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your medical records from doctors you have consulted.
            </p>

          </div>

          {records.length === 0 ? (

            <div className="p-12 text-center">

              <h3 className="text-lg font-semibold text-slate-900">
                No medical records yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-600">
                Your medical records will appear here after a doctor
                completes an appointment and creates a record.
              </p>

              <Link
                to="/patient/appointments"
                className="mt-6 inline-block rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
              >
                View My Appointments
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-mc-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Diagnosis
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Treatment
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-mc-100">

                  {records.map((record) => (

                    <tr
                      key={record.id}
                      className="hover:bg-mc-50"
                    >

                      {/* DOCTOR */}
                      <td className="px-6 py-5">

                        <p className="font-semibold text-slate-900">
                          Dr. {record.doctorName || 'Unknown'}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Appointment
                        </p>

                        <p className="text-xs text-slate-500">
                          {record.appointmentId || '—'}
                        </p>

                      </td>

                      {/* DIAGNOSIS */}
                      <td className="max-w-xs px-6 py-5">

                        <p className="font-medium text-slate-900">
                          {record.diagnosis || '—'}
                        </p>

                        {record.symptoms && (
                          <p className="mt-1 truncate text-sm text-slate-500">
                            Symptoms: {record.symptoms}
                          </p>
                        )}

                      </td>

                      {/* TREATMENT */}
                      <td className="max-w-xs px-6 py-5">

                        <p className="text-slate-600">
                          {record.treatment || 'Not specified'}
                        </p>

                        {record.prescription && (
                          <p className="mt-1 truncate text-sm text-slate-500">
                            Prescription: {record.prescription}
                          </p>
                        )}

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(record.createdAt)}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">

                        <Link
                          to={`/patient/medical-records/${record.id}`}
                          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          View Record
                        </Link>

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

export default MedicalRecords