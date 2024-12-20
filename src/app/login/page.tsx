'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { MdEmail } from "react-icons/md"; 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from 'next-themes'
import { MdLock } from "react-icons/md"; 

interface FormData {
  identifier: string
  password: string
}

interface FormErrors {
  identifier?: string
  password?: string
}

export default function Login() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [loginError, setLoginError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  })

  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [auth, setAuth] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setAuth(token)
    }
  }, [])

  useEffect(() => {
    if (auth && auth !== '') {
      window.location.href = '/dashboard'
    }
  }, [auth])

  const validateForm = () => {
    const newErrors: FormErrors = {}
    if (!formData.identifier) {
      newErrors.identifier = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.identifier)) {
      newErrors.identifier = 'Email address is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined })
    }
    setLoginError('') // Clear login error when user makes changes
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(responseData.data.user))
        localStorage.setItem('access_token', responseData.data.access_token)
        document.cookie = `access_token=Bearer ${responseData.data.access_token}; expires=${new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/; domain=.${window.location.hostname}`
        window.location.href = '/dashboard/notebooks'
      } else {
        setLoginError(responseData.message || 'An unexpected error occurred. Please try again.')
      }
    } catch (error) {
      console.error("Error during login", error)
      setLoginError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative w-full bg-gradient-to-br from-[#DBEAFE] to-white ">
      <div className='p-6 absolute hidden lg:block'>
      <Image
          src='https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png'
          width={40}
          height={40}
          alt="AI Cloud Lab Logo"
          // className="w-[44px] h-[44px] "
            />
      </div>
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4 ">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center ">
          {/* Left Section */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
            <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
              Welcome to <span className="font-bold">AI Cloud Lab!</span>
            </h1>
            <p className="hidden lg:block text-lg text-gray-600 dark:text-gray-300">
              Seamless AI <span className="font-semibold">development,</span>{' '}
              <span className="font-semibold">deployment</span> and{' '}
              <span className="font-semibold">monitoring</span> in Cloud all through one interface!
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full max-w-md mx-auto space-y-6 bg-white p-6 rounded-[8px]">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className='text-[14px] font-medium'>Email or Phone number</Label>
                <div className="relative flex items-center">
                <MdEmail className="absolute left-3 text-gray-400" /> {/* Email icon */}
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.identifier ? "border-red-500 dark:border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
                {errors.identifier && (
                  <p className="text-sm text-red-500">{errors.identifier}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className='text-[14px] font-medium'>Password</Label>
                <div className="relative flex items-center">
                  <MdLock className="absolute left-3 text-gray-400" /> {/* Lock icon */}
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                      errors.password ? "border-red-500 dark:border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {loginError && (
                <p className="text-sm text-red-500 text-center">{loginError}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#2563EB]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border border-[#2563EB] text-[#2563EB]"
              onClick={() => window.location.href = '/signup'}
            >
              Sign up for new account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

