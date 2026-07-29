import { createContext, useContext, useState } from 'react'

export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL

const TOKEN_KEY = 'citylibrary_token'
const USER_KEY = 'citylibrary_user'

const AuthContext = createContext(null)

async function parseJson(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    setToken(nextToken)
    setUser(nextUser)
  }

  const register = async ({ username, email, password }) => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await parseJson(response)

    if (!response.ok) {
      throw new Error(data.detail || 'Could not create account.')
    }

    persist(data.token, data.user)
    return data.user
  }

  const login = async ({ email, password }) => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await parseJson(response)

    if (!response.ok) {
      throw new Error(data.detail || 'Invalid email or password.')
    }

    persist(data.token, data.user)
    return data.user
  }

  const logout = () => persist(null, null)

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: Boolean(token), register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
