'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCloudAccount } from '@/app/(ProtectedRoutes)/api/cloud/api'
import { useApp } from '@/context/AppContext'
import { ToggleableInput } from '@/components/ToggleableInput'

export default function AzurePage() {
  const { auth } = useApp()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [azureCredentials, setAzureCredentials] = useState({
    name: '',
    tenant_id: '',
    client_id: '',
    client_secret: '',
    subscription_id: '',
  })
  const [error, setError] = useState('');

  const placeholderMap: Record<string, string> = {
    name: 'Enter name',
    tenant_id: 'Enter Tenant ID ',
    client_id: 'Enter Client ID ',
    client_secret: 'Enter Client Secret',
    subscription_id: 'Enter Subscription ID',
  }

  const handleAzureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAzureCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const apiData = {
        name: azureCredentials.name,
        provider: 'azure',
        credentials: {
          tenant_id: azureCredentials.tenant_id,
          client_id: azureCredentials.client_id,
          client_secret: azureCredentials.client_secret,
          subscription_id: azureCredentials.subscription_id,
        },
      }

      const res = await createCloudAccount(auth, apiData)

      console.log('Azure account connected:', res)
      router.push('/dashboard/accounts')
    } catch (error) {
      console.error(error)
      setError('An error occurred while creating the cluster')

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center h-[92dvh]'>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Microsoft Azure</h1>
        </div>

        <Card className="border-none shadow-none">
          <CardContent>
            <div className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(azureCredentials).map(([field, value]) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field
                        .replace('_', ' ')
                        .toLowerCase()
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Label>
                    {field === 'name' ? (
                      <Input
                        id={field}
                        name={field}
                        placeholder={placeholderMap[field]}
                        value={value}
                        onChange={handleAzureChange}
                        required
                      />
                    ) : (
                      <ToggleableInput
                        id={field}
                        name={field}
                        label={field.replace('_', ' ')}
                        placeholder={placeholderMap[field]}
                        value={value}
                        onChange={handleAzureChange}
                        required
                      />
                    )}
                  </div>
                ))}
                 {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}  
                <div className='w-full text-end'>
                  <Button type="submit" className="bg-[#2563EB]" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect Account'}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
