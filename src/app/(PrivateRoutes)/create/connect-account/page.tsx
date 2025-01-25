"use client"

import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConnectAccount() {
  const router = useRouter()
  const providers = [
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Connect your Azure subscription',
      available: true,
    },
    {
      id: 'e2e',
      name: 'E2E Networks',
      description: 'Connect your E2E account',
      available: true,
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Connect your AWS account',
      available: true,
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Connect your GCP project',
      available: false,
    }
  ]

  return (
    <div className="bg-neutral-100 min-h-screen flex  justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Connect Account</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="flex flex-col justify-between h-full">
              <CardHeader>
                <CardTitle className="text-xl">{provider.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-sm text-muted-foreground mb-4">
                  {provider.description}
                </p>
                {provider.available ? (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push(`/create/connect-account/${provider.id}`)}
                  >
                    Connect
                  </Button>
                ) : (
                  <Alert variant="default" className="mt-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Coming Soon</AlertTitle>
                    <AlertDescription>
                      {provider.name} integration will be available soon.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

