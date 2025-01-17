'use client'

import { useState } from 'react'
import { ArrowLeft, CloudIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudProviderForm } from './cloud-provider-form'
import { ProviderSelection } from './provider-selection'

export type CloudProvider = 'azure' | 'aws' | 'gcp'

export default function ConnectAccountPage() {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null)

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen container h-[92dvh]  max-w-4xl mx-auto py-6 '>
      
      <div className="flex items-center gap-4 mb-6">
        {selectedProvider && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedProvider(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-2xl font-bold">Connect Cloud Account</h1>
      </div>

      {!selectedProvider ? (
        <ProviderSelection onSelect={setSelectedProvider} />
      ) : (
        <div className="grid gap-6">
          <CloudProviderForm provider={selectedProvider} />
          <DocumentationSection provider={selectedProvider} />
        </div>
      )}
    </div>
  )
}

function DocumentationSection({ provider }: { provider: CloudProvider }) {
  const docs = {
    azure: {
      title: 'How to get Azure credentials',
      video: '/placeholder.svg?height=315&width=560',
      steps: [
        'Go to Azure Portal and sign in to your account',
        'Navigate to Azure Active Directory',
        'Register a new application under App Registrations',
        'Get the Tenant ID and Client ID from the app overview',
        'Generate a new Client Secret under Certificates & Secrets',
        'Get your Subscription ID from Subscriptions page'
      ]
    },
    aws: {
      title: 'How to get AWS credentials',
      video: '/placeholder.svg?height=315&width=560',
      steps: [
        'Coming soon...'
      ]
    },
    gcp: {
      title: 'How to get GCP credentials',
      video: '/placeholder.svg?height=315&width=560',
      steps: [
        'Coming soon...'
      ]
    }
  }

  const currentDocs = docs[provider]

  return (
    <Card className='border-none shadow-none'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudIcon className="h-5 w-5" />
          {currentDocs.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        {/* @ts-expect-error build */}
        <iframe width="560" height="315" src="https://www.youtube.com/embed/JuTRs31CW-k?si=OJWKC5e-GzGBnQbv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Step-by-step guide:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {currentDocs.steps.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
