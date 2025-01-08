'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
type CloudProvider = 'aws' | 'gcp' | 'azure'

interface CloudProviderFormProps {
  provider: CloudProvider
}

export function CloudProviderForm({ provider }: CloudProviderFormProps) {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [azureCredentials, setAzureCredentials] = useState({
    name:'',
    tenant_id: '',
    client_id: '',
    client_secret: '',
    subscription_id: '',
  })

  if (provider === 'aws' || provider === 'gcp') {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>
            {provider === 'aws' ? 'Amazon Web Services' : 'Google Cloud Platform'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              This provider integration will be available soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const handleAzureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAzureCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAzureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cluster/connect-account`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
          },
          body: JSON.stringify(azureCredentials),
        },
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.message || 'Failed to connect Azure account')
      }

      const data = await response.json()
      console.log('Azure account connected:', data)
    } catch (error) {
      console.error(error)
      console.log(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      router.push('/dashboard/services')
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Microsoft Azure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pb-4">
          <h2 className="text-lg font-medium text-gray-900">Connect Azure Account</h2>
          <form onSubmit={handleAzureSubmit} className="space-y-4">
            {Object.keys(azureCredentials).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field
                    .replace('_', ' ')
                    .toLowerCase()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Label>                
                <Input
                  id={field}
                  name={field}
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                  type={field === 'client_secret' ? 'password' : 'text'}
                  value={azureCredentials[field as keyof typeof azureCredentials]}
                  onChange={handleAzureChange}
                  required
                />
              </div>
            ))}
            <div className='w-full text-end'>
            <Button type="submit" className=" bg-[#2563EB] " disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
