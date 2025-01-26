"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CircleCheck, ExternalLink, RefreshCw, Trash2 } from "lucide-react"
import Link from "next/link"
import { DNSConfigurationDialog } from "@/components/dns-configuration-dialog"

interface Domain {
  id: string
  name: string
  status: "Valid Configuration" | "Awaiting external DNS"
  nodeIp: string
}

const initialDomains: Domain[] = [
  {
    id: "1",
    name: "hiring-dev.atominfra.com",
    status: "Valid Configuration",
    nodeIp: "123.45.67.89",
  },
  {
    id: "2",
    name: "hiring.dev.atominfra.com",
    status: "Awaiting external DNS",
    nodeIp:"123.45.67.89"
  },
]

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [newDomain, setNewDomain] = useState("")

  const addDomain = () => {
    if (newDomain) {
      setDomains([
        ...domains,
        {
          id: Date.now().toString(),
          name: newDomain,
          status: "Awaiting external DNS",
          nodeIp: "123.45.67.89", // This would come from your API in a real application
        },
      ])
      setNewDomain("")
    }
  }

  const deleteDomain = (id: string) => {
    setDomains(domains.filter((domain) => domain.id !== id))
  }

  const refreshDomain = (id: string) => {
    setDomains(domains.map((domain) => (domain.id === id ? { ...domain, status: "Valid Configuration" } : domain)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domains</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Add your Domain.."
            className="w-full"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <Button className="bg-blue-600 w-[120px] " onClick={addDomain}>
          <span className="">+</span>
          Add Domain
        </Button>
        </div>

        <div className="grid gap-4">
          {domains.map((domain) => (
            <div key={domain.id} className="flex items-center gap-4 justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <div className="flex items-center md:items-start gap-2">
                  <span className="font-medium truncate">{domain.name}</span>
                  {domain.status === "Valid Configuration" && (
                    <Link href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer" className="text-blue-700">
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                </div>
                {domain.status === "Awaiting external DNS" ? (
                  <DNSConfigurationDialog domain={domain.name} nodeIp={domain.nodeIp} />
                ) : (
                  <p className="text-sm text-green-500 flex gap-1 items-center">
                    <CircleCheck className='text-green-500 ' size={14} />
                    {domain.status}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => refreshDomain(domain.id)}>
                  <RefreshCw className="size-4 text-[#374151]" />
                  <span className="text-[#374151] hidden lg:block">Refresh</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteDomain(domain.id)}>
                <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

