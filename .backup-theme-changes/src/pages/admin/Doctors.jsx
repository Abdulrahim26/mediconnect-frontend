import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
  firstName: '',
  lastName: '',
  specialty: '',
  qualification: '',
  phone: '',
  email: '',
  consultationFee: '',
  departmentId: '',
  password: '',
}

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadDoctors = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/doctors')

      setDoctors(response.data || [])
    } catch (error) {
      console.error('Doctors error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to manage doctors.',
        )
      } else {
        setError('Unable to load doctors.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadDepartments = async () => {
    try {
      const response = await api.get('/departments', {
        params: {
          page: 0,
          size: 100,
        },
      })

      setDepartments(response.data?.content || [])
    } catch (error) {
      console.error('Departments error:', error)

      setError('Unable to load departments.')
    }
  }

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        loadDoctors(),
        loadDepartments(),
      ])
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = {
        ...form,

        consultationFee:
          form.consultationFee === ''
            ? null
            : Number(form.consultationFee),

        departmentId:
          form.departmentId === ''
            ? null
            : form.departmentId,
      }

      if (editingId) {
        await api.put(`/doctors/${editingId}`, data)

        setSuccess('Doctor updated successfully.')
      } else {
        await api.post('/doctors', data)

        setSuccess('Doctor created successfully.')
      }

      setForm(emptyForm)
      setEditingId(null)

      await loadDoctors()
    } catch (error) {
      console.error('Doctor save error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to manage doctors.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to save doctor.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (doctor) => {
    setEditingId(doctor.id)

    setForm({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      specialty: doctor.specialty || '',
      qualification: doctor.qualification || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      consultationFee:
        doctor.consultationFee ?? '',
      departmentId: doctor.departmentId || '',
      password: '',
    })

    setSuccess('')
    setError('')
  }

  const handleDeactivate = async (doctorId) => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate this doctor?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await api.delete(`/doctors/${doctorId}`)

      setSuccess('Doctor deactivated successfully.')

      await loadDoctors()
    } catch (error) {
      console.error('Deactivate doctor error:', error)

      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please log in again.',
        )
      } else if (error.response?.status === 403) {
        setError(
          'You do not have permission to deactivate doctors.',
        )
      } else {
        setError(
          error.response?.data?.message ||
            'Unable to deactivate doctor.',
        )
      }
    }
  }

  return (
    <main className="min-h-screen bg-mc-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE TITLE */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Doctor Management
          </h1>

          <p className="mt-2 text-slate-600">
            Create, update and manage doctors in your hospital.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* DOCTOR FORM */}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            {editingId
              ? 'Update Doctor'
              : 'Create Doctor'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="text"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                placeholder="Specialty"
                required
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={Boolean(editingId) || saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <input
                type="number"
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
                placeholder="Consultation fee"
                min="0"
                step="0.01"
                disabled={saving}
                className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              />

              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
                disabled={saving}
                className="rounded-lg border border-mc-100 bg-white px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
              >
                <option value="">
                  Select department
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>

              {!editingId && (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Doctor login password"
                  required
                  disabled={saving}
                  className="rounded-lg border border-mc-100 px-4 py-3 outline-none focus:border-mc-600 focus:ring-2 focus:ring-mc-100 disabled:bg-mc-50"
                />
              )}

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-mc-600 px-5 py-3 font-semibold text-white hover:bg-mc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Doctor'
                    : 'Create Doctor'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg bg-mc-50 px-5 py-3 font-semibold text-mc-700 hover:bg-mc-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* DOCTOR LIST */}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-mc-100 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Hospital Doctors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {doctors.length} doctor
              {doctors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No doctors found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Specialty
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Fee
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">

                  {doctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">
                        Dr. {doctor.firstName}{' '}
                        {doctor.lastName}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {doctor.specialty || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {doctor.departmentName || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {doctor.phone || '—'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {doctor.consultationFee ?? '—'}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(doctor)
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeactivate(
                                doctor.id,
                              )
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Deactivate
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

export default Doctors