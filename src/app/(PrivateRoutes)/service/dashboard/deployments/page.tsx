"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitBranch, Eye, Loader2, Filter } from "lucide-react"
import { LogViewer } from "@/components/log-viewer"

interface Deployment {
  id: string
  commitHash: string
  message: string
  branch: string
  timestamp: string
  isCurrent?: boolean
}

const sampleLogs = [
  "8:51:27 PM: Build ready to start",
  "8:51:55 PM: build-image version: 17725b3539da87c8dbb63d1687d4cd85cb2769cd (focal)",
  "8:51:55 PM: buildbot version: 1f603b5da77b398dad9b2852f8fd1e3683d8d9b",
  "8:51:55 PM: Fetching cached dependencies",
  "8:51:55 PM: Starting to download cache of 11.0MB",
  "8:51:55 PM: Finished downloading cache in 141ms",
  "8:51:55 PM: Starting to extract cache",
  "8:51:55 PM: Finished extracting cache in 38ms",
  "8:51:55 PM: Finished fetching cache in 223ms",
  "8:51:55 PM: Starting to prepare the repo for build",
  "8:51:56 PM: Preparing Git Reference refs/heads/main",
  "8:51:57 PM: Starting to install dependencies",
  "8:51:57 PM: Attempting Python version '3.8', read from environment",
  "8:51:58 PM: downloading cpython-3.8.20+20241002-x86_64-unknown-linux-gnu-install_only_stripped.tar.gz",
  "8:51:58 PM: installing cpython-3.8.20+20241002-x86_64-unknown-linux-gnu-install_only_stripped.tar.gz",
  "8:51:58 PM: python --version",
]

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: "1a22fs2",
      commitHash: "1a22fs2",
      message: "Update API endpoints",
      branch: "main",
      timestamp: "12 oct, 2024 at 15:52",
      isCurrent: true,
    },
    {
      id: "2s20df7",
      commitHash: "2s20df7",
      message: "Add new feature",
      branch: "main",
      timestamp: "12 oct, 2024 at 12:50",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDeployment, setExpandedDeployment] = useState<string | null>(null)
  const [deployingId, setDeployingId] = useState<string | null>(null)

  const handleDeploy = async (id: string) => {
    setDeployingId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeployments(
      deployments.map((deployment) => ({
        ...deployment,
        isCurrent: deployment.id === id,
      })),
    )
    setDeployingId(null)
  }

  const toggleLogs = (id: string) => {
    setExpandedDeployment(expandedDeployment === id ? null : id)
  }

  const filteredDeployments = deployments.filter(
    (deployment) =>
      deployment.commitHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.message.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle>Deployments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0 sm:p-6">
        <div className="flex items-center gap-4 p-4 sm:p-0">
          <div className="relative flex-1">
            <Input
              placeholder="Search deploys using tags or commit hash"
              className="w-full pr-10 sm:max-w-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all-time" >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="last-hour">Last Hour</SelectItem>
              <SelectItem value="last-day">Last 24 Hours</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 px-4 sm:px-0">
          {filteredDeployments.map((deployment) => (
            <Card key={deployment.id} className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 sm:space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{deployment.commitHash}</span>
                      <span className="text-sm text-muted-foreground hidden sm:inline">•</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{deployment.message}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <GitBranch className="size-4" />
                      <span>{deployment.branch}</span>
                    </div>
                    {deployment.isCurrent && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground sm:hidden">{deployment.timestamp}</div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="hidden sm:block text-sm text-muted-foreground">{deployment.timestamp}</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleDeploy(deployment.id)}
                      disabled={deployingId === deployment.id}
                      className="w-full sm:w-auto bg-blue-600"
                    >
                      {deployingId === deployment.id ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        "Redeploy"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => toggleLogs(deployment.id)} className="w-full sm:w-auto">
                      <Eye className="mr-2 size-4" />
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
              {expandedDeployment === deployment.id && (
                // <div className="space-y-4">
                  <LogViewer containerName={'nginx'} />
                // </div>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

