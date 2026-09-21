import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function HospitalAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/hospital-admins')

      setAdmins(response.data)
    } catch (err) {
      console.error(
        'Error fetching hospital administrators:',
        err,
      )

      if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to view hospital administrators.',
        )
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to load hospital administrators.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (admin) => {
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
      setActionLoading(admin.id)
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

      await fetchAdmins()
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
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Hospital Administrators
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage administrators responsible for each hospital.
            </p>
          </div>

          <Link
            to="/super-admin/hospital-admins/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add Administrator
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading hospital administrators...
            </p>
          </div>
        )}

        {!loading && !error && admins.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-4xl">
              👤
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No Hospital Administrators
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No hospital administrators have been created yet.
            </p>

            <Link
              to="/super-admin/hospital-admins/create"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Administrator
            </Link>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Hospital
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {admin.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {admin.hospitalName || 'Not assigned'}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {admin.role || 'HOSPITAL_ADMIN'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {admin.active ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            to={`/super-admin/hospital-admins/${admin.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(admin)
                            }
                            disabled={
                              actionLoading === admin.id
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              admin.active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {actionLoading === admin.id
                              ? 'Updating...'
                              : admin.active
                                ? 'Deactivate'
                                : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <div className="space-y-4 md:hidden">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="break-all text-sm font-semibold text-slate-800">
                      {admin.email}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {admin.hospitalName || 'Not assigned'}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {admin.role || 'HOSPITAL_ADMIN'}
                  </span>
                </div>

                <div className="mt-4">
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

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                  <Link
                    to={`/super-admin/hospital-admins/${admin.id}`}
                    className="text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details →
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(admin)
                    }
                    disabled={actionLoading === admin.id}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      admin.active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {actionLoading === admin.id
                      ? 'Updating...'
                      : admin.active
                        ? 'Deactivate Administrator'
                        : 'Activate Administrator'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default HospitalAdmins
