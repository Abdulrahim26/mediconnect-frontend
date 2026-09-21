import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext } from './AuthContextValue'
import api from '../api/axios'

function getStoredAuth() {
  const storedToken = localStorage.getItem('token')
  const storedRole = localStorage.getItem('role')
  const storedUser = localStorage.getItem('user')

  if (!storedToken) {
    return {
      token: null,
      role: null,
      user: null,
    }
  }

  try {
    const decodedToken = jwtDecode(storedToken)

    if (
      decodedToken.exp &&
      decodedToken.exp * 1000 < Date.now()
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')

      return {
        token: null,
        role: null,
        user: null,
      }
    }

    let user = null

    if (storedUser) {
      try {
        user = JSON.parse(storedUser)
      } catch {
        user = null
      }
    }

    return {
      token: storedToken,
      role: storedRole,
      user: user || decodedToken,
    }
  } catch (error) {
    console.error('Invalid JWT:', error)

    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')

    return {
      token: null,
      role: null,
      user: null,
    }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)
  const [isLoading, setIsLoading] = useState(true)

  // ======================================================
  // RESTORE AUTHENTICATION ON APPLICATION START
  // ======================================================

  useEffect(() => {
    const restoreAuthentication = async () => {
      const storedAuth = getStoredAuth()

      setAuth(storedAuth)

      setIsLoading(false)
    }

    restoreAuthentication()
  }, [])

  // ======================================================
  // LOGIN
  // ======================================================

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)

    let decodedUser = null

    try {
      decodedUser = jwtDecode(newToken)
    } catch (error) {
      console.error('Invalid JWT:', error)
    }

    setAuth({
      token: newToken,
      role: newRole,
      user: decodedUser,
    })
  }

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')

    setAuth({
      token: null,
      role: null,
      user: null,
    })
  }

  // ======================================================
  // LOAD USER PROFILE
  // ======================================================

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!auth.token || !auth.role) {
        return
      }

      try {
        let endpoint = null

        if (auth.role === 'PATIENT') {
          endpoint = '/patients/profile'
        } else if (auth.role === 'DOCTOR') {
          endpoint = '/doctors/profile'
        } else if (auth.role === 'RECEPTIONIST') {
          endpoint = '/receptionists/profile'
        }

        // SUPER_ADMIN and HOSPITAL_ADMIN currently
        // do not have profile endpoints.
        if (!endpoint) {
          return
        }

        const response = await api.get(endpoint)

        const profile = response.data

        const user = {
          ...profile,
          email:
            profile.email ||
            auth.user?.email ||
            auth.user?.sub ||
            '',
        }

        localStorage.setItem(
          'user',
          JSON.stringify(user),
        )

        setAuth((previous) => ({
          ...previous,
          user,
        }))
      } catch (error) {
        console.error(
          'Unable to load user profile:',
          error,
        )
      }
    }

    loadUserProfile()
  }, [auth.token, auth.role])

  const isAuthenticated = Boolean(auth.token)

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        role: auth.role,
        user: auth.user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
