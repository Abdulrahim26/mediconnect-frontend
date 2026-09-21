import { useLocation, useNavigate } from 'react-router-dom'

function DoctorSearch() {
  const location = useLocation()
  const navigate = useNavigate()

  const doctor = location.state?.doctor

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">
            Doctor Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            Please return to the doctor search page.
          </p>

          <button
            type="button"
            onClick={() => navigate('/patient/doctors')}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Find a Doctor
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() => navigate('/patient/doctors')}
          className="mb-6 rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back to Doctors
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Details
          </h1>

          <p className="mt-2 text-slate-600">
            View the doctor's professional information and consultation details.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-6 md:flex-row">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
              {doctor.firstName?.charAt(0)}
              {doctor.lastName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h2>

              <p className="mt-2 text-lg font-medium text-blue-600">
                {doctor.specialty || 'General Medicine'}
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Qualification
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {doctor.qualification || 'Not specified'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Department
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {doctor.department || 'Not specified'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Hospital
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {doctor.hospital || 'Not specified'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Consultation Fee
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {doctor.consultationFee ?? 'Not specified'}
              </p>
            </div>

          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                navigate('/patient/book-appointment', {
                  state: { doctor },
                })
              }
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>

        </section>
      </div>
    </div>
  )
}

export default DoctorSearch