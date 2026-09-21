import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

function EditHospitalAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [hospitals, setHospitals] = useState([])
  const [formData, setFormData] = useState({
    email: '',
    hospitalId: '',
    password: '',
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [adminResponse, hospitalsResponse] = await Promise.all([
          api.get(`/hospital-admins/${id}`),
          api.get('/hospitals'),
        ])

        const admin = adminResponse.data

        setFormData({
          email: admin.email || '',
          hospitalId: admin.hospitalId || '',
          password: '',
        })

        setHospitals(hospitalsResponse.data)
      } catch (err) {
        console.error(
          'Error loading hospital administrator:',
          err,
        )

        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else if (err.response?.status === 403) {
          setError(
            'You do not have permission to edit hospital administrators.',
          )
        } else if (err.response?.status === 404) {
          setError('Hospital administrator not found.')
        } else if (err.response?.data?.message) {
          setError(err.response.data.message)
        } else {
          setError(
            'Failed to load hospital administrator information.',
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
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

    const email = formData.email.trim()

    if (!email) {
      setError('Email address is required.')
      return
    }

    if (!formData.hospitalId) {
      setError('Please select a hospital.')
      return
    }

    if (
      formData.password &&
      formData.password.length < 6
    ) {
      setError(
        'Password must be at least 6 characters long.',
      )
      return
    }

    try {
      setSubmitting(true)

      await api.put(`/hospital-admins/${id}`, {
        email,
        hospitalId: formData.hospitalId,
        password: formData.password || null,
      })

      setSuccess(
        'Hospital administrator updated successfully.',
      )

      setTimeout(() => {
        navigate(`/super-admin/hospital-admins/${id}`)
      }, 800)
    } catch (err) {
      console.error(
        'Error updating hospital administrator:',
        err,
      )

      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            'Please check the information you entered.',
        )
      } else if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to edit hospital administrators.',
        )
      } else if (err.response?.status === 404) {
        setError('Hospital administrator not found.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(
          'Failed to update hospital administrator. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm text-slate-500">
              Loading administrator information...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData.email) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to={`/super-admin/hospital-admins/${id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Administrator Details
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load administrator
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <Link
              to="/super-admin/hospital-admins"
              className="mt-5 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Return to Administrators
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            to={`/super-admin/hospital-admins/${id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Administrator Details
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            Edit Hospital Administrator
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the administrator account and hospital assignment.
          </p>
        </div>

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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                placeholder="admin@hospital.com"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                This email address is used to sign in to the administrator account.
              </p>
            </div>

            <div>
              <label
                htmlFor="hospitalId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Hospital
              </label>

              <select
                id="hospitalId"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="">
                  Select a hospital
                </option>

                {hospitals.map((hospital) => (
                  <option
                    key={hospital.id}
                    value={hospital.id}
                  >
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Leave this field blank if you do not want to change the password.
                If provided, the password must contain at least 6 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  HOSPITAL_ADMIN
                </span>

                <span className="ml-3 text-sm text-slate-500">
                  Role cannot be changed
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <Link
                to={`/super-admin/hospital-admins/${id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Saving Changes...'
                  : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditHospitalAdmin

