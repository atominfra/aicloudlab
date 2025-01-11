'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw, Trash2 } from 'lucide-react'
import { DNSConfigurationDialog } from '@/components/dns-configuration-dialog'

interface Domain {
  name: string
  status: 'valid' | 'configuring'
}

export default function ServiceSettings({ params }: { params: { id: string } }) {
  const [domains, setDomains] = useState<Domain[]>([
    { name: 'example.in', status: 'valid' },
    { name: 'www.example.atominfra.com', status: 'configuring' }
  ])
  const [newDomain, setNewDomain] = useState('')

  const handleAddDomain = () => {
    if (newDomain) {
      setDomains([...domains, { name: newDomain, status: 'configuring' }])
      setNewDomain('')
    }
  }

  const handleDeleteDomain = (domainName: string) => {
    setDomains(domains.filter(domain => domain.name !== domainName))
  }

  const handleRefreshDomain = (domainName: string) => {
    console.log('Refreshing domain:', domainName)
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Service Name</p>
        </div>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Edit Service
        </Button>
      </div>

      <Card className="mb-8 border-none shadow-none">
        <CardHeader>
          <CardTitle className='text-lg font-medium'>Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add your Domain..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleAddDomain} className='bg-blue-600'>Add Domain</Button>
          </div>

          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="w-[90%] flex items-center gap-3">
                  <div className='w-[50%]'>{domain.name}</div>
                  <div className='w-[50%]'>
                    {domain.status === "configuring" && (
                      <DNSConfigurationDialog domain={domain.name} nodeIp={domain.nodeIp || "nodeIp"}/>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRefreshDomain(domain.name)}
                  >
                    <RefreshCcw className="h-4 w-4" /> <span>Refresh</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDomain(domain.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-red-300 bg-white p-6 space-y-3">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" size="sm">
          Delete Project
        </Button>
      </div>
    </div>
  )
}

