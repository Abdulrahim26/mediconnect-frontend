import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const initialForm = {
  appointmentId: '',
  diagnosis: '',
  symptoms: '',
  treatment: '',
  prescription: '',
  notes: '',
}

function CreateMedicalRecord() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState(initialForm)

  const [loadingAppointments, setLoadingAppointments] =
    useState(true)

  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let mounted = true

    const loadAppointments = async () => {
      try {
        setLoadingAppointments(true)
        setError('')

        const response = await api.get('/appointments/doctor')

        if (mounted) {
          const completedAppointments = (
            response.data || []
          ).filter(
            (appointment) =>
              appointment.status === 'COMPLETED',
          )

          setAppointments(completedAppointments)
        }
      } catch (error) {
        console.error(
          'Completed appointments error:',
          error,
        )

        if (mounted) {
          if (error.response?.status === 401) {
            setError(
              'Your session has expired. Please log in again.',
            )
          } else if (error.response?.status === 403) {
            setError(
              'You do not have permission to create medical records.',
            )
          } else {
            setError(
              error.response?.data?.message ||
                'Unable to load completed appointments.',
            )
          }
        }
      } finally {
        if (mounted) {
          setLoadingAppointments(false)
        }
      }
    }

    loadAppointments()

    return () => {
      mounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!form.appointmentId) {
      setError(
        'Please select a completed appointment.',
      )
      return
    }

    if (!form.diagnosis.trim()) {
      setError('Diagnosis is required.')
      return
    }

    try {
      setSubmitting(true)

      await api.post('/medical-records', {
        appointmentId: form.appointmentId,
        diagnosis: form.diagnosis.trim(),
        symptoms: form.symptoms.trim(),
        treatment: form.treatment.trim(),
        prescription: form.prescription.trim(),
        notes: form.notes.trim(),
      })

      setSuccess(
        'Medical record created successfully.',
      )

      setForm(initialForm)

      setTimeout(() => {
        navigate('/doctor/medical-records')
      }, 1000)
    } catch (error) {
      console.error(
        'Create medical record error:',
        error,
      )

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            'Unable to create the medical record. Please check the information and try again.',
        )
      } else if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to create this medical record.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to create medical record.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="mb-8">
          <Link
            to="/doctor/medical-records"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            â† Back to Medical Records
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Create Medical Record
          </h1>

          <p className="mt-2 text-slate-600">
            Create a medical record for a completed
            patient appointment.
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* FORM */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <form onSubmit={handleSubmit}>

            {/* APPOINTMENT */}
            <div className="mb-6">

              <label
                htmlFor="appointmentId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Completed Appointment
              </label>

              {loadingAppointments ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  Loading completed appointments...
                </div>
              ) : appointments.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="font-medium text-amber-800">
                    No completed appointments are
                    available.
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    A medical record can only be created
                    after an appointment has been
                    completed.
                  </p>

                  <Link
                    to="/doctor/appointments"
                    className="mt-3 inline-block font-semibold text-amber-800 underline"
                  >
                    View Appointments
                  </Link>
                </div>
              ) : (
                <>
                  <select
                    id="appointmentId"
                    name="appointmentId"
                    value={form.appointmentId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">
                      Select a completed appointment
                    </option>

                    {appointments.map(
                      (appointment) => (
                        <option
                          key={appointment.id}
                          value={appointment.id}
                        >
                          {appointment.patientName ||
                            'Patient'}{' '}
                          â€”{' '}
                          {appointment.appointmentDate}{' '}
                          at{' '}
                          {appointment.appointmentTime}
                        </option>
                      ),
                    )}
                  </select>

                  <p className="mt-2 text-sm text-slate-500">
                    Only completed appointments are
                    available for medical record creation.
                  </p>
                </>
              )}

            </div>

            {/* DIAGNOSIS */}
            <div className="mb-6">

              <label
                htmlFor="diagnosis"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Diagnosis
              </label>

              <textarea
                id="diagnosis"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter the patient's diagnosis..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                value={form.symptoms}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the patient's symptoms..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                value={form.treatment}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the recommended treatment..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                value={form.prescription}
                onChange={handleChange}
                rows="4"
                placeholder="Enter prescribed medication or instructions..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* NOTES */}
            <div className="mb-8">

              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Add any additional clinical notes..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/doctor/medical-records"
                className="rounded-lg bg-slate-200 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingAppointments ||
                  appointments.length === 0
                }
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? 'Creating Record...'
                  : 'Create Medical Record'}
              </button>

            </div>

          </form>

        </section>

      </div>
    </div>
  )
}

export default CreateMedicalRecord
