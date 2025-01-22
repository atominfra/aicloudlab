import { Button } from "@/components/ui/button"
import { Clipboard, Trash2 } from "lucide-react"
import Link from "next/link"

interface ServiceHeaderProps {
  name: string
  status: "Running" | "Stopped" | "Error"
  memory: string
  cpu: number
  replicas: number
  hostname: string
  url: string
}

export function ServiceHeader({ name, status, memory, cpu, replicas, hostname, url,  }: ServiceHeaderProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-500">Running</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{hostname}</div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">{url}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Clipboard className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div>Memory: {memory}</div>
            <div>CPU: {cpu}</div>
            <div>Replicas: {replicas}</div>
          </div>
          <Button variant="destructive" size="icon">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

