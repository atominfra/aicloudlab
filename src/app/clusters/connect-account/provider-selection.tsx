import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CloudProvider } from './page'

interface ProviderSelectionProps {
  onSelect: (provider: CloudProvider) => void
}

export function ProviderSelection({ onSelect }: ProviderSelectionProps) {
  const providers = [
    {
      id: 'azure' as const,
      name: 'Microsoft Azure',
      description: 'Connect your Azure subscription',
      available: true,
    },
    {
      id: 'aws' as const,
      name: 'Amazon Web Services',
      description: 'Connect your AWS account',
      available: false,
    },
    {
      id: 'gcp' as const,
      name: 'Google Cloud Platform',
      description: 'Connect your GCP project',
      available: false,
    },
    {
      id: 'e2e' as const,
      name: 'E2E',
      description: 'Connect your E2E account',
      available: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {providers.map((provider) => (
        <Card key={provider.id} className="relative border-none shadow-none" >
          <CardHeader>
            <CardTitle>{provider.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {provider.description}
            </p>
            {provider.available ? (
              <Button
                className="w-full bg-[#2563EB] "
                onClick={() => onSelect(provider.id)}
              >
                Connect
              </Button>
            ) : (
              <Alert>
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
  )
}

