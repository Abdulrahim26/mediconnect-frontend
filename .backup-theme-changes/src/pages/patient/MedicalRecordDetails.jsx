import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'

function MedicalRecordDetails() {
  const { id } = useParams()

  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecord = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          `/medical-records/my-records/${id}`,
        )

        setRecord(response.data)
      } catch (error) {
        console.error('Medical record details error:', error)

        if (error.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view this medical record.',
          )
        } else if (error.response?.status === 404) {
          setError('Medical record not found.')
        } else {
          setError(
            error.response?.data?.message ||
              'Unable to load the medical record.',
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
      return 'Not available'
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
          Loading medical record...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50 px-4">

        <section className="w-full max-w-lg rounded-2xl border border-mc-100 bg-white p-8 text-center shadow-lg">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Record
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <Link
              to="/patient/medical-records"
              className="rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
            >
              Back to Medical Records
            </Link>

            <Link
              to="/patient/dashboard"
              className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
            >
              Dashboard
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
            Medical Record
          </h1>

          <p className="mt-2 text-slate-600">
            View the details of your medical record.
          </p>
        </header>

        {/* RECORD INFORMATION */}
        <section className="mb-6 rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Record Information
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Patient
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {record.patientName || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Doctor
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                Dr. {record.doctorName || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Appointment ID
              </p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {record.appointmentId || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Record Created
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {formatDate(record.createdAt)}
              </p>
            </div>

          </div>

        </section>

        {/* DIAGNOSIS */}
        <section className="mb-6 rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Diagnosis
          </h2>

          <div className="mt-4 rounded-xl bg-mc-50 p-5">

            <p className="whitespace-pre-wrap text-slate-800">
              {record.diagnosis || 'No diagnosis recorded.'}
            </p>

          </div>

        </section>

        {/* SYMPTOMS */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Symptoms
          </h2>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {record.symptoms || 'No symptoms recorded.'}
          </p>

        </section>

        {/* TREATMENT */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Treatment
          </h2>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {record.treatment || 'No treatment recorded.'}
          </p>

        </section>

        {/* PRESCRIPTION */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Prescription
          </h2>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {record.prescription || 'No prescription recorded.'}
          </p>

        </section>

        {/* NOTES */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Doctor's Notes
          </h2>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {record.notes || 'No additional notes recorded.'}
          </p>

        </section>

        {/* FOOTER NAVIGATION */}
        <div className="flex flex-wrap justify-between gap-3">

          <Link
            to="/patient/medical-records"
            className="rounded-lg bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
          >
            ← Back to Medical Records
          </Link>

          <Link
            to="/patient/dashboard"
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>
    </div>
  )
}

export default MedicalRecordDetails