"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCcw, Trash2, AlertTriangle, ExternalLink } from 'lucide-react'
import { DNSConfigurationDialog } from '@/components/dns-configuration-dialog'
import { getServiceDomains, addDomainToService, verifyDomain, deleteService } from '@/app/api/services/api'
import { useApp } from '@/context/AppContext'
import { toast } from 'react-hot-toast'
import { CircularProgress, Modal } from '@mui/material'

interface Domain {
  domain_name: string
  status: boolean
  id: number
  public_ip_address: string
  service_id: string
}

export default function ServiceSettings({ params }: { params: { id: string } }) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { auth } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const serviceName = searchParams.get('serviceName')
  const fetchDomains = async () => {
    setIsLoading(true)
    try {
      const data = await getServiceDomains(auth, params.id)
      setDomains(data.data.domains)
    } catch (error) {
      console.error('Failed to fetch domains:', error)
      toast.error('Failed to fetch domains')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDomain = async () => {
    if (newDomain) {
      try {
        await addDomainToService(auth, params.id, newDomain)
        await fetchDomains()
        setNewDomain('')
      } catch (error) {
        console.error('Failed to add domain:', error)
        toast.error('Failed to add domain')
      }
    }
  }

  const handleDeleteDomain = async (domainId: number) => {
    try {
      // Implement delete domain API call here
      // await deleteDomain(auth, domainId)
      await fetchDomains()
      toast.success('Domain deleted successfully')
    } catch (error) {
      console.error('Failed to delete domain:', error)
      toast.error('Failed to delete domain')
    }
  }

  const handleRefreshDomain = async (domainId: number) => {
    setIsRefreshing(true)
    try {
      const data = await verifyDomain(auth, domainId)
      console.log(data)
      if(data.error="true"){
        toast.error("Domain not Connected")
      }else{
        toast.success("Domain Connected")
      }
      await fetchDomains()
    } catch (error) {
      console.error('Failed to verify domain:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteConfirmation('')
  }

  const handleDeleteService = async () => {
    if (deleteConfirmation === 'DELETE') {
      setIsDeleting(true)
      try {
        await deleteService(auth, params.id)
        closeDeleteModal()
        router.push(`/project/${projectId}`)
      } catch (error) {
        console.error('Failed to delete service:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  useEffect(() => {
    if (auth) {
      fetchDomains()
    }
  }, [auth, params.id])

  return (
    <div className="min-h-[92dvh] lg:p-4 bg-background">
      <Card className="mx-auto max-w-2xl bg-background shadow-none border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Service Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 bg-white border border-destructive/10 p-6 rounded-lg">
            <h3 className="text-base font-semibold">Domains</h3>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Add your Domain..."
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleAddDomain} className='bg-blue-600' disabled={isLoading}>Add Domain</Button>
            </div>

            {isLoading ? (
              <p>Loading domains...</p>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div
                    key={domain.domain_name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="w-[90%] flex items-center gap-3">
                      <div className='w-[50%] flex items-center gap-1'>{domain.domain_name} {domain.status === true && <div className='text-blue-700 hover:cursor:pointer ' onClick={() => window.open(`https://${domain.domain_name}`, '_blank')}><ExternalLink size={14}  /></div>} </div> 
                      <div className='w-[50%]'>
                        {domain.status === false && (
                          <DNSConfigurationDialog domain={domain.domain_name} nodeIp={domain.public_ip_address} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleRefreshDomain(domain.id)}
                        disabled={isRefreshing}
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDomain(domain.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-red-300 bg-white p-6 space-y-3">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a service, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm" onClick={openDeleteModal}>
              Delete Service
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal} className="w-full h-full justify-items-center content-center">
        <div className="p-6 bg-white shadow-xl rounded-[10px] w-full max-w-[588px]">
          <p className="flex gap-2 items-center pb-4 text-[20px] font-semibold text-[#111827]">
            <AlertTriangle className="text-red-500" />
            <span>Delete Service</span>
          </p>
          <p className="pb-4 text-[#374151] text-base">
            This action cannot be undone. Please type DELETE to confirm deletion:
          </p>
          <div className='mb-4 p-4 border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
            <div className='text-[#4B5563] text-sm'>Type DELETE to confirm:</div>
          </div>
          <Input 
            placeholder="Type DELETE to confirm" 
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
              onClick={handleDeleteService}
              disabled={deleteConfirmation !== 'DELETE' || isDeleting}
            >
              {isDeleting ? (
                <>
                  <CircularProgress size={16} color="inherit" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Service'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

