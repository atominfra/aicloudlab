'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import notebookInput from "@/assets/notebookInput.svg"
import githubInput from "@/assets/githubInput.svg"
import { GalleryVerticalEnd } from 'lucide-react'
interface EnvVariable {
  key: string
  value: string
}

export default function CreateService() {
  const router = useRouter()
  const { auth } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    memoryLimit: '',
    cpuLimit: '',
    registryCredential: '',
    replicas: '',
  })
  const [envVariables, setEnvVariables] = useState([{ key: '', value: '' }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNameTouched, setIsNameTouched] = useState(false)

  useEffect(() => {
    return () => {
      setError(null);
      setIsNameTouched(false);
    };
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'name' && value.trim() !== '') {
      setIsNameTouched(true)
      setError(null) 
    }
  }

  const handleEnvVariableChange = (index: number, field: 'key' | 'value', value: string) => {
    const newVariables = [...envVariables]
    newVariables[index][field] = value
    setEnvVariables(newVariables)
  }

  const addEnvVariable = () => {
    setEnvVariables([...envVariables, { key: '', value: '' }])
  }

  const removeEnvVariable = (index: number) => {
    setEnvVariables(envVariables.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsNameTouched(true)
    setError(null)
    setIsLoading(true)

    if (formData.name.includes('_') || formData.name.includes(' ')) {
      setError('Name cannot contain an underscore (_) or spaces.')
      setIsLoading(false)
      return
    }

    if (formData.name === '') {
      setError('Please enter a name')
      setIsLoading(false)
      return
    }

    // Add your service creation logic here

    try {
      // Implement your service creation API call here
      // const response = await createService(auth, formData, envVariables)
      // if (response) {
      //   router.push('/dashboard/services')
      // } else {
      //   setError('Failed to create service')
      // }
    } catch (err) {
      setError('An error occurred while creating the service')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen h-[92dvh] overflow-auto'>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full mt-4">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Create New Service</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* <div className="space-y-2">
            <label htmlFor="service-name" className="text-sm font-medium text-[#374151]">
              Service Name*
            </label>
            <div className="relative">
              <Input
                id="service-name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter service name"
                className={`max-w-full ${isNameTouched && formData.name === '' ? 'border-red-500' : ''}`}
              />
              <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
                <Image
                  src={notebookInput}
                  alt="serviceInput"
                  height={15}
                  width={15}
                  className="text-muted-foreground"
                />  
              </div>
            </div>
            {isNameTouched && formData.name === '' && (
              <p className="text-red-500 text-sm">Name cannot be empty.</p>
            )}
            {isNameTouched && (formData.name.includes('_') || formData.name.includes(' ')) && (
              <p className="text-red-500 text-sm">Name cannot contain an underscore (_) or spaces.</p>
            )}
          </div> */}

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-[#374151]">
              Image*
            </label>
            <div className="relative">
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="Enter image link"
                className=""
              />
              <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
                <GalleryVerticalEnd size={18} className="bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Environment Variables
            </label>
            {envVariables.map((variable, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={variable.key}
                  onChange={(e) => handleEnvVariableChange(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => handleEnvVariableChange(index, 'value', e.target.value)}
                />
                <Button type="button" variant="outline" onClick={() => removeEnvVariable(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEnvVariable}>
              Add Variable
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="memory-limit" className="text-sm font-medium text-[#374151]">
              Memory Limit
            </label>
            <Select 
              value={formData.memoryLimit} 
              onValueChange={(value) => handleChange('memoryLimit', value)}
            >
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

          <div className="space-y-2">
            <label htmlFor="cpu-limit" className="text-sm font-medium text-[#374151]">
              CPU Limit
            </label>
            <Select 
              value={formData.cpuLimit} 
              onValueChange={(value) => handleChange('cpuLimit', value)}
            >
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

          <div className="space-y-2">
            <label htmlFor="registry-credential" className="text-sm font-medium text-[#374151]">
              Registry Credential
            </label>
            <Select 
              value={formData.registryCredential} 
              onValueChange={(value) => handleChange('registryCredential', value)}
            >
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

          <div className="space-y-2">
            <label htmlFor="replicas" className="text-sm font-medium text-[#374151]">
              Replicas
            </label>
            <Select 
              value={formData.replicas} 
              onValueChange={(value) => handleChange('replicas', value)}
            >
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

          {error && isNameTouched && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" className='text-[14px]' onClick={() => router.push('/dashboard/services')}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className='bg-[#2563EB] text-[14px]'>
              {isLoading ? 'Creating...' : 'Deploy Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

