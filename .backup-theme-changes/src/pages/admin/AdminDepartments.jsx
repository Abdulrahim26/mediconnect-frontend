import { useCallback, useEffect, useState } from 'react'
import api from '../../api/axios'

function AdminDepartments() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [departments, setDepartments] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ======================================================
  // LOAD DEPARTMENTS
  // ======================================================

  const loadDepartments = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoadingDepartments(true)
        }

        setError('')

        const response = await api.get('/departments', {
          params: {
            page: 0,
            size: 100,
          },
        })

        setDepartments(response.data?.content || [])
      } catch (error) {
        console.error(
          'Load departments error:',
          error,
        )

        if (error.response?.status === 401) {
          setError(
            'Your session has expired. Please log in again.',
          )
        } else if (error.response?.status === 403) {
          setError(
            'You do not have permission to view departments.',
          )
        } else {
          setError('Unable to load departments.')
        }
      } finally {
        if (showLoading) {
          setLoadingDepartments(false)
        }
      }
    },
    [],
  )

  // ======================================================
  // INITIAL DEPARTMENT LOAD
  // ======================================================

  useEffect(() => {
    let active = true

    const initializeDepartments = async () => {
      if (!active) {
        return
      }

      await loadDepartments()
    }

    initializeDepartments()

    return () => {
      active = false
    }
  }, [loadDepartments])

  // ======================================================
  // CREATE DEPARTMENT
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Department name is required.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post('/departments', {
        name: name.trim(),
        description: description.trim(),
      })

      const departmentName =
        response.data?.name || name.trim()

      setSuccess(
        `${departmentName} department was created successfully.`,
      )

      setName('')
      setDescription('')

      await loadDepartments()
    } catch (error) {
      console.error(
        'Create department error:',
        error,
      )

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to create departments.',
        )
      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            'Please check the department information.',
        )
      } else {
        setError('Unable to create department.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // CLEAR FORM
  // ======================================================

  const handleClear = () => {
    setName('')
    setDescription('')
    setError('')
    setSuccess('')
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="min-h-screen bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            PAGE TITLE
        ================================================== */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Department Management
          </h1>

          <p className="mt-2 text-slate-600">
            Create and manage hospital departments.
          </p>
        </div>

        {/* ==================================================
            CREATE DEPARTMENT
        ================================================== */}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Create Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new department to your hospital.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">

              <div>
                <label
                  htmlFor="department-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Department Name
                </label>

                <input
                  id="department-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Cardiology"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
                />
              </div>

              <div>
                <label
                  htmlFor="department-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="department-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the services provided by this department."
                  rows={5}
                  disabled={loading}
                  className="w-full rounded-lg border border-mc-100 px-4 py-3 outline-none transition focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
                />
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-mc-600 px-6 py-3 font-semibold text-white transition hover:bg-mc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? 'Creating Department...'
                  : 'Create Department'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleClear}
                className="rounded-lg border border-mc-100 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-mc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

            </div>
          </form>
        </section>

        {/* ==================================================
            DEPARTMENT LIST
        ================================================== */}

        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Hospital Departments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Departments currently registered in your hospital.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDepartments}
              disabled={loadingDepartments}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingDepartments
                ? 'Refreshing...'
                : 'Refresh'}
            </button>

          </div>

          {loadingDepartments ? (
            <div className="rounded-xl bg-mc-50 p-6 text-center text-slate-500">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="rounded-xl bg-mc-50 p-6 text-center">

              <p className="font-semibold text-slate-700">
                No departments found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first hospital department above.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {departments.map((department) => (
                <div
                  key={department.id}
                  className="rounded-xl border border-mc-100 p-5 transition hover:shadow-sm"
                >

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {department.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {department.description ||
                          'No description provided.'}
                      </p>
                    </div>

                    <span className="w-fit rounded-lg bg-mc-100 px-3 py-2 text-xs font-semibold text-mc-700">
                      Department
                    </span>

                  </div>

                  {department.hospitalName && (
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Hospital: {department.hospitalName}
                    </p>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

export default AdminDepartments