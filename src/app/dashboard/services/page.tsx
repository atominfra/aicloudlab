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
      <div className="flex items-center justify-between lg:mb-6 mb-5 h-[6vh]">
        <h1 className="text-lg lg:text-2xl font-semibold">Services</h1>
        <Button className="bg-blue-600" onClick={handleCreateClick}>
          <span className="">+</span>
          Create
        </Button>
      </div>
      {services.length === 0 ? (
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
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              onOperation={handleOperationRequest}
            />
          ))}
        </div>
      )}
      <CreditsModal showModal={showModal} onClose={() => setShowModal(false)} />

      {/* Service Creation Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Service</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <Input placeholder="Enter image link" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Environment Variables</label>
            {envVariables.map((variable, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Key"
                  value={variable.key}
                  onChange={(e) => updateEnvVariable(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => updateEnvVariable(index, 'value', e.target.value)}
                />
                <Button variant="outline" onClick={() => removeEnvVariable(index)}>Remove</Button>
              </div>
            ))}
            <Button variant="outline" className="mt-2" onClick={addEnvVariable}>Add Variable</Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Memory Limit</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select memory limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="512mb">512 MB</SelectItem>
                <SelectItem value="1gb">1 GB</SelectItem>
                <SelectItem value="2gb">2 GB</SelectItem>
                <SelectItem value="4gb">4 GB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CPU Limit</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select CPU limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5 CPU</SelectItem>
                <SelectItem value="1">1 CPU</SelectItem>
                <SelectItem value="2">2 CPU</SelectItem>
                <SelectItem value="4">4 CPU</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registry Credential</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select registry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal (ghcr.io)</SelectItem>
                <SelectItem value="docker">Docker Hub</SelectItem>
                <SelectItem value="gcr">Google Container Registry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replicas</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select replicas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Replica</SelectItem>
                <SelectItem value="2">2 Replicas</SelectItem>
                <SelectItem value="3">3 Replicas</SelectItem>
                <SelectItem value="4">4 Replicas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Deploy Service
          </Button>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ServicesPage)

