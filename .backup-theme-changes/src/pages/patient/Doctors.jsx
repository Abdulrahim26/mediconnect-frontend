import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [search, setSearch] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    department: '',
    hospital: '',
  })

  const fetchDoctors = async (filters = search) => {
    try {
      setLoading(true)
      setError('')

      const params = {
        ...filters,
        page: 0,
        size: 20,
        sortBy: 'firstName',
      }

      Object.keys(params).forEach((key) => {
        if (params[key] === '') {
          delete params[key]
        }
      })

      const response = await api.get('/search/doctors', { params })

      setDoctors(response.data.content || [])
    } catch (error) {
      console.error('Doctor search error:', error)
      setError('Unable to load doctors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await api.get('/search/doctors', {
          params: {
            page: 0,
            size: 20,
            sortBy: 'firstName',
          },
        })

        setDoctors(response.data.content || [])
      } catch (error) {
        console.error('Doctor loading error:', error)
        setError('Unable to load doctors.')
      } finally {
        setLoading(false)
      }
    }

    loadDoctors()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setSearch((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSearch = (event) => {
    event.preventDefault()
    fetchDoctors()
  }

  const clearSearch = () => {
    const emptySearch = {
      firstName: '',
      lastName: '',
      specialty: '',
      department: '',
      hospital: '',
    }

    setSearch(emptySearch)
    fetchDoctors(emptySearch)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>

          <p className="mt-2 text-slate-600">
            Search for doctors by name, specialty, department, or hospital.
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <form onSubmit={handleSearch}>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

              <input
                type="text"
                name="firstName"
                value={search.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="lastName"
                value={search.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="specialty"
                value={search.specialty}
                onChange={handleChange}
                placeholder="Specialty"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="department"
                value={search.department}
                onChange={handleChange}
                placeholder="Department"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="hospital"
                value={search.hospital}
                onChange={handleChange}
                placeholder="Hospital"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Search Doctors
              </button>

              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
              >
                Clear
              </button>

            </div>

          </form>

        </section>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading doctors...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              No doctors found.
            </p>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <section>

            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Available Doctors
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {doctors.map((doctor) => (
                <article
                  key={doctor.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                    {doctor.firstName?.charAt(0)}
                    {doctor.lastName?.charAt(0)}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>

                  <p className="mt-2 font-medium text-blue-600">
                    {doctor.specialty || 'General Medicine'}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">

                    <p>
                      <span className="font-semibold">
                        Qualification:
                      </span>{' '}
                      {doctor.qualification || 'Not specified'}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Department:
                      </span>{' '}
                      {doctor.department || 'Not specified'}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Hospital:
                      </span>{' '}
                      {doctor.hospital || 'Not specified'}
                    </p>

                    {doctor.consultationFee !== null &&
                      doctor.consultationFee !== undefined && (
                        <p>
                          <span className="font-semibold">
                            Consultation Fee:
                          </span>{' '}
                          {doctor.consultationFee}
                        </p>
                      )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/patient/doctors/details', {
                        state: { doctor },
                      })
                    }
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    View Doctor
                  </button>

                </article>
              ))}

            </div>

          </section>
        )}

      </div>
    </div>
  )
}

export default Doctors