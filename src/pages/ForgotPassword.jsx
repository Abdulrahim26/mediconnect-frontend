import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      })

      setMessage(response.data)
      setEmail('')
    } catch (error) {
      console.error('Forgot password error:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError(
          'Unable to process your request. Please try again.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50/40 px-4">
      <section className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
            ✦
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            MediConnect
          </h1>

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            Forgot Password?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter your email address and we will send you a
            password reset link.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Sending...'
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 border-t border-blue-100 pt-5 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword