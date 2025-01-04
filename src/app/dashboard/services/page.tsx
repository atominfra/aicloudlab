'use client'

import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from '@/context/AppContext'
import CreditsModal from "@/components/modals/creditsModal"
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { Router } from 'lucide-react'
import withAuth from '@/components/withAuth'
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Service = {
  id: string
  name: string
  status: string
  notebook_url: string
  python_version: string
}
const mockServices = [
  {
    id: "1",
    name: "InboundJs",
    status: "running",
    memory: "500 MB",
    cpu: "0.5",
    replicas: 5
  },
  {
    id: "2",
    name: "AuthService",
    status: "stopped",
    memory: "1 GB",
    cpu: "1.0",
    replicas: 3
  },
  {
    id: "3",
    name: "PaymentAPI",
    status: "error",
    memory: "2 GB",
    cpu: "2.0",
    replicas: 2
  }
]
const ServicesPage = () => {
  const router = useRouter()
  const { setServices, fetchUserDetails } = useApp()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [services, setServicesState] = useState<Service[]>([])
  const [envVariables, setEnvVariables] = useState<{ key: string; value: string }[]>([])

  const handleCreateClick = () => {
    router.push('/create/service')
  }

  useEffect(() => {
    router.prefetch('/create/service')
  }, [router])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        setServices(responseData.data.services)
        setServicesState(responseData.data.services)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch services')
      }
    } catch (err) {
      setError('An error occurred while fetching services')
    } finally {
      setLoading(false)
    }
  }

  const handleOperationRequest = async (serviceId: string, operationName: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          service_id: serviceId,
          operation_name: operationName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Operation failed')
      }
      if (operationName === 'delete') {
        setLoading(true)
        fetchServices()
        fetchUserDetails()
      }
      const result = await response.json()
      console.log('Operation successful:', result)
    } catch (error) {
      setError(error?.message)
    }
    fetchServices()
    fetchUserDetails()
  }

  useEffect(() => {
    fetchServices()
    fetchUserDetails()
  }, [])

  const addEnvVariable = () => {
    setEnvVariables([...envVariables, { key: '', value: '' }])
  }

  const removeEnvVariable = (index: number) => {
    setEnvVariables(envVariables.filter((_, i) => i !== index))
  }

  const updateEnvVariable = (index: number, field: 'key' | 'value', value: string) => {
    const newVariables = [...envVariables]
    newVariables[index][field] = value
    setEnvVariables(newVariables)
  }

  return (
    <div className="p-4 bg-neutral-100 lg:h-screen h-[92dvh] justify-center items-center">
      <div className="flex items-center justify-end lg:mb-6 mb-5 h-[6vh]">
        {/* <h1 className="text-lg lg:text-2xl font-semibold">Services</h1> */}
        <Button className="bg-blue-600" onClick={handleCreateClick}>
          <span className="">+</span>
          Create
        </Button>
      </div>
      {mockServices.length === 0 ? (
        <Box className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh] w-full">
          <Router 
            className="w-[100px] h-[100px] text-neutral-300"
          />
          <Typography variant="body1" className="text-gray-400 mb-4 px-6">
            No services yet.
          </Typography>
        </Box>
      ) : (
        <div className="flex flex-col items-center lg:h-[80vh] h-[70vh] w-full">
          {mockServices.map((service) => (
            // @ts-expect-error build
            <ServiceCard
              key={service.id}
              {...service}
              onOperation={handleOperationRequest}
            />
          ))}
        </div>
      )}
      <CreditsModal showModal={showModal} onClose={() => setShowModal(false)} />

  </div>
  )
}

export default withAuth(ServicesPage)

