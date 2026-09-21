import { useEffect, useState } from 'react'
import api from '../../api/axios'

function PatientProfile() {
  const [profile, setProfile] = useState(null)

  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editing, setEditing] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/patients/profile')

        const data = response.data

        setProfile(data)

        setPhone(data.phone || '')
        setDateOfBirth(data.dateOfBirth || '')
        setGender(data.gender || '')
        setAddress(data.address || '')
      } catch (err) {
        console.error('Error loading patient profile:', err)

        if (err.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (err.response?.status === 403) {
          setError(
            'You do not have permission to view your profile.',
          )
        } else if (err.response?.data?.message) {
          setError(err.response.data.message)
        } else {
          setError('Unable to load your profile.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await api.put('/patients/profile', {
        phone,
        dateOfBirth: dateOfBirth || null,
        gender,
        address,
      })

      setProfile(response.data)

      setPhone(response.data.phone || '')
      setDateOfBirth(response.data.dateOfBirth || '')
      setGender(response.data.gender || '')
      setAddress(response.data.address || '')

      setEditing(false)
      setSuccess('Your profile was updated successfully.')
    } catch (err) {
      console.error('Error updating patient profile:', err)

      if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to update your profile.',
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Unable to update your profile.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (!profile) {
      return
    }

    setPhone(profile.phone || '')
    setDateOfBirth(profile.dateOfBirth || '')
    setGender(profile.gender || '')
    setAddress(profile.address || '')

    setEditing(false)
    setError('')
  }

  const formatVerificationStatus = (status) => {
    if (!status) {
      return 'Not Verified'
    }

    return status
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  }

  const getVerificationClasses = (status) => {
    switch (status?.toUpperCase()) {
      case 'VERIFIED':
        return 'bg-green-50 text-green-700'

      case 'PENDING':
        return 'bg-amber-50 text-amber-700'

      case 'REJECTED':
        return 'bg-red-50 text-red-700'

      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const formatInsuranceProvider = (provider) => {
    if (!provider) {
      return 'Cash / Self Pay'
    }

    return provider
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-blue-50/40 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-blue-50/40 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error || 'Unable to load your profile.'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-blue-50/40 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}

        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Account
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                View and manage your personal and healthcare
                information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true)
                  setSuccess('')
                  setError('')
                }}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </header>

        {/* MESSAGES */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* PROFILE SUMMARY */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="bg-blue-600 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600">
                {`${profile.firstName || ''} ${profile.lastName || ''}`
                  .trim()
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-white">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 truncate text-sm text-blue-100">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}

        <section className="mb-6 rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your basic personal and contact information.
            </p>
          </div>

          <form
            onSubmit={handleSave}
            className="p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* FIRST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  value={profile.firstName || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  This information cannot be changed here.
                </p>
              </div>

              {/* LAST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  value={profile.lastName || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  This information cannot be changed here.
                </p>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Your account email cannot be changed here.
                </p>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  disabled={!editing}
                  placeholder="Enter your phone number"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                    editing
                      ? 'border-blue-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                />
              </div>

              {/* DATE OF BIRTH */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  disabled={!editing}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                    editing
                      ? 'border-blue-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  disabled={!editing}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                    editing
                      ? 'border-blue-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  disabled={!editing}
                  rows={3}
                  placeholder="Enter your address"
                  className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                    editing
                      ? 'border-blue-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                />
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* GHANA CARD */}

        <section className="mb-6 rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Ghana Card Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your Ghana Card identification and verification
              status.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Ghana Card PIN
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                  {profile.ghanaCardPin || 'Not provided'}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Verification Status
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${getVerificationClasses(
                    profile.ghanaCardVerificationStatus,
                  )}`}
                >
                  {formatVerificationStatus(
                    profile.ghanaCardVerificationStatus,
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* NHIS */}

        <section className="mb-6 rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              NHIS Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your National Health Insurance Scheme information.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  NHIS Number
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                  {profile.nhisNumber || 'Not provided'}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Verification Status
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${getVerificationClasses(
                    profile.nhisVerificationStatus,
                  )}`}
                >
                  {formatVerificationStatus(
                    profile.nhisVerificationStatus,
                  )}
                </span>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Linked to Ghana Card
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${
                    profile.isNhisLinkedToGhanaCard
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {profile.isNhisLinkedToGhanaCard
                    ? 'Yes'
                    : 'No'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INSURANCE */}

        <section className="mb-6 rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Insurance Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your healthcare insurance information.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Insurance Provider
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                  {formatInsuranceProvider(
                    profile.insuranceProvider,
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Insurance Status
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${
                    profile.insuranceStatus?.toUpperCase() ===
                    'ACTIVE'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {profile.insuranceStatus || 'INACTIVE'}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-4">
              <p className="text-sm font-medium text-blue-800">
                Verification information
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Ghana Card, NHIS, and insurance verification
                information is managed by the healthcare
                administration system and cannot be edited from
                this profile.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PatientProfile