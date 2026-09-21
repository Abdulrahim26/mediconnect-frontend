import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
  firstName: '',
  lastName: '',
  phone: '',
  qualification: '',
  consultationFee: '',
  specialty: '',
}

function DoctorProfile() {
  const [form, setForm] = useState(emptyForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/doctors/profile')

      const doctor = response.data

      setForm({
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phone: doctor.phone || '',
        qualification: doctor.qualification || '',
        consultationFee: doctor.consultationFee ?? '',
        specialty: doctor.specialty || '',
      })
    } catch (error) {
      console.error('Doctor profile error:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view your profile.')
      } else {
        setError('Unable to load your profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadProfile()
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        qualification: form.qualification,
        consultationFee:
          form.consultationFee === ''
            ? null
            : Number(form.consultationFee),
        specialty: form.specialty,
      }

      const response = await api.put('/doctors/profile', data)

      const doctor = response.data

      setForm({
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phone: doctor.phone || '',
        qualification: doctor.qualification || '',
        consultationFee: doctor.consultationFee ?? '',
        specialty: doctor.specialty || '',
      })

      setSuccess('Profile updated successfully.')
    } catch (error) {
      console.error('Doctor profile update error:', error)

      setError(
        error.response?.data?.message ||
          'Unable to update your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">
          Loading profile...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Profile
          </h1>

          <p className="mt-2 text-slate-600">
            View and update your professional information.
          </p>
        </header>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-mc-100 bg-white p-6 shadow-sm">

          <form onSubmit={handleSubmit}>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Specialty
                </label>

                <input
                  type="text"
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Qualification
                </label>

                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Consultation Fee
                </label>

                <input
                  type="number"
                  name="consultationFee"
                  value={form.consultationFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600"
                />
              </div>

            </div>

            <div className="mt-6">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-mc-600 px-6 py-3 font-semibold text-white hover:bg-mc-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>

          </form>

        </section>

      </div>
    </div>
  )
}

export default DoctorProfile