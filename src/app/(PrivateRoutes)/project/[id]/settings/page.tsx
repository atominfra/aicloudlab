"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, AlertTriangle } from 'lucide-react'
import { getOneProject, updateProject, deleteProject } from '@/app/(ProtectedRoutes)/api/projects/api'
import { useApp } from '@/context/AppContext'
import Loader from '@/components/loader'
import { CircularProgress, Modal } from '@mui/material'

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
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if(auth){
      fetchProjectData()
    }
  }, [id, auth])

  const fetchProjectData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const projectData = await getOneProject(auth, id as string)
      setProject(projectData.data)
      setNewProjectName(projectData.data.name)
    } catch (err) {
      setError('Failed to fetch project data')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }
  
  const handleSaveClick = async () => {
    setIsUpdating(true)
    setError(null)
    try {
      const updatedProject = await updateProject(auth, id as string, { name: newProjectName })
      setProject(updatedProject.data)
      setNewProjectName(updatedProject.data.name)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update project name')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleCancelClick = () => {
    setNewProjectName(project?.name || '')
    setIsEditing(false)
  }

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteConfirmation('')
  }

  const handleDeleteProject = async () => {
    if (deleteConfirmation === project?.name) {
      setIsDeleting(true)
      setError(null)
      try {
        await deleteProject(auth, id as string)
        closeDeleteModal()
        router.push('/dashboard/projects')
      } catch (err) {
        setError('Failed to delete project')
        console.error(err)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return <div className="min-h-[92dvh] flex items-center justify-center">
      <Loader/>
    </div>
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
                    <h3 className="text-base ">{project?.name}</h3>
                  </div>
                )}
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleSaveClick} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <CircularProgress size={16} color="inherit" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelClick} disabled={isUpdating}>
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
            <Button variant="destructive" size="sm" onClick={openDeleteModal} disabled={isLoading}>
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal} className="w-full h-full justify-items-center content-center">
        <div className="p-6 bg-white shadow-xl rounded-[10px] w-full max-w-[588px]">
          <p className="flex gap-2 items-center pb-4 text-[20px] font-semibold text-[#111827]">
            <AlertTriangle className="text-red-500" />
            <span>Delete Project</span>
          </p>
          <p className="pb-4 text-[#374151] text-base">
            This action cannot be undone. Please type the project&apos;s name to confirm deletion:
          </p>
          <div className='mb-4 p-4 border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
            <div className='text-[#4B5563] text-sm'>Project name:</div>
            <div className='font-medium text-[#111827] text-base'>{project?.name}</div>
          </div>
          <Input 
            placeholder="Type project name to confirm" 
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="max-w-full placeholder:text-[#9CA3AF] text-sm mb-4"
          />
          <div className="flex justify-end gap-4">
            <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProject}
              disabled={deleteConfirmation !== project?.name || isDeleting}
            >
              {isDeleting ? (
                <>
                  <CircularProgress size={16} color="inherit" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

