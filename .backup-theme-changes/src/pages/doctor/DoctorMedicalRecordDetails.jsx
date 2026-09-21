import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'

function DoctorMedicalRecordDetails() {
  const { id } = useParams()

  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecord = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/medical-records/doctor/${id}`)

        setRecord(response.data)
      } catch (error) {
        console.error('Doctor medical record details error:', error)

        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view this medical record.',
          )
        } else if (error.response?.status === 404) {
          setError('Medical record not found.')
        } else {
          setError(
            error.response?.data?.message ||
              'Unable to load medical record.',
          )
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadRecord()
    }
  }, [id])

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
      <div className="flex min-h-screen items-center justify-center bg-mc-50">
        <p className="text-lg text-slate-600">
          Loading medical record...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50 p-6">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Record
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
            >
              Try Again
            </button>

            <Link
              to="/doctor/medical-records"
              className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-700"
            >
              Back to Records
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (!record) {
    return null
  }

  return (
    <div className="min-h-full bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Medical Record Details
          </h1>

          <p className="mt-2 text-slate-600">
            View the complete medical record for your patient.
          </p>
        </header>

        {/* PATIENT / DOCTOR INFORMATION */}
        <section className="mb-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Patient
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {record.patientName || '—'}
            </h2>
          </div>

          <div className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Doctor
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Dr. {record.doctorName || '—'}
            </h2>
          </div>

        </section>

        {/* RECORD INFORMATION */}
        <section className="overflow-hidden rounded-2xl border border-mc-100 bg-white shadow-sm">

          <div className="border-b border-mc-100 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Clinical Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete details of the medical record.
            </p>
          </div>

          <div className="space-y-6 p-6">

            {/* DIAGNOSIS */}
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Diagnosis
              </p>

              <div className="mt-2 rounded-xl bg-mc-50 p-4">
                <p className="whitespace-pre-wrap text-slate-900">
                  {record.diagnosis || 'Not specified'}
                </p>
              </div>
            </div>

            {/* SYMPTOMS */}
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Symptoms
              </p>

              <div className="mt-2 rounded-xl bg-mc-50 p-4">
                <p className="whitespace-pre-wrap text-slate-900">
                  {record.symptoms || 'Not specified'}
                </p>
              </div>
            </div>

            {/* TREATMENT */}
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Treatment
              </p>

              <div className="mt-2 rounded-xl bg-mc-50 p-4">
                <p className="whitespace-pre-wrap text-slate-900">
                  {record.treatment || 'Not specified'}
                </p>
              </div>
            </div>

            {/* PRESCRIPTION */}
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Prescription
              </p>

              <div className="mt-2 rounded-xl bg-mc-50 p-4">
                <p className="whitespace-pre-wrap text-slate-900">
                  {record.prescription || 'Not specified'}
                </p>
              </div>
            </div>

            {/* NOTES */}
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Doctor's Notes
              </p>

              <div className="mt-2 rounded-xl bg-mc-50 p-4">
                <p className="whitespace-pre-wrap text-slate-900">
                  {record.notes || 'No notes added'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* RECORD METADATA */}
        <section className="mt-6 rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Record Information
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Record ID
              </p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {record.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Appointment ID
              </p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {record.appointmentId || '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {formatDate(record.createdAt)}
              </p>
            </div>

          </div>

        </section>

        {/* BOTTOM ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            to="/doctor/medical-records"
            className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Back to Medical Records
          </Link>

          <Link
            to={`/doctor/medical-records/${record.id}/edit`}
            className="rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
          >
            Edit This Record
          </Link>

        </div>

      </div>
    </div>
  )
}

export default DoctorMedicalRecordDetails