'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Eye, Plus, Unplug, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import azureIcon from "@/assets/azure.svg"
import gcpIcon from "@/assets/gcp.svg"
import awsIcon from "@/assets/aws.svg"
import { useRouter } from 'next/navigation'

interface CloudAccount {
  id: string
  provider: 'gcp' | 'aws' | 'azure'
  name: string
  platform: string
  logo: string
}

const accounts: CloudAccount[] = [
  {
    id: '1',
    provider: 'gcp',
    name: 'John Doe',
    platform: 'Google Cloud Platform',
    logo: gcpIcon
  },
  {
    id: '2',
    provider: 'aws',
    name: 'Company Admin',
    platform: 'Amazon Web Services',
    logo: awsIcon
  },
  {
    id: '3',
    provider: 'azure',
    name: 'Azure Manager',
    platform: 'Microsoft Azure',
    logo: azureIcon
  }
]

const providerOptions = [
  { value: 'all', label: 'All Providers' },
  { value: 'gcp', label: 'Google Cloud Platform' },
  { value: 'aws', label: 'Amazon Web Services' },
  { value: 'azure', label: 'Microsoft Azure' },
]

export default function CloudAccounts() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const router = useRouter()
  const filteredAccounts = accounts.filter(account => 
    selectedProvider === 'all' ? true : account.provider === selectedProvider
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Cloud Accounts</h1>
         
        </div>
      <div className='flex items-center gap-4'>
      <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"  className="flex items-center gap-2 py-4">
                <Filter className="h-4 w-4" />
                {providerOptions.find(option => option.value === selectedProvider)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px]">
              {providerOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedProvider === option.value}
                  onCheckedChange={() => setSelectedProvider(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-600/90" onClick={()=> router.push('/clusters/connect-account')}>
          <Plus className="" />
          Add Account
        </Button>
      </div>
      </div>

      <div className="space-y-1">
        {filteredAccounts.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Image
                    src={account.logo}
                    alt={account.provider}
                    width={40}
                    height={40}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.platform}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" className="text-gray-600" onClick={()=> router.push(`/dashboard/accounts/${account.id}/nodes`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Nodes
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-50">
                  <Unplug className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

