import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

function EditHospital() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/hospitals/${id}`)

        setFormData({
          name: response.data.name || '',
          location: response.data.location || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
        })
      } catch (err) {
        console.error('Error fetching hospital:', err)

        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this hospital.')
        } else if (err.response?.status === 404) {
          setError('Hospital not found.')
        } else if (err.response?.data?.message) {
          setError(err.response.data.message)
        } else {
          setError('Failed to load hospital information.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Hospital name is required.')
      return
    }

    if (!formData.location.trim()) {
      setError('Location is required.')
      return
    }

    setSaving(true)

    try {
      await api.put(`/hospitals/${id}`, {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
      })

      setSuccess('Hospital updated successfully.')

      setTimeout(() => {
        navigate('/super-admin/hospitals')
      }, 1000)
    } catch (err) {
      console.error('Error updating hospital:', err)

      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to update this hospital.')
      } else if (err.response?.status === 404) {
        setError('Hospital not found.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Failed to update hospital. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading hospital information...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/super-admin/hospitals"
            className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Hospitals
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <Link
            to="/super-admin/hospitals"
            className="mb-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Hospitals
          </Link>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Edit Hospital
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the hospital's information and contact details.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Hospital Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Hospital Name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter hospital name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Location <span className="text-red-500">*</span>
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter hospital location"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter the hospital's full address"
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="hospital@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/super-admin/hospitals"
                className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditHospital
