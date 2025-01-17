"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCcw, Trash2, AlertTriangle, ExternalLink } from 'lucide-react'
import { DNSConfigurationDialog } from '@/components/dns-configuration-dialog'
import { getServiceDomains, addDomainToService, verifyDomain, deleteService } from '@/app/(ProtectedRoutes)/api/services/api'
import { useApp } from '@/context/AppContext'
import { toast } from 'react-hot-toast'
import { CircularProgress, Modal } from '@mui/material'
import { DeleteNodeModal } from '@/components/delete-modal'

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
      if(data.error==="true"){
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
  }

  const handleDeleteService = async () => {
      setIsDeleting(true)
      try {
        await deleteService(auth, params.id)
        closeDeleteModal()
        router.push(`/project/${projectId}?viewType=services`)
      } catch (error) {
        console.error('Failed to delete service:', error)
      } finally {
        setIsDeleting(false)
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
            <CardTitle className="text-xl font-semibold">Service Settings : {serviceName}</CardTitle>
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
                    <div className="w-[90%] flex flex-col items-start gap-2">
                      <div className='w-[50%] flex items-center gap-1 text-sm font-semibold'>{domain.domain_name} {domain.status === true && <div className='text-blue-700 hover:text-blue-400 hover:cursor-pointer ' onClick={() => window.open(`http://${domain.domain_name}`, '_blank')}><ExternalLink size={14}  /></div>} </div> 
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
                        {/* <span>{isRefreshing ? "Refreshing" : "Refresh"}</span> */}
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
      <DeleteNodeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteService}
        name={serviceName}
        isLoading={isDeleting}
        type="service"
      />
    </div>
  )
}

