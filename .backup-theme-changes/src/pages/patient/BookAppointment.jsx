import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function BookAppointment() {
  const location = useLocation()
  const navigate = useNavigate()

  const doctor = location.state?.doctor

  const [form, setForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">
            Doctor Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            Please select a doctor before booking an appointment.
          </p>

          <button
            type="button"
            onClick={() => navigate('/patient/doctors')}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Find a Doctor
          </button>
        </section>
      </div>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/appointments', {
        doctorId: doctor.id,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason,
      })

      setSuccess('Appointment booked successfully!')

      setForm({
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
      })
    } catch (error) {
      console.error('Book appointment error:', error)

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
          'Invalid appointment information.'
        )
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError('You do not have permission to book an appointment.')
      } else {
        setError('Unable to book appointment.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate('/patient/doctors/details', {
            state: { doctor },
          })}
          className="mb-6 rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back to Doctor
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Book an Appointment
          </h1>

          <p className="mt-2 text-slate-600">
            Schedule an appointment with your preferred doctor.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8 rounded-xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>

            <p className="mt-1 font-medium text-blue-600">
              {doctor.specialty || 'General Medicine'}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {doctor.hospital || 'Hospital not specified'}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <p className="font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4">
              <p className="font-medium text-green-600">
                {success}
              </p>

              <button
                type="button"
                onClick={() => navigate('/patient/appointments')}
                className="mt-3 font-semibold text-green-700 underline"
              >
                View My Appointments
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="appointmentDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Appointment Date
                </label>

                <input
                  id="appointmentDate"
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="appointmentTime"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Appointment Time
                </label>

                <input
                  id="appointmentTime"
                  type="time"
                  name="appointmentTime"
                  value={form.appointmentTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            <div className="mt-5">
              <label
                htmlFor="reason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Reason for Visit
              </label>

              <textarea
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the reason for your appointment..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Booking Appointment...' : 'Confirm Appointment'}
            </button>

          </form>

        </section>
      </div>
    </div>
  )
}

export default BookAppointment