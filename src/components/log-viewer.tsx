"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

interface LogViewerProps {
  logs: string[]
}

export function LogViewer({ logs }: LogViewerProps) {
  const handleExportLogs = () => {
    const logText = logs.join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "logs.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4 rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <Input placeholder="Search logs..." className="max-w-sm" />
          <Select defaultValue="all-time">
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
        <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={handleExportLogs}>
          <Download className="mr-2 size-4" />
          Export Logs
        </Button>
      </div>
      <div className="relative rounded-md bg-zinc-950 font-mono text-sm text-zinc-50">
        <div className="absolute left-0 top-0 flex h-full w-[3rem] flex-col items-end border-r border-zinc-800 bg-zinc-900 px-2 text-zinc-500">
          {logs.map((_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="max-h-[400px] overflow-auto pl-[3rem]">
          <code>
            {logs.map((log, i) => (
              <div key={i} className="h-6 whitespace-pre-wrap px-4 leading-6">
                {log}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

