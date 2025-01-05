'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from 'next-themes'
import { toast } from 'react-hot-toast'

interface FormData {
  full_name: string
  email: string
  phone: string
  password: string
  reEnterPassword: string
}

interface FormErrors {
  full_name?: string
  email?: string
  phone?: string
  password?: string
  reEnterPassword?: string
}

export default function Signup() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [signupError, setSignupError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    reEnterPassword: '',
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
    if (!formData.full_name) newErrors.full_name = 'Full name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters long'
    }
    if (!formData.reEnterPassword) {
      newErrors.reEnterPassword = 'Please confirm your password'
    } else if (formData.reEnterPassword !== formData.password) {
      newErrors.reEnterPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined })
    }
    setSignupError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const { reEnterPassword, ...data } = formData
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        toast.error(responseData.message || 'Signup failed')
        setSignupError(responseData.message || 'An unexpected error occurred. Please try again.')
      }
    } catch (error) {
      console.error("Error during signup", error)
      setSignupError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative w-full bg-gradient-to-br from-[#DBEAFE] to-white ">
      <div className='p-4 lg:absolute'>
        <div className='flex items-center '>
          <Image
            src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png" 
            width={30}
            height={30}
            alt="Atom Infra Logo"
            className='h-[30px] w-[30px]'
            priority
          /> 
          <div className='text-[28px] font-[700] tracking-tight'>
            tom Infra
          </div>
        </div>
      </div>
      
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-[8px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className='text-[14px] font-medium'>Full Name</Label>
              <div className="relative flex items-center">
                <MdPerson className="absolute left-3 text-gray-400" />
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.full_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className='text-[14px] font-medium'>Email</Label>
              <div className="relative flex items-center">
                <MdEmail className="absolute left-3 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className='text-[14px] font-medium'>Phone Number</Label>
              <div className="relative flex items-center">
                <MdPhone className="absolute left-3 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className='text-[14px] font-medium'>Password</Label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reEnterPassword" className='text-[14px] font-medium'>Re-enter Password</Label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3 text-gray-400" />
                <Input
                  id="reEnterPassword"
                  name="reEnterPassword"
                  type="password"
                  value={formData.reEnterPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-3 py-2 border rounded-md w-full ${
                    errors.reEnterPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Re-enter your password"
                />
              </div>
              {errors.reEnterPassword && (
                <p className="text-sm text-red-500">{errors.reEnterPassword}</p>
              )}
            </div>

            {signupError && (
              <p className="text-sm text-red-500 text-center">{signupError}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2563EB]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <span className="flex-1 border-t border-[#6B7280]" />
            <span className="px-2 text-xs uppercase bg-white text-gray-500">or</span>
            <span className="flex-1 border-t border-[#6B7280]" />
          </div>
          
          <Button
            variant="outline"
            className="w-full border border-[#2563EB] text-[#2563EB]"
            onClick={() => window.location.href = '/login'}
          >
            Log in to existing account
          </Button>
        </div>
      </div>
    </div>
  )
}

