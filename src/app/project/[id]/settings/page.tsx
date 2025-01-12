"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react'
import { getOneProject, updateProject, deleteProject } from '@/app/api/projects/api'
import { useApp } from '@/context/AppContext'

interface Project {
  id: string
  name: string
  servicesRunning: number
}

export default function ProjectSettings() {
  const { id } = useParams()
  const router = useRouter()
  const { auth } = useApp()
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(auth){
      const fetchProjectData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const projectData = await getOneProject(auth, id as string)
          console.log("projectData", projectData)
          setProject(projectData.data)
          setNewProjectName(projectData.data.name)
        } catch (err) {
          setError('Failed to fetch project data')
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchProjectData()
    }

  }, [id, auth])

  const handleEditClick = () => {
    setIsEditing(true)
  }
  
  const handleSaveClick = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedProject = await updateProject(auth, id as string, { name: newProjectName })
      setProject(updatedProject)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update project name')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCancelClick = () => {
    setNewProjectName(project?.name || '')
    setIsEditing(false)
  }

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteProject(auth, id as string)
        router.push('/dashboard/projects')
      } catch (err) {
        setError('Failed to delete project')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }


  return (
    <div className="min-h-[92dvh] lg:p-4 bg-background">
      <Card className="mx-auto max-w-2xl bg-background shadow-none border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Project Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 bg-white border border-destructive/10 p-6 rounded-lg">
            <h3 className="text-base font-semibold">Project Information</h3>
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                {isEditing ? (
                  <div className="flex-grow">
                    <label className="text-sm font-medium text-[#6B7280]">Project Name</label>
                    <Input
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="w-full border-b pb-1 ">
                    <label className="text-sm font-medium text-[#6B7280] ">Project Name</label>
                    <h3 className="text-base ">{project.name}</h3>
                  </div>
                )}
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleSaveClick} disabled={isLoading}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelClick} disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={handleEditClick} disabled={isLoading}>
                    <Pencil className="h-4 w-4" />
                    <span className="ml-2">Rename</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-300 bg-white p-6 space-y-3">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a project, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm" onClick={handleDeleteProject} disabled={isLoading}>
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

