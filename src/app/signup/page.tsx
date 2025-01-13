'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, Users, ArrowLeftRight, PiggyBank } from 'lucide-react'
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
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

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex items-start space-x-4 mb-8 ">
    <div className="mt-1 p-2 bg-sky-200 rounded-lg relative bottom-[6px]">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
)

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
        window.location.href = '/dashboard/projects'
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
    <div className="min-h-screen relative w-full bg-white lg:bg-gradient-to-br from-[#DBEAFE] to-white">
      <div className="container mx-auto min-h-screen lg:max-w-[93vw]">
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8  items-center px-8">
          {/* Left side - Features */}
          <div className="hidden  pr-12  md:flex flex-col  lg:p-12 p-6" >
          <div className=" h-[20vh] w-[50vw]   hidden lg:block">
            <div className='flex items-center'>
              <Image
                src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png" 
                width={30}
                height={30}
                alt="Atom Infra Logo"
                className='h-[47px] w-[48px]'
                priority
              />
              <div className='relative text-[49px] font-[700] tracking-tight l-[30px]' style={{ left: '-2px' }}>
                tom Infra
              </div>
            </div>
          </div>
           <div className='flex flex-col h-full justify-center  gap-8'>
           <Feature
              icon={<ArrowLeftRight className="h-6 w-6 text-[#2563EB]" />}
              title="Flexibility"
              description="Switch between compute providers easily as your needs change without being locked in."
            />
            <Feature
              icon={<Users className="h-6 w-6 text-[#2563EB]" />}
              title="User-Friendly Interface"
              description="Manage deployments through a simple interface built for humans, not just engineers."
            />
            <Feature
              icon={<PiggyBank className="h-6 w-6 text-[#2563EB]" />}
              title="Cost Savings"
              description="Choose the most cost-effective provider and save money."
            />
           </div>
          </div>

          {/* Right side - Signup form */}
          <div className="w-full max-w-xl  mx-auto h-[100vh] overflow-y-scroll no-scrollbar  flex justify-center items-center">
            <div className="bg-white lg:p-12 p-6 rounded-[16px]  lg:shadow-xl w-full">
              <div className="text-[28px] font-semibold  text-gray-900 h-[10%]">Sign Up</div>
              <h1 className="text-[15px] font-normal tracking-tight pb-4  text-gray-500" > Already have an account?  
                <span className="text-blue-600 hover:underline hover:cursor-pointer pl-1" onClick={() => window.location.href = '/login'} >Log In</span>
              </h1>
             <div className='h-[100%]  flex flex-col justify-center items-center '>
             <form onSubmit={handleSubmit} className="  flex flex-col  justify-center items-center w-full gap-4 ">
                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="full_name" className="text-[16px] font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative flex items-center">
                    <MdPerson className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.full_name ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="email" className="text-[16px] font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative flex items-center">
                    <MdEmail className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="phone" className="text-[16px] font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative flex items-center">
                    <MdPhone className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="password" className="text-[16px] font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative flex items-center">
                    <MdLock className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="reEnterPassword" className="text-[16px] font-medium text-gray-700">
                    Re-enter Password
                  </Label>
                  <div className="relative flex items-center">
                    <MdLock className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="reEnterPassword"
                      name="reEnterPassword"
                      type="password"
                      value={formData.reEnterPassword}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.reEnterPassword ? "border-red-500" : ""
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
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[14px] mt-4" 
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
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

