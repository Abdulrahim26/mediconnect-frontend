import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/hospitals')

      setHospitals(response.data || [])
    } catch (error) {
      console.error('Unable to load hospitals:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to manage hospitals.',
        )
      } else {
        setError(
          'Unable to load hospitals. Please try again.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHospitals()
  }, [])

  const handleDelete = async (hospital) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${hospital.name}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(hospital.id)
      setError('')

      await api.delete(`/hospitals/${hospital.id}`)

      setHospitals((previous) =>
        previous.filter(
          (item) => item.id !== hospital.id,
        ),
      )
    } catch (error) {
      console.error('Unable to delete hospital:', error)

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to delete this hospital.'

      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-blue-600">
                System Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Hospital Management
              </h1>

              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                View, create, update, and manage hospitals
                registered on the MediConnect platform.
              </p>
            </div>

            <Link
              to="/super-admin/hospitals/create"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Add Hospital
            </Link>

          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to complete request
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-sm font-bold text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              âœ•
            </button>

          </div>
        )}

        {/* SUMMARY */}

        {!loading && (
          <section className="mb-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  ðŸ¥
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Registered Hospitals
                  </p>

                  <p className="text-2xl font-bold text-slate-900">
                    {hospitals.length}
                  </p>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* HOSPITAL LIST */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5 sm:p-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Hospitals
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  All hospitals currently registered in MediConnect.
                </p>
              </div>

              {!loading && (
                  <span className="text-sm font-medium text-blue-700">
                    {hospitals.length}{' '}
                    {hospitals.length === 1
                      ? 'hospital'
                      : 'hospitals'}
                  </span>
                )}

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex flex-col items-center justify-center p-12">

              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm font-medium text-blue-700">
                Loading hospitals...
              </p>

            </div>
          )}

          {/* EMPTY */}

          {!loading && hospitals.length === 0 && (
            <div className="p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-2xl">
                ðŸ¥
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No hospitals found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-blue-700">
                There are currently no hospitals registered
                on the MediConnect platform.
              </p>

              <Link
                to="/super-admin/hospitals/create"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add First Hospital
              </Link>

            </div>
          )}

          {/* DESKTOP TABLE */}

          {!loading && hospitals.length > 0 && (
            <div className="hidden overflow-x-auto md:block">

              <table className="min-w-full">

                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Hospital
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">

                  {hospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg">
                            ðŸ¥
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {hospital.name}
                            </p>

                            {hospital.address && (
                              <p className="mt-1 max-w-xs text-sm text-slate-500">
                                {hospital.address}
                              </p>
                            )}
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-blue-700">
                          {hospital.location || 'â€”'}
                        </p>
                      </td>

                      <td className="px-6 py-5">

                        <div className="space-y-1">

                          <p className="text-sm text-slate-700">
                            {hospital.phone || 'No phone'}
                          </p>

                          <p className="text-sm text-slate-500">
                            {hospital.email || 'No email'}
                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/super-admin/hospitals/${hospital.id}/edit`}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-blue-700"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(hospital)
                            }
                            disabled={
                              deletingId === hospital.id
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === hospital.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* MOBILE CARDS */}

          {!loading && hospitals.length > 0 && (
            <div className="space-y-4 p-4 md:hidden">

              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xl">
                      ðŸ¥
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-slate-900">
                        {hospital.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {hospital.location || 'No location'}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {hospital.address || 'No address'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {hospital.phone || 'No phone'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm text-slate-700">
                        {hospital.email || 'No email'}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex gap-2">

                    <Link
                      to={`/super-admin/hospitals/${hospital.id}/edit`}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(hospital)
                      }
                      disabled={
                        deletingId === hospital.id
                      }
                      className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === hospital.id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

export default Hospitals
