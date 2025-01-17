'use client'

import React, { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
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
import { createNotebook } from '@/app/(ProtectedRoutes)/api/notebooks/api'
import { useApp } from '@/context/AppContext'
import notebookInput from "@/assets/notebookInput.svg"
import githubInput from "@/assets/githubInput.svg"

export default function CreateNotebook() {
  const router = useRouter()
  const { auth } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '3.9',
    packages: 'numpy'
  })
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

    let payload = {
      name: formData.name,
      python_version: formData.pythonVersion,
      // packages: [formData.packages],
      packages: [],
    }

    if (formData.githubURL && formData.githubURL !== '') {
      // @ts-expect-error build
      payload = { ...payload, github_url: formData.githubURL }
    }

    try {
      const response = await createNotebook(auth, payload)
      if (response) {
        router.push('/dashboard/notebooks')
      } else {
        setError('Failed to create notebook')
      }
    } catch (err) {
      setError('An error occurred while creating the notebook')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center items-center h-[92dvh]  '>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full ">
      <div className="text-center mb-8 relative">
        <h1 className="lg:text-2xl text-lg font-semibold mb-2">Create New Notebook</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="notebook-name" className="text-sm font-medium text-[#374151]">
            Notebook Name*
          </label>
         <div className="relative">
          <Input
              id="notebook-name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter notebook name"
              className={`max-w-full ${isNameTouched && formData.name === '' ? 'border-red-500' : ''}`}
            />
            <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
              <Image
                src={notebookInput}
                alt="notebookInput"
                height={15}
                width={15}
                className=" text-muted-foreground"
                />  
             </div>
         </div>
          {isNameTouched && formData.name === '' && (
            <p className="text-red-500 text-sm">Name cannot be empty.</p>
          )}
          {isNameTouched && (formData.name.includes('_') || formData.name.includes(' ')) && (
            <p className="text-red-500 text-sm">Name cannot contain an underscore (_) or spaces.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="github-url" className="text-sm font-medium text-[#374151]">
            GitHub Repository URL*
          </label>
          <div className="relative">
            <Input
              id="github-url"
              name="githubURL"
              value={formData.githubURL}
              onChange={(e) => handleChange('githubURL', e.target.value)}
              placeholder="https://github.com/username/repository"
              className=""
            />
             <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
              <Image
                src={githubInput}
                alt="githubInput"
                height={18}
                width={18}
                className="   text-muted-foreground"
                /> 
             </div>
              </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="python-version" className="text-sm font-medium text-[#374151]">
            Python Version
          </label>
          <Select 
            value={formData.pythonVersion} 
            onValueChange={(value) => handleChange('pythonVersion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Python version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3.7">Python 3.7</SelectItem>
              <SelectItem value="3.8">Python 3.8</SelectItem>
              <SelectItem value="3.9">Python 3.9</SelectItem>
              <SelectItem value="3.10">Python 3.10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="packages" className="text-sm font-medium text-[#374151]">
            Select Packages (Coming Soon)
          </label>
          <Select 
            disabled={true}
            value={formData.packages} 
            onValueChange={(value) => handleChange('packages', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select packages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="numpy">numpy</SelectItem>
              <SelectItem value="pandas">pandas</SelectItem>
              <SelectItem value="scipy">scipy</SelectItem>
              <SelectItem value="matplotlib">matplotlib</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="space-y-2 relative">
          <label htmlFor="hardware" className="text-sm font-medium">
            Hardware Configuration
          </label>
          <Select defaultValue="basic">
            <SelectTrigger>
              <SelectValue placeholder="Select hardware configuration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic (4 CPU, 16GB RAM, No GPU)</SelectItem>
              <SelectItem value="standard">Standard (8 CPU, 32GB RAM, 1 GPU)</SelectItem>
              <SelectItem value="advanced">Advanced (16 CPU, 64GB RAM, 2 GPU)</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {error && isNameTouched && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" className='text-[14px]' onClick={() => router.push('/dashboard/notebooks')}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className='bg-[#2563EB] text-[14px]'>
            {isLoading ? 'Creating...' : 'Create Notebook'}
          </Button>
        </div>
      </form>
    </div>
    </div>
  )
}

