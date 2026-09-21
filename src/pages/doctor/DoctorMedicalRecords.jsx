import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function DoctorMedicalRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchRecords = async () => {
      try {
        const response = await api.get('/medical-records/doctor')

        if (mounted) {
          setRecords(response.data || [])
        }
      } catch (error) {
        console.error('Doctor medical records error:', error)

        if (mounted) {
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
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchRecords()

    return () => {
      mounted = false
    }
  }, [])

  const loadRecords = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/medical-records/doctor')

      setRecords(response.data || [])
    } catch (error) {
      console.error('Doctor medical records error:', error)

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

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return 'â€”'
    }

    const date = new Date(dateTime)

    if (Number.isNaN(date.getTime())) {
      return dateTime
    }

    return date.toLocaleString()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading medical records...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Medical Records
            </h1>

            <p className="mt-2 text-slate-600">
              Manage medical records created for your patients.
            </p>
          </div>

          <Link
            to="/doctor/medical-records/create"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Create Record
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadRecords}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* SUMMARY */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Records
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {records.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Patient Records
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {records.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

        {/* RECORDS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              My Medical Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Records you have created for completed appointments.
            </p>
          </div>

          {records.length === 0 ? (

            <div className="p-12 text-center">

              <h3 className="text-lg font-semibold text-slate-900">
                No medical records yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-600">
                Once you create medical records for completed
                appointments, they will appear here.
              </p>

              <Link
                to="/doctor/medical-records/create"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Create Medical Record
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Diagnosis
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Treatment
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Created
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-200">

                  {records.map((record) => (

                    <tr
                      key={record.id}
                      className="hover:bg-slate-50"
                    >

                      {/* PATIENT */}
                      <td className="px-6 py-5">

                        <p className="font-semibold text-slate-900">
                          {record.patientName || 'Unknown patient'}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Appointment ID
                        </p>

                        <p className="text-xs text-slate-500">
                          {record.appointmentId || 'â€”'}
                        </p>

                      </td>

                      {/* DIAGNOSIS */}
                      <td className="max-w-xs px-6 py-5">

                        <p className="font-medium text-slate-900">
                          {record.diagnosis || 'â€”'}
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

                      {/* CREATED */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(record.createdAt)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex flex-wrap gap-2">

                          <Link
                            to={`/doctor/medical-records/${record.id}`}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            View
                          </Link>

                          <Link
                            to={`/doctor/medical-records/${record.id}/edit`}
                            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Edit
                          </Link>

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
    </main>
  )
}
export default DoctorMedicalRecords
