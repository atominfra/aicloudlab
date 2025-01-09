'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { fetchCloudAccounts } from '@/app/api/nodes/api'

export default function CreateClusterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    vmSize: '',
    nodeCount: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNameTouched, setIsNameTouched] = useState(false)
  const [cloudAccounts, setCloudAccounts] = useState([]);

    const { auth, node_page_status } = useApp()
  

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

  

  const fetchCloudAccount = async (auth) => {
    try {
      const plansData = await fetchCloudAccounts(auth)
      console.log('plansData',plansData)
      setCloudAccounts(plansData)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } 
  }

    useEffect(()=>{
      fetchCloudAccount(auth)
    },[auth])

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

    // Add your cluster creation logic here

    try {
      // Simulating cluster creation
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/clusters')
    } catch (err) {
      setError('An error occurred while creating the cluster')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center items-center h-[92dvh]'>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Create New Cluster</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="cluster-name" className="text-sm font-medium text-[#374151]">
              Cluster Name*
            </label>
            <div className="relative">
              <Input
                id="cluster-name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter cluster name"
                className={`max-w-full ${isNameTouched && formData.name === '' ? 'border-red-500' : ''}`}
              />
            </div>
            {/* {isNameTouched && formData.name === '' && (
              <p className="text-red-500 text-sm">Name cannot be empty.</p>
            )}
            {isNameTouched && (formData.name.includes('_') || formData.name.includes(' ')) && (
              <p className="text-red-500 text-sm">Name cannot contain an underscore (_) or spaces.</p>
            )} */}
          </div>

          <div className="space-y-2">
            <label htmlFor="cloud-account" className="text-sm font-medium text-[#374151]">
              Cloud Account*
            </label>
            <div className="flex space-x-2">
              <Select 
                  value={formData.account}
                onValueChange={(value) => handleChange('account', value)}
              >
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="Select cloud account" />
                </SelectTrigger>
                <SelectContent>
                  {cloudAccounts && cloudAccounts.map(account => (
                    <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="flex-shrink-0"
              >
                <Link href="/clusters/connect-account">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Connect Account</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* <div className="space-y-2">
            <label htmlFor="vm-size" className="text-sm font-medium text-[#374151]">
              VM Size
            </label>
            <Select 
              value={formData.vmSize} 
              onValueChange={(value) => handleChange('vmSize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select VM size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard_d2s_v3">Standard_D2s_v3 (2 vCPU, 8 GB RAM)</SelectItem>
                <SelectItem value="standard_d4s_v3">Standard_D4s_v3 (4 vCPU, 16 GB RAM)</SelectItem>
                <SelectItem value="standard_d8s_v3">Standard_D8s_v3 (8 vCPU, 32 GB RAM)</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* <div className="space-y-2">
            <label htmlFor="node-count" className="text-sm font-medium text-[#374151]">
              Number of Nodes
            </label>
            <Select 
              value={formData.nodeCount} 
              onValueChange={(value) => handleChange('nodeCount', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of nodes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Node</SelectItem>
                <SelectItem value="2">2 Nodes</SelectItem>
                <SelectItem value="3">3 Nodes</SelectItem>
                <SelectItem value="4">4 Nodes</SelectItem>
                <SelectItem value="5">5 Nodes</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {error && isNameTouched && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" className='text-[14px]' onClick={() => router.push('/create/service')}>Cancel</Button>
            <Button type="submit" disabled={true} className='bg-[#2563EB] text-[14px]'>
              {isLoading ? 'Creating...' : 'Create Cluster (Coming Soon)'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

