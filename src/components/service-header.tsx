import { Button } from "@/components/ui/button"
import { Clipboard, Trash2 } from "lucide-react"
import Link from "next/link"
import copyIcon from "@/assets/copy.webp"
import Image from "next/image"
import { StatusBadge } from "./status-badge"
interface ServiceHeaderProps {
  name: string
  status: string
  memory: string
  cpu: string
  replicas: number
  nodeName: string
  url: string
}

export function ServiceHeader({ name, status, memory, cpu, replicas, nodeName, url }: ServiceHeaderProps) {
  
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
            
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Memory: {memory}</div>
            <div className="text-sm text-muted-foreground">CPU: {cpu}</div>
            <div className="text-sm text-muted-foreground">Replicas: {replicas}</div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            {/* <div className="text-sm text-muted-foreground">{nodeName}</div> */}
            {/* <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-500">{status}</span>
            </div> */}
            <StatusBadge status={status.toLowerCase()} />
            {/* <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">{url}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mx-1.5">
              <Image
              alt='copyIcon'
              src={copyIcon || "/placeholder.svg"}
              width={16}
              height={16}
            />
              </Button>
            </div> */}
          </div>
          <Button variant="destructive" size="icon" className="h-9 w-9">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

