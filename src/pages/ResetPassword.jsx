import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!token) {
      setError(
        'This password reset link is invalid or missing.',
      )
      return
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.',
      )
      return
    }

    setLoading(true)

    try {
      const response = await api.post(
        '/auth/reset-password',
        {
          token,
          password,
        },
      )

      setMessage(response.data)

      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error(
        'Reset password error:',
        error,
      )

      if (error.response?.data?.message) {
        setError(
          error.response.data.message,
        )
      } else {
        setError(
          'Unable to reset your password. The link may be invalid or expired.',
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
          <h1 className="text-3xl font-bold text-slate-900">
            MediConnect
          </h1>

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            Reset Your Password
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Enter a new password for your MediConnect account.
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

        {!message && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  placeholder="Enter your new password"
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-blue-600"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  placeholder="Confirm your new password"
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous,
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-blue-600"
                >
                  {showConfirmPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Resetting Password...'
                : 'Reset Password'}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-slate-600">
            Redirecting you to the login page...
          </p>
        )}

        {!message && (
          <div className="mt-6 border-t border-blue-100 pt-5 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Sign In
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default ResetPassword