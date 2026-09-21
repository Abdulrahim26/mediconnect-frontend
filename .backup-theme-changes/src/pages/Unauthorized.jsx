function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-600">
          You do not have permission to view this page.
        </p>
      </section>
    </main>
  )
}

export default Unauthorized