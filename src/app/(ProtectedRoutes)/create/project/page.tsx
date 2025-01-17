'use client'

import React, { useState, useEffect } from 'react'
import { FolderInput, FolderOpen, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { createProject } from '@/app/(ProtectedRoutes)/api/projects/api'
import { useApp } from '@/context/AppContext'
import notebookInput from "@/assets/notebookInput.svg"
import githubInput from "@/assets/githubInput.svg"

export default function CreateProject() {
  const router = useRouter()
  const { auth } = useApp()
  const [formData, setFormData] = useState({
    projectName: '',
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
    if (name === 'projectName' && value.trim() !== '') {
      setIsNameTouched(true)
      setError(null) 
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsNameTouched(true)
    setError(null)
    setIsLoading(true)

    if (formData.projectName.includes('_') || formData.projectName.includes(' ')) {
      setError('Name cannot contain an underscore (_) or spaces.')
      setIsLoading(false)
      return
    }

    if (formData.projectName === '') {
      setError('Please enter a name')
      setIsLoading(false)
      return
    }

    let userId: string | null = null;
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userId = userData.id;
      }
      
      if (!userId) {
        throw new Error('User ID not found');
      }
    } catch (err) {
      setError('Failed to retrieve user information. Please log in again.');
      setIsLoading(false);
      return;
    }

    const payload = {
      name: formData.projectName,
      // user_id: userId,
    }

    try {
      const response = await createProject(auth, payload)
      if (response) {
        router.push('/dashboard/projects')
      } else {
        setError('Failed to create project')
      }
    } catch (err) {
      setError('An error occurred while creating the project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center  h-[92dvh]  '>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full ">
      <div className="text-center mb-8 relative">
        <h1 className="lg:text-2xl text-lg font-semibold mb-2">Create New Project</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium text-[#374151]">
            Project Name*
          </label>
         <div className="relative">
          <Input
              id="project-name"
              name="projectName"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="Enter project name"
              className={`max-w-full ${isNameTouched && formData.projectName === '' ? 'border-red-500' : ''}`}
            />
            <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
                <FolderOpen className=" text-muted-foreground h-[15px] w-[15px]"/>
             </div>
         </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" className='text-[14px]' onClick={() => router.push('/dashboard/projects')}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className='bg-[#2563EB] text-[14px]'>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
    </div>
  )
}

