import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
}

function AdminReceptionists() {
  const [receptionists, setReceptionists] = useState([])
  const [form, setForm] = useState(emptyForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadReceptionists = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/receptionists')

      setReceptionists(response.data || [])
    } catch (error) {
      console.error('Receptionists error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to manage receptionists.',
        )
      } else {
        setError('Unable to load receptionists.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadReceptionists()
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

  const resetForm = () => {
    setForm(emptyForm)
    setShowPassword(false)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await api.post('/receptionists', form)

      setSuccess(
        'Receptionist created successfully.',
      )

      setForm(emptyForm)
      setShowPassword(false)

      await loadReceptionists()
    } catch (error) {
      console.error('Receptionist save error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to create receptionists.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to create receptionist.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-blue-50/40 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE TITLE */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Receptionist Management
          </h1>

          <p className="mt-2 text-slate-600">
            Create and manage receptionists in your hospital.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* RECEPTIONIST FORM */}

        <section className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Create Receptionist
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={saving}
                className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
              />

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={saving}
                className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={saving}
                className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
              />

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                disabled={saving}
                className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
              />

              <div className="relative md:col-span-2">
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Receptionist login password"
                  required
                  disabled={saving}
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous,
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-blue-600"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Creating...'
                  : 'Create Receptionist'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-blue-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-blue-50 disabled:opacity-50"
              >
                Clear
              </button>

            </div>

          </form>
        </section>

        {/* RECEPTIONIST LIST */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

          <div className="border-b border-blue-100 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Hospital Receptionists
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {receptionists.length} receptionist
              {receptionists.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading receptionists...
            </div>
          ) : receptionists.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No receptionists found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-blue-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Receptionist
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Hospital
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-blue-100">

                  {receptionists.map((receptionist) => (
                    <tr
                      key={receptionist.id}
                      className="hover:bg-blue-50/50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {receptionist.firstName}{' '}
                        {receptionist.lastName}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {receptionist.email || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {receptionist.phone || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {receptionist.hospitalName || '—'}
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

export default AdminReceptionists