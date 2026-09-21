import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

function HospitalAdminDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // ======================================================
  // LOAD ADMINISTRATOR DETAILS
  // ======================================================

  const fetchAdminDetails = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(
        `/hospital-admins/${id}`,
      )

      setAdmin(response.data)
    } catch (err) {
      console.error(
        'Error fetching hospital administrator details:',
        err,
      )

      if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to view this administrator.',
        )
      } else if (err.response?.status === 404) {
        setError(
          'Hospital administrator not found.',
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(
          'Failed to load hospital administrator details.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminDetails()
  }, [id])

  // ======================================================
  // ACTIVATE / DEACTIVATE
  // ======================================================

  const handleStatusChange = async () => {
    if (!admin) {
      return
    }

    const action = admin.active
      ? 'deactivate'
      : 'activate'

    const confirmed = window.confirm(
      admin.active
        ? `Are you sure you want to deactivate ${admin.email}? They will no longer be able to log in.`
        : `Are you sure you want to activate ${admin.email}? They will be able to log in again.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)
      setError('')

      if (admin.active) {
        await api.patch(
          `/hospital-admins/${admin.id}/deactivate`,
        )
      } else {
        await api.patch(
          `/hospital-admins/${admin.id}/activate`,
        )
      }

      await fetchAdminDetails()
    } catch (err) {
      console.error(
        `Error attempting to ${action} hospital administrator:`,
        err,
      )

      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            `Unable to ${action} hospital administrator.`,
        )
      } else if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          `You do not have permission to ${action} hospital administrators.`,
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(
          `Failed to ${action} hospital administrator. Please try again.`,
        )
      }
    } finally {
      setActionLoading(false)
    }
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading administrator details...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && !admin) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">

          <Link
            to="/super-admin/hospital-admins"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Hospital Administrators
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load administrator
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/super-admin/hospital-admins')
              }
              className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Return to Administrators
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ======================================================
  // DETAILS
  // ======================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-6">
          <Link
            to="/super-admin/hospital-admins"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Hospital Administrators
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Administrator Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View account and hospital assignment information.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleStatusChange}
                disabled={actionLoading}
                className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  admin.active
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading
                  ? 'Updating...'
                  : admin.active
                    ? 'Deactivate Administrator'
                    : 'Activate Administrator'}
              </button>

              <Link
                to={`/super-admin/hospital-admins/${id}/edit`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Edit Administrator
              </Link>

            </div>
          </div>
        </div>

        {/* ACTION ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ADMINISTRATOR ACCOUNT */}

        <div className="mb-6 rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Information about the administrator account.
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">

            {/* Email */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-800">
                {admin.email}
              </p>
            </div>

            {/* Role */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </p>

              <div className="mt-2">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {admin.role || 'HOSPITAL_ADMIN'}
                </span>
              </div>
            </div>

            {/* Status */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account Status
              </p>

              <div className="mt-2">
                {admin.active ? (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Account ID */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-600">
                {admin.id}
              </p>
            </div>

            {/* Created */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </p>

              <p className="mt-2 text-sm text-slate-700">
                {admin.createdAt
                  ? new Date(
                      admin.createdAt,
                    ).toLocaleString()
                  : 'Not available'}
              </p>
            </div>

          </div>
        </div>

        {/* HOSPITAL INFORMATION */}

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Assigned Hospital
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hospital this administrator is responsible for.
            </p>
          </div>

          <div className="p-5 sm:p-6">

            {/* Hospital Name */}

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hospital Name
              </p>

              <p className="mt-2 text-xl font-semibold text-slate-800">
                {admin.hospitalName || 'Not assigned'}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* Location */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {admin.hospitalLocation || 'Not available'}
                </p>
              </div>

              {/* Phone */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {admin.hospitalPhone || 'Not available'}
                </p>
              </div>

              {/* Email */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hospital Email
                </p>

                <p className="mt-2 break-all text-sm text-slate-700">
                  {admin.hospitalEmail || 'Not available'}
                </p>
              </div>

              {/* Address */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Address
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {admin.hospitalAddress || 'Not available'}
                </p>
              </div>

              {/* Hospital ID */}

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hospital ID
                </p>

                <p className="mt-2 break-all font-mono text-xs text-slate-600">
                  {admin.hospitalId || 'Not assigned'}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HospitalAdminDetails
