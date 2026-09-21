import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function getStatusClasses(status) {
  switch (status) {
    case 'VERIFIED':
      return 'bg-green-100 text-green-700 border-green-200'

    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'

    case 'FAILED':
      return 'bg-red-100 text-red-700 border-red-200'

    case 'EXPIRED':
      return 'bg-orange-100 text-orange-700 border-orange-200'

    case 'NOT_VERIFIED':
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'VERIFIED':
      return 'Verified'

    case 'PENDING':
      return 'Verification Pending'

    case 'FAILED':
      return 'Verification Failed'

    case 'EXPIRED':
      return 'Expired'

    case 'NOT_VERIFIED':
      return 'Not Verified'

    default:
      return 'Not Verified'
  }
}

function VerificationStatus({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}

function PatientVerification() {
  const [profile, setProfile] = useState(null)

  const [ghanaCardPin, setGhanaCardPin] = useState('')
  const [nhisNumber, setNhisNumber] = useState('')

  const [loading, setLoading] = useState(true)
  const [ghanaLoading, setGhanaLoading] = useState(false)
  const [nhisLoading, setNhisLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/patients/profile')

        if (cancelled) {
          return
        }

        setProfile(response.data)

        if (response.data?.ghanaCardPin) {
          setGhanaCardPin(response.data.ghanaCardPin)
        }

        if (response.data?.nhisNumber) {
          setNhisNumber(response.data.nhisNumber)
        }
      } catch (error) {
        console.error('Patient verification profile error:', error)

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              'Unable to load your verification information.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const handleGhanaCardChange = (event) => {
    let value = event.target.value.toUpperCase()

    // Remove spaces
    value = value.replace(/\s/g, '')

    // Limit to expected length
    value = value.slice(0, 15)

    setGhanaCardPin(value)
  }

  const handleNhisChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8)

    setNhisNumber(value)
  }

  const handleGhanaCardVerification = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const pattern = /^GHA-\d{9}-[A-Z0-9]$/

    if (!pattern.test(ghanaCardPin)) {
      setError(
        'Please enter a valid Ghana Card PIN in the format GHA-XXXXXXXXX-X.'
      )
      return
    }

    try {
      setGhanaLoading(true)

      const response = await api.post(
        '/patients/verification/ghana-card',
        {
          ghanaCardPin,
        }
      )

      setProfile(response.data)

      setSuccess(
        'Your Ghana Card details have been submitted successfully.'
      )
    } catch (error) {
      console.error('Ghana Card verification error:', error)

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Unable to submit Ghana Card verification.'
      )
    } finally {
      setGhanaLoading(false)
    }
  }

  const handleNhisVerification = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!/^\d{8}$/.test(nhisNumber)) {
      setError(
        'Please enter a valid NHIS number containing exactly 8 digits.'
      )
      return
    }

    try {
      setNhisLoading(true)

      const response = await api.post(
        '/patients/verification/nhis',
        {
          nhisNumber,
        }
      )

      setProfile(response.data)

      setSuccess(
        'Your NHIS details have been submitted successfully.'
      )
    } catch (error) {
      console.error('NHIS verification error:', error)

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Unable to submit NHIS verification.'
      )
    } finally {
      setNhisLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-lg font-medium text-slate-600">
            Loading verification information...
          </p>
        </div>
      </div>
    )
  }

  const ghanaStatus =
    profile?.ghanaCardVerificationStatus || 'NOT_VERIFIED'

  const nhisStatus =
    profile?.nhisVerificationStatus || 'NOT_VERIFIED'

  const insuranceProvider =
    profile?.insuranceProvider || 'CASH'

  const insuranceStatus =
    profile?.insuranceStatus || 'INACTIVE'

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="mb-8">
          <Link
            to="/patient/dashboard"
            className="mb-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Identity & Insurance Verification
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Verify your Ghana Card and NHIS information to make
            your healthcare identity and insurance details easier
            to use across MediConnect.
          </p>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div>
              <p className="font-semibold">
                Verification error
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-sm font-bold text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1 text-sm">
                {success}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess('')}
              className="text-sm font-bold text-green-600 hover:text-green-800"
              aria-label="Dismiss success message"
            >
              ✕
            </button>
          </div>
        )}

        {/* VERIFICATION SUMMARY */}

        <section className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Ghana Card
            </p>

            <div className="mt-3">
              <VerificationStatus status={ghanaStatus} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              NHIS
            </p>

            <div className="mt-3">
              <VerificationStatus status={nhisStatus} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Insurance
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {insuranceProvider === 'PRIVATE_INSURANCE'
                ? 'Private Insurance'
                : insuranceProvider === 'NHIS'
                  ? 'NHIS'
                  : 'Cash'}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Status: {insuranceStatus}
            </p>
          </div>

        </section>

        {/* GHANA CARD */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ghana Card Verification
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Add your Ghana Card PIN to establish your
                  verified identity on MediConnect.
                </p>
              </div>

              <VerificationStatus status={ghanaStatus} />

            </div>
          </div>

          <form
            onSubmit={handleGhanaCardVerification}
            className="p-5 sm:p-6"
          >

            <label
              htmlFor="ghanaCardPin"
              className="block text-sm font-semibold text-slate-700"
            >
              Ghana Card PIN
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="ghanaCardPin"
                type="text"
                value={ghanaCardPin}
                onChange={handleGhanaCardChange}
                placeholder="GHA-XXXXXXXXX-X"
                disabled={ghanaLoading}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 sm:max-w-md"
              />

              <button
                type="submit"
                disabled={ghanaLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ghanaLoading
                  ? 'Submitting...'
                  : ghanaStatus === 'VERIFIED'
                    ? 'Update Ghana Card'
                    : 'Verify Ghana Card'}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Format: GHA-XXXXXXXXX-X
            </p>

            {ghanaStatus === 'PENDING' && (
              <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm font-semibold text-yellow-800">
                  Verification pending
                </p>

                <p className="mt-1 text-xs leading-5 text-yellow-700">
                  Your Ghana Card information has been submitted
                  and is awaiting verification.
                </p>
              </div>
            )}

            {ghanaStatus === 'VERIFIED' && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  Ghana Card verified
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700">
                  Your Ghana Card identity has been successfully
                  verified.
                </p>
              </div>
            )}

            {ghanaStatus === 'FAILED' && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Verification failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Your Ghana Card could not be verified. Please
                  check the PIN and try again.
                </p>
              </div>
            )}

          </form>
        </section>

        {/* NHIS */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  NHIS Verification
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Add your National Health Insurance Scheme
                  number to connect your insurance information.
                </p>
              </div>

              <VerificationStatus status={nhisStatus} />

            </div>
          </div>

          <form
            onSubmit={handleNhisVerification}
            className="p-5 sm:p-6"
          >

            <label
              htmlFor="nhisNumber"
              className="block text-sm font-semibold text-slate-700"
            >
              NHIS Number
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">

              <input
                id="nhisNumber"
                type="text"
                inputMode="numeric"
                value={nhisNumber}
                onChange={handleNhisChange}
                placeholder="12345678"
                disabled={nhisLoading}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium tracking-wider text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 sm:max-w-md"
              />

              <button
                type="submit"
                disabled={nhisLoading}
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nhisLoading
                  ? 'Submitting...'
                  : nhisStatus === 'VERIFIED'
                    ? 'Update NHIS'
                    : 'Verify NHIS'}
              </button>

            </div>

            <p className="mt-2 text-xs text-slate-500">
              NHIS number must contain exactly 8 digits.
            </p>

            {nhisStatus === 'PENDING' && (
              <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm font-semibold text-yellow-800">
                  Verification pending
                </p>

                <p className="mt-1 text-xs leading-5 text-yellow-700">
                  Your NHIS information has been submitted and is
                  awaiting verification.
                </p>
              </div>
            )}

            {nhisStatus === 'VERIFIED' && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  NHIS verified
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700">
                  Your NHIS information has been successfully
                  verified.
                </p>
              </div>
            )}

            {nhisStatus === 'FAILED' && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Verification failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Your NHIS number could not be verified. Please
                  check the number and try again.
                </p>
              </div>
            )}

          </form>
        </section>

        {/* INSURANCE INFORMATION */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Insurance Information
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your current insurance information is shown below.
              Insurance management will be expanded as the
              MediConnect insurance features are implemented.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Provider
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {insuranceProvider === 'PRIVATE_INSURANCE'
                    ? 'Private Insurance'
                    : insuranceProvider === 'NHIS'
                      ? 'NHIS'
                      : 'Cash'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Insurance Status
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {insuranceStatus}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NHIS / Ghana Card Link
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {profile?.isNhisLinkedToGhanaCard
                    ? 'Linked'
                    : 'Not Linked'}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECURITY NOTICE */}

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            Your information is protected
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Only provide your official Ghana Card PIN and NHIS
            number through the secure MediConnect application.
            Never share your authentication password or JWT token
            with anyone.
          </p>
        </div>

      </div>
    </div>
  )
}

export default PatientVerification