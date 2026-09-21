import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

function EditMedicalRecord() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState(null)

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: '',
    notes: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ==========================================
  // LOAD RECORD
  // ==========================================

  useEffect(() => {
    const loadRecord = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          `/medical-records/doctor/${id}`,
        )

        const data = response.data

        setRecord(data)

        setFormData({
          diagnosis: data.diagnosis || '',
          symptoms: data.symptoms || '',
          treatment: data.treatment || '',
          prescription: data.prescription || '',
          notes: data.notes || '',
        })
      } catch (error) {
        console.error('Load medical record error:', error)

        if (error.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to edit this medical record.',
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

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setSuccess('')
    setError('')
  }

  // ==========================================
  // UPDATE RECORD
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.diagnosis.trim()) {
      setError('Diagnosis is required.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await api.put(
        `/medical-records/${id}`,
        {
          appointmentId: record.appointmentId,
          diagnosis: formData.diagnosis,
          symptoms: formData.symptoms,
          treatment: formData.treatment,
          prescription: formData.prescription,
          notes: formData.notes,
        },
      )

      setSuccess('Medical record updated successfully.')

      // Give the user a moment to see success message
      setTimeout(() => {
        navigate(`/doctor/medical-records/${id}`)
      }, 800)
    } catch (error) {
      console.error('Update medical record error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to edit this medical record.',
        )
      } else if (error.response?.status === 404) {
        setError('Medical record not found.')
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to update the medical record.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50">
        <p className="text-lg text-slate-600">
          Loading medical record...
        </p>
      </div>
    )
  }

  // ==========================================
  // ERROR WITHOUT RECORD
  // ==========================================

  if (error && !record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-50 px-4">

        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Record
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <Link
              to="/doctor/medical-records"
              className="rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700"
            >
              Back to Records
            </Link>

            <Link
              to="/doctor/dashboard"
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
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Medical Record
          </h1>

          <p className="mt-2 text-slate-600">
            Update the clinical information for this patient.
          </p>
        </header>

        {/* PATIENT INFORMATION */}
        <section className="mb-6 rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Record Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Patient
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {record.patientName || 'Unknown patient'}
              </p>

            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Doctor
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                Dr. {record.doctorName || 'Unknown'}
              </p>

            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Appointment ID
              </p>

              <p className="mt-1 break-all text-sm text-slate-900">
                {record.appointmentId || '—'}
              </p>

            </div>

          </div>

        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="font-medium text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">

            <p className="font-medium text-green-700">
              {success}
            </p>

          </div>
        )}

        {/* FORM */}
          <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm"
        >

          {/* DIAGNOSIS */}
          <div className="mb-6">

            <label
              htmlFor="diagnosis"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Diagnosis *
            </label>

            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-xl border border-mc-100 px-4 py-3 text-slate-900 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100"
              placeholder="Enter the patient's diagnosis"
            />

          </div>

          {/* SYMPTOMS */}
          <div className="mb-6">

            <label
              htmlFor="symptoms"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Symptoms
            </label>

            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-mc-100 px-4 py-3 text-slate-900 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100"
              placeholder="Describe the patient's symptoms"
            />

          </div>

          {/* TREATMENT */}
          <div className="mb-6">

            <label
              htmlFor="treatment"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Treatment
            </label>

            <textarea
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-mc-100 px-4 py-3 text-slate-900 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100"
              placeholder="Describe the recommended treatment"
            />

          </div>

          {/* PRESCRIPTION */}
          <div className="mb-6">

            <label
              htmlFor="prescription"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Prescription
            </label>

            <textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-mc-100 px-4 py-3 text-slate-900 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100"
              placeholder="Enter prescription information"
            />

          </div>

          {/* NOTES */}
          <div className="mb-8">

            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Doctor's Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-mc-100 px-4 py-3 text-slate-900 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100"
              placeholder="Add any additional clinical notes"
            />

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-mc-100 pt-6 sm:flex-row sm:justify-between">

            <Link
              to="/doctor/medical-records"
              className="rounded-lg bg-mc-50 px-5 py-3 text-center font-semibold text-mc-700 hover:bg-mc-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-mc-600 px-6 py-3 font-semibold text-white hover:bg-mc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default EditMedicalRecord