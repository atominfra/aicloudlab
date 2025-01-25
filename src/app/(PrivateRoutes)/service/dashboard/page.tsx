"use client"
import { LogViewer } from "@/components/log-viewer"
import { AlertsSection } from "@/components/alerts-section"
import { ServiceHeader } from "@/components/service-header"

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

const alerts = [
  {
    id: "1",
    title: "Memory usage crossed 80%",
    description: "2 minutes ago",
    action: {
      label: "Increase memory limit by 50%",
      onClick: () => console.log("Increasing memory"),
    },
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    title: "CPU usage crossed 80%",
    description: "10 minutes ago",
    action: {
      label: "Increase 2 replicas",
      onClick: () => console.log("Increasing replicas"),
    },
    timestamp: "10 minutes ago",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-4 ">
      <LogViewer containerName='nginx' />
      <AlertsSection alerts={alerts} />
    </div>
  )
}

