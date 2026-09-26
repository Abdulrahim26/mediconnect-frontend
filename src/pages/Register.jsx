import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    ghanaCardPin: '',
    nhisNumber: '',
    insuranceProvider: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  const getPasswordStrength = () => {
    const password = formData.password

    if (!password) {
      return ''
    }

    if (password.length < 8) {
      return 'Weak'
    }

    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    const score = [
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length

    if (score <= 1) {
      return 'Weak'
    }

    if (score === 2) {
      return 'Medium'
    }

    return 'Strong'
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'First name is required.'
    }

    if (!formData.lastName.trim()) {
      return 'Last name is required.'
    }

    if (!formData.email.trim()) {
      return 'Email is required.'
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address.'
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters.'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.'
    }

    if (
      formData.nhisNumber.trim() &&
      !/^\d{8}$/.test(formData.nhisNumber.trim())
    ) {
      return 'NHIS Number must contain exactly 8 digits.'
    }

    if (
      formData.insuranceProvider === 'NHIS' &&
      !formData.nhisNumber.trim()
    ) {
      return 'NHIS Number is required when NHIS is selected.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address.trim() || null,
        ghanaCardPin: formData.ghanaCardPin.trim() || null,
        nhisNumber: formData.nhisNumber.trim() || null,
        insuranceProvider:
          formData.insuranceProvider || null,
        password: formData.password,
      })

      setSuccess(
        'Registration successful! A welcome email has been sent to your email address.'
      )

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        ghanaCardPin: '',
        nhisNumber: '',
        insuranceProvider: '',
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (error) {
      console.error('Registration error:', error)

      if (error.response?.status === 400) {
        const message = error.response?.data?.message

        setError(
          message ||
            'Please check your information and try again.'
        )
      } else if (error.response?.status === 409) {
        setError(
          'An account with this email address already exists.'
        )
      } else if (error.response?.status === 500) {
        setError(
          'Registration could not be completed. Please try again.'
        )
      } else {
        setError(
          'Unable to connect to the server. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">

        {/* Header */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            MediConnect
          </h1>

          <p className="mt-2 text-slate-600">
            Create your patient account
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* PERSONAL INFORMATION */}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* First Name */}

              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* Last Name */}

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

            </div>
          </section>

          {/* CONTACT INFORMATION */}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Contact Information
            </h2>

            <div className="space-y-5">

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* Phone */}

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
                  placeholder="Enter phone number"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* Date of Birth */}

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* Gender */}

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                >
                  <option value="">
                    Select gender
                  </option>
                  <option value="MALE">
                    Male
                  </option>
                  <option value="FEMALE">
                    Female
                  </option>
                </select>
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
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

            </div>
          </section>

          {/* IDENTIFICATION & INSURANCE */}

          <section>
            <h2 className="text-lg font-semibold text-slate-900">
              Identification & Insurance
            </h2>

            <p className="mt-1 mb-5 text-sm text-slate-600">
              You may provide your identification and insurance
              information now. Verification will be completed by
              the healthcare administration system.
            </p>

            <div className="space-y-5">

              {/* Ghana Card */}

              <div>
                <label
                  htmlFor="ghanaCardPin"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Ghana Card PIN
                </label>

                <input
                  id="ghanaCardPin"
                  name="ghanaCardPin"
                  type="text"
                  value={formData.ghanaCardPin}
                  onChange={handleChange}
                  placeholder="GHA-XXXXXXXXX-X"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* NHIS */}

              <div>
                <label
                  htmlFor="nhisNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  NHIS Number
                </label>

                <input
                  id="nhisNumber"
                  name="nhisNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength="8"
                  value={formData.nhisNumber}
                  onChange={handleChange}
                  placeholder="Enter 8-digit NHIS number"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>

              {/* Insurance Provider */}

              <div>
                <label
                  htmlFor="insuranceProvider"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Insurance Provider
                </label>

                <select
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                >
                  <option value="">
                    Select insurance provider
                  </option>

                  <option value="CASH">
                    Cash / Self-Pay
                  </option>

                  <option value="NHIS">
                    NHIS
                  </option>

                  <option value="PRIVATE_INSURANCE">
                    Private Insurance
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* PASSWORD */}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Account Security
            </h2>

            <div className="space-y-5">

              {/* Password */}

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
                  required
                  minLength="8"
                  placeholder="Create a password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Minimum 8 characters
                  </span>

                  {passwordStrength && (
                    <span
                      className={
                        passwordStrength === 'Strong'
                          ? 'font-semibold text-green-600'
                          : passwordStrength === 'Medium'
                            ? 'font-semibold text-yellow-600'
                            : 'font-semibold text-red-600'
                      }
                    >
                      {passwordStrength}
                    </span>
                  )}
                </div>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />

                {formData.confirmPassword &&
                  formData.password !==
                    formData.confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">
                      Passwords do not match.
                    </p>
                  )}
              </div>

            </div>
          </section>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Creating account...'
              : 'Create Patient Account'}
          </button>

        </form>

        {/* Login link */}

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}

          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </div>

      </section>
    </main>
  )
}

export default Register