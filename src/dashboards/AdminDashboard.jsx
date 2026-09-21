import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <header className="mb-8">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              MediConnect Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Hospital Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Manage your hospital and its healthcare staff.
            </p>
          </div>
        </header>

        {/* ADMINISTRATION MANAGEMENT */}

        <section className="mb-8">

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Hospital Administration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the doctors and departments within your hospital.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* DOCTOR MANAGEMENT */}

            <Link
              to="/admin/doctors"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl text-blue-700">
                    âš•
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Doctor Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create, view, update and deactivate doctors
                    in your hospital.
                  </p>
                </div>

                <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-blue-700 sm:inline-flex">
                  Manage
                </span>

              </div>

              <p className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Manage doctors â†’
              </p>
            </Link>

            {/* DEPARTMENT MANAGEMENT */}

            <Link
              to="/admin/departments"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl text-blue-700">
                    â–¦
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Department Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create and manage departments within
                    your hospital.
                  </p>
                </div>

                <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-blue-700 sm:inline-flex">
                  Manage
                </span>

              </div>

              <p className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Manage departments â†’
              </p>
            </Link>

          </div>
        </section>

        {/* ADMINISTRATION MODULES */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Administration Modules
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Use the administration tools below to manage
              your hospital.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">

            {/* DOCTOR MODULE */}

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-blue-700">
                  âš•
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-500">
                    Administration module
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    Doctor Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create doctors, update their information,
                    view their details and deactivate accounts
                    when necessary.
                  </p>

                  <Link
                    to="/admin/doctors"
                    className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Open doctor management â†’
                  </Link>

                </div>

              </div>
            </div>

            {/* DEPARTMENT MODULE */}

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-lg text-indigo-700">
                  â–¦
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-500">
                    Administration module
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    Department Management
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create and manage the departments available
                    within your hospital.
                  </p>

                  <Link
                    to="/admin/departments"
                    className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Open department management â†’
                  </Link>

                </div>

              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default AdminDashboard
