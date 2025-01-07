'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, Users, ArrowLeftRight, PiggyBank } from 'lucide-react'
import { MdEmail, MdLock } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/AuthContext'

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

export default function Login() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  })

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    login(formData)
  }

  return (
    <div className="min-h-screen relative w-full bg-white lg:bg-gradient-to-br from-[#DBEAFE] to-white">
      <div className="container mx-auto min-h-screen lg:max-w-[93vw]">
        
        <div className=" h-[5vh] pt-10 pb-4  px-20  hidden lg:block">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[90vh] items-center px-8">
          {/* Left side - Features */}

          <div className="hidden  space-y-8 pr-12  md:flex flex-col  lg:p-12 p-6" >
              
             
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

          {/* Right side - Login form */}
          <div className="w-full max-w-xl  mx-auto  flex justify-center items-center">
            <div className="bg-white lg:p-12 p-6 rounded-[16px]  lg:shadow-xl w-full ">
              <div className="text-[28px] font-semibold  text-gray-900 h-[10%]">Sign In</div>
              <h1 className="text-[15px] font-normal tracking-tight pb-12  text-gray-500" > Don’t have an account? 
                <span className="text-blue-600 hover:underline hover:cursor-pointer pl-1" onClick={() => window.location.href = '/signup'} >Sign Up</span>
              </h1>
             <div className='h-[90%]  flex flex-col justify-center items-center '>
             <form onSubmit={handleLogin} className="space-y-6 flex flex-col  justify-center items-center w-full gap-4 ">
                <div className="space-y-2 w-[95%]">
                  <Label htmlFor="identifier" className="text-[16px] font-medium text-gray-700">
                    Email or Phone Number
                  </Label>
                  <div className="relative flex items-center">
                    <MdEmail className="absolute left-3 text-gray-400 h-5 w-5" />
                    <Input
                      id="identifier"
                      name="identifier"
                      type="text"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={`pl-10 h-11  border-gray-200 rounded-lg ${
                        errors.identifier ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email or phone"
                    />
                  </div>
                  {errors.identifier && (
                    <p className="text-sm text-red-500">{errors.identifier}</p>
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
                    'Login'
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

