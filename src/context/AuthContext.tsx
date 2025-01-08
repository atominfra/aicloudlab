"use client"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  full_name: string
  email: string
  credits: number
  phone: string
  gh_username: string
  google_username: string
  hf_username: string
} | null

type AuthContextType = {
  user: User
  setUser: (user: User) => void
  signin: (formdata: formdata) => Promise<void>
  logout: () => void
  loading: boolean
  loginError: string
  setLoginError: (error: string) => void
}

type formdata = {
  identifier: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signin = async (formdata: formdata) => {
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      })

      const responseData = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(responseData.data.user))
        localStorage.setItem('access_token', responseData.data.access_token)
        document.cookie = `access_token=Bearer ${responseData.data.access_token}; expires=${new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/; domain=.${window.location.hostname}`
        window.location.href = '/dashboard/services'
      } else {
        setLoginError(responseData.message || 'An unexpected error occurred. Please try again.')
      }
    } catch (error) {
      console.error("Error during signin", error)
      setLoginError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signin, loginError, setLoginError, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

