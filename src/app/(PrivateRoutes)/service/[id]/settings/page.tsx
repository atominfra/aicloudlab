'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCcw, Trash2, ExternalLink } from 'lucide-react'
import { DNSConfigurationDialog } from '@/components/dns-configuration-dialog'
import { getServiceDomains, addDomainToService, verifyDomain, deleteService } from '@/app/(PrivateRoutes)/api/services/api'
import { useApp } from '@/context/AppContext'
import { toast } from 'react-hot-toast'
import { DeleteModal } from '@/components/delete-modal'
import { deleteDomain } from '@/app/(PrivateRoutes)/api/services/api'
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
        toast.success('Domain added successfully')
      } catch (error) {
        console.error('Failed to add domain:', error)
        toast.error('Failed to add domain')
      }
    }
  }

  const handleDeleteDomain = async (domainId: number) => {
    try {
      const data = await deleteDomain(auth, params.id , domainId)
      console.log("data",data)
      if(data.error === "false"){
        toast.success('Domain deleted successfully')
        await fetchDomains()
      }else{
        toast.error('Failed to delete domain')
      }
    } catch (error) {
      console.error('Failed to delete domain:', error)
    }
  }

  const handleRefreshDomain = async (domainId: number) => {
    setIsRefreshing(true)
    try {
      const data = await verifyDomain(auth, domainId)
      if(data.error === "true"){
        toast.error("Domain not Connected")
      } else {
        toast.success("Domain Connected")
      }
      await fetchDomains()
    } catch (error) {
      console.error('Failed to verify domain:', error)
      toast.error('Failed to verify domain')
    } finally {
      setIsRefreshing(false)
    }
  }

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  const handleDeleteService = async () => {
    setIsDeleting(true)
    try {
      await deleteService(auth, params.id)
      closeDeleteModal()
      router.push(`/project/${projectId}?viewType=services`)
      toast.success('Service deleted successfully')
    } catch (error) {
      console.error('Failed to delete service:', error)
      toast.error('Failed to delete service')
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
    <div className="min-h-[92dvh] p-4 bg-background">
      <Card className="mx-auto max-w-2xl bg-background shadow-none border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Service Settings: {serviceName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 bg-white border border-destructive/10 p-4 sm:p-6 rounded-lg">
            <h3 className="text-base font-semibold">Domains</h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <Input
                placeholder="Add your Domain..."
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full"
              />
              <Button 
                onClick={handleAddDomain} 
                className='bg-blue-600 w-full sm:w-auto' 
                disabled={isLoading || !newDomain}
              >
                Add Domain
              </Button>
            </div>

            {isLoading ? (
              <p className="text-center py-4">Loading domains...</p>
            ) : (
              <div className="space-y-4">
                {domains && domains.map((domain) => (
                  <div
                    key={domain.domain_name}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="w-full sm:w-[70%] flex flex-col items-start gap-2 mb-2 sm:mb-0">
                      <div className='w-full sm:w-auto flex items-center gap-1 text-sm font-semibold break-all'>
                        {domain.domain_name} 
                        {domain.status === true && (
                          <button 
                            className='text-blue-700 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full' 
                            onClick={() => window.open(`http://${domain.domain_name}`, '_blank')}
                            aria-label={`Open ${domain.domain_name} in new tab`}
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </div> 
                      <div className='w-full sm:w-auto'>
                        {domain.status === false && (
                          <DNSConfigurationDialog domain={domain.domain_name} nodeIp={domain.public_ip_address} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => handleRefreshDomain(domain.id)}
                        disabled={isRefreshing}
                        aria-label="Refresh domain status"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="sr-only">Refresh</span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteDomain(domain.id)}
                        aria-label="Delete domain"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-red-300 bg-white p-4 sm:p-6 space-y-3">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a service, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm" className='w-full md:w-auto' onClick={openDeleteModal}>
              Delete Service
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteService}
        name={serviceName || ''}
        isLoading={isDeleting}
        type="service"
      />
    </div>
  )
}

