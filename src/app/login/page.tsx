'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, Users, ArrowLeftRight, PiggyBank, Eye, EyeOff } from 'lucide-react'
import { MdEmail, MdLock } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/AuthContext'
import logo from "@/assets/logo.webp"

interface FormData {
  identifier: string
  password: string
}

interface FormErrors {
  identifier?: string
  password?: string
}

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex items-start space-x-4 mb-2 ">
    {/* <div className="mt-1 p-2 bg-sky-200 rounded-lg relative bottom-[6px]">
      {icon}
    </div> */}
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
)

export default function Login() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { login, loading, loginError, setLoginError } = useAuth()
  const [auth, setAuth] = useState('')

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
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined })
    }
    setLoginError('')
  }

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    login(formData)
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen relative w-full bg-[#DBEAFE] md:bg-gradient-to-br from-[#DBEAFE] to-white">
      <div className="container mx-auto min-h-screen lg:max-w-[93vw]">
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8">
          
          {/* Left side - Features */}
          <div className="hidden pr-12 md:flex flex-col lg:p-12 p-6">
            <div className='flex flex-col  justify-center gap-8'>
              {/* <Feature
                icon={<ArrowLeftRight className="h-6 w-6 text-[#2563EB]" />}
                title="Vercel for AI Deployment"
                description="Seamlessly manage deployments across various providers through a consistent and user-friendly interface"
              /> */}
                <div className='flex items-center justify-center '>
              <Image
                src={logo}
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
              <div className='text-center text-[35px] font-semibold text-gray-900 '>Vercel for AI Deployments</div>
              {/* <Feature
                icon={<Users className="h-6 w-6 text-[#2563EB]" />}
                title="User-Friendly Interface"
                description="Manage deployments through a simple interface built for humans, not just engineers."
              />
              <Feature
                icon={<PiggyBank className="h-6 w-6 text-[#2563EB]" />}
                title="Cost Savings"
                description="Choose the most cost-effective provider and save money."
              /> */}
            </div>
          </div>

            <div className='flex md:hidden justify-center pt-12'> 
              <div className='flex items-center'>
                  <Image
                    src={logo}
                    width={30}
                    height={30}
                    alt="Atom Infra Logo"
                    className='h-[29px] w-[30px]'
                    priority
                  />
                  <div 
                    className='relative text-[29px] font-[700] tracking-tight l-[30px]' 
                    style={{ left: '-2px' }}
                  >
                    tom Infra
                  </div>
                </div>
            </div>
          {/* Right side - Login form */}
          <div className="w-full max-w-xl mx-auto  h-[80vh] md:h-[100vh] overflow-y-scroll no-scrollbar flex justify-center items-center">
            <div className="bg-white lg:p-12 p-6 rounded-[16px] lg:shadow-xl w-full">
              <div className="text-[24px] md:text-[28px] font-semibold text-gray-900 h-[10%]">Log In</div>
              <h1 className="text-[15px] font-normal tracking-tight pb-4 text-gray-500">
                Don&apos;t have an account?
                <span className="text-blue-600 hover:underline hover:cursor-pointer pl-1" onClick={() => window.location.href = '/signup'}>
                  Sign Up
                </span>
              </h1>
              <div className='h-[100%] flex flex-col justify-center items-center'>
                <form onSubmit={handleLogIn} className="flex flex-col justify-center items-center w-full gap-4 md:gap-8">
                  <div className="space-y-2 w-[95%]">
                    <Label htmlFor="identifier" className="hidden md:block text-[16px] font-medium text-gray-700">
                      Email 
                    </Label>
                    <div className="relative flex items-center">
                      <MdEmail className="absolute left-3 text-gray-400 h-5 w-5" />
                      <Input
                        id="identifier"
                        name="identifier"
                        type="text"
                        value={formData.identifier}
                        onChange={handleChange}
                        className={`pl-10 h-11 border-gray-200 rounded-lg ${
                          errors.identifier ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email "
                      />
                    </div>
                    {errors.identifier && (
                      <p className="text-sm text-red-500">{errors.identifier}</p>
                    )}
                  </div>

                  <div className="space-y-2 w-[95%]">
                    <Label htmlFor="password" className="hidden md:block text-[16px] font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative flex items-center">
                      <MdLock className="absolute left-3 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 h-11 border-gray-200 rounded-lg ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
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
                    className="w-full h-11 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[14px]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Log In'
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

