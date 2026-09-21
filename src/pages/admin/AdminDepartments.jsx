import { useCallback, useEffect, useState } from 'react'
import api from '../../api/axios'

function AdminDepartments() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [departments, setDepartments] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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
  // CREATE/UPDATE DEPARTMENT
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
      setSaving(true)

      let response

      if (editingDepartment) {
        response = await api.put(
          `/departments/${editingDepartment.id}`,
          {
            name: name.trim(),
            description: description.trim(),
          },
        )
      } else {
        response = await api.post('/departments', {
          name: name.trim(),
          description: description.trim(),
        })
      }

      const departmentName =
        response.data?.name || name.trim()

      if (editingDepartment) {
        setSuccess(
          `${departmentName} department was updated successfully.`,
        )
      } else {
        setSuccess(
          `${departmentName} department was created successfully.`,
        )
      }

      setName('')
      setDescription('')
      setEditingDepartment(null)

      await loadDepartments()
    } catch (error) {
      console.error(
        editingDepartment
          ? 'Update department error:'
          : 'Create department error:',
        error,
      )

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          editingDepartment
            ? 'You do not have permission to update departments.'
            : 'You do not have permission to create departments.',
        )
      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            'Please check the department information.',
        )
      } else {
        setError(
          editingDepartment
            ? 'Unable to update department.'
            : 'Unable to create department.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // ======================================================
  // EDIT DEPARTMENT
  // ======================================================

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setName(department.name || '')
    setDescription(department.description || '')
    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // ======================================================
  // DELETE DEPARTMENT
  // ======================================================

  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(department.id)
      setError('')
      setSuccess('')

      await api.delete(`/departments/${department.id}`)

      setSuccess(
        `${department.name} department was deleted successfully.`,
      )

      await loadDepartments()
    } catch (error) {
      console.error('Delete department error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to delete departments.',
        )
      } else if (error.response?.status === 404) {
        setError('Department not found.')
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to delete department.',
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  // ======================================================
  // CLEAR FORM
  // ======================================================

  const handleClear = () => {
    setName('')
    setDescription('')
    setEditingDepartment(null)
    setError('')
    setSuccess('')
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="min-h-screen bg-blue-50/40 p-6 md:p-8">
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
            CREATE/EDIT DEPARTMENT
        ================================================== */}

        <section className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {editingDepartment
                ? 'Edit Department'
                : 'Create Department'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingDepartment
                ? 'Update the department information.'
                : 'Add a new department to your hospital.'}
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
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
                  disabled={loading || saving}
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
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
                  disabled={loading || saving}
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-blue-50"
                />
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={loading || saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? editingDepartment
                    ? 'Updating Department...'
                    : 'Creating Department...'
                  : editingDepartment
                    ? 'Update Department'
                    : 'Create Department'}
              </button>

              <button
                type="button"
                disabled={loading || saving}
                onClick={handleClear}
                className="rounded-lg border border-blue-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

            </div>
          </form>
        </section>

        {/* ==================================================
            DEPARTMENT LIST
        ================================================== */}

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

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
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingDepartments
                ? 'Refreshing...'
                : 'Refresh'}
            </button>

          </div>

          {loadingDepartments ? (
            <div className="rounded-xl bg-blue-50 p-6 text-center text-slate-500">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="rounded-xl bg-blue-50 p-6 text-center">

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
                  className="rounded-xl border border-blue-100 p-5 transition hover:border-blue-200 hover:shadow-sm"
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

                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                        Department
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEdit(department)}
                        className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(department)}
                        disabled={deletingId === department.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === department.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </div>

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