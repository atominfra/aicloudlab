'use client'

import { useState } from 'react'
import { AlertCircle, CloudIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { createCloudAccount } from '@/app/api/cloud/api'
import { useApp } from '@/context/AppContext'
type CloudProvider = 'aws' | 'gcp' | 'azure'

interface CloudProviderFormProps {
  provider: CloudProvider
}

// const docs = {
//     title: 'How to get Azure credentials',
//     video: '/placeholder.svg?height=315&width=560',
//     steps: [
//       'Go to Azure Portal and sign in to your account',
//       'Navigate to Azure Active Directory',
//       'Register a new application under App Registrations',
//       'Get the Tenant ID and Client ID from the app overview',
//       'Generate a new Client Secret under Certificates & Secrets',
//       'Get your Subscription ID from Subscriptions page'
//     ]
// }

export default function CloudProviderForm({ provider }: CloudProviderFormProps) {
  const { auth } = useApp()

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
  
  const handelSubmit = async (e: React.FormEvent) => {
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
      console.log(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center items-center h-[92dvh]  '>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full ">
      <div className="text-center mb-8 relative">
        <h1 className="lg:text-2xl text-lg font-semibold mb-2">Microsoft Azure</h1>
      </div>

      <Card className="border-none shadow-none">
      <CardContent>
        <div className="pt-4">
          <h2 className="text-lg font-medium text-gray-900">Connect Azure Account</h2>
          <form onSubmit={handelSubmit} className="space-y-4">
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

    {/* <Card className='border-none shadow-none'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudIcon className="h-5 w-5" />
          {docs.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/JuTRs31CW-k?si=OJWKC5e-GzGBnQbv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Step-by-step guide:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {docs.steps.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card> */}
    </div>
    </div>
    
  )
}
