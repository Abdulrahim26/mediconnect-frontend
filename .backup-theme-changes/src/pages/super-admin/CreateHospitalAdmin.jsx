import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function CreateHospitalAdmin() {
  const navigate = useNavigate()

  const [hospitals, setHospitals] = useState([])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hospitalId: '',
  })

  const [loadingHospitals, setLoadingHospitals] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ======================================================
  // LOAD HOSPITALS
  // ======================================================

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoadingHospitals(true)
        setError('')

        const response = await api.get('/hospitals')

        setHospitals(response.data)
      } catch (err) {
        console.error('Error fetching hospitals:', err)

        if (err.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (err.response?.status === 403) {
          setError(
            'You do not have permission to access hospitals.',
          )
        } else if (err.response?.data?.message) {
          setError(err.response.data.message)
        } else {
          setError('Failed to load hospitals.')
        }
      } finally {
        setLoadingHospitals(false)
      }
    }

    fetchHospitals()
  }, [])

  // ======================================================
  // HANDLE INPUT CHANGES
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  // ======================================================
  // FORM SUBMISSION
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    // ----------------------------------------------------
    // FRONTEND VALIDATION
    // ----------------------------------------------------

    if (!formData.email.trim()) {
      setError('Email address is required.')
      return
    }

    if (!formData.password) {
      setError('Password is required.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (!formData.hospitalId) {
      setError('Please select a hospital.')
      return
    }

    // ----------------------------------------------------
    // CREATE ADMINISTRATOR
    // ----------------------------------------------------

    try {
      setSubmitting(true)

      await api.post('/hospital-admins', {
        email: formData.email.trim(),
        password: formData.password,
        hospitalId: formData.hospitalId,
      })

      setSuccess(
        'Hospital administrator created successfully.',
      )

      // Give the user a brief success message before returning
      // to the administrator list.
      setTimeout(() => {
        navigate('/super-admin/hospital-admins')
      }, 800)
    } catch (err) {
      console.error(
        'Error creating hospital administrator:',
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
          'You do not have permission to create hospital administrators.',
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(
          'Failed to create hospital administrator. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6">
          <Link
            to="/super-admin/hospital-admins"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Hospital Administrators
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            Create Hospital Administrator
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create an administrator account and assign it to a hospital.
          </p>
        </div>

        {/* ==================================================
            FORM CARD
        ================================================== */}

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ==================================================
                EMAIL
            ================================================== */}

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
                This email address will be used to sign in to the administrator account.
              </p>
            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* ==================================================
                HOSPITAL
            ================================================== */}

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
                disabled={loadingHospitals || submitting}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="">
                  {loadingHospitals
                    ? 'Loading hospitals...'
                    : 'Select a hospital'}
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

              {!loadingHospitals && hospitals.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No hospitals are available. Create a hospital before creating an administrator.
                </p>
              )}
            </div>

            {/* ==================================================
                ROLE
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  HOSPITAL_ADMIN
                </span>

                <span className="ml-3 text-sm text-slate-500">
                  Automatically assigned
                </span>
              </div>
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/super-admin/hospital-admins"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingHospitals ||
                  hospitals.length === 0
                }
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Creating Administrator...'
                  : 'Create Administrator'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateHospitalAdmin
