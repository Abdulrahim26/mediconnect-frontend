import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../auth/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)

      const { token, role } = response.data

      console.log('LOGIN RESPONSE:', response.data)
      console.log('ROLE FROM BACKEND:', role)

      login(token, role)

      if (role === 'PATIENT') {
        navigate('/patient/dashboard')
      } else if (role === 'DOCTOR') {
        navigate('/doctor/dashboard')
      } else if (role === 'RECEPTIONIST') {
        navigate('/receptionist/dashboard')
      } else if (role === 'HOSPITAL_ADMIN') {
        navigate('/admin/dashboard')
      } else if (role === 'SUPER_ADMIN') {
        navigate('/super-admin/dashboard')
      } else {
        setError('Unknown user role.')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (error.response?.status === 403) {
        setError('Access denied.')
      } else {
        setError('Unable to connect to the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50/40 px-4">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
            ✦
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            MediConnect
          </h1>

          <p className="mt-2 text-slate-600">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
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

            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-blue-100 pt-5 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login