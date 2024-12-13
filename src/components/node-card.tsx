import { Settings, Pause, Trash2, Cpu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'

interface NodeCardProps {
  name: string
  status: "running" | "stopped" | "error"
  ip: string
  specs: {
    cpu: string
    memory: string
    storage: string
    gpu: string
  }
}

export function NodeCard({ name, status, ip, specs }: NodeCardProps) {
  return (
    <div className="bg-white border-b rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Cpu className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <StatusBadge status={status} />
              <span>IP: {ip}</span>
              <span className="text-gray-300">|</span>
              <span>{specs.cpu}</span>
              <span>•</span>
              <span>{specs.memory}</span>
              <span>•</span>
              <span>{specs.storage}</span>
              <span>•</span>
              <span>{specs.gpu}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Pause className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="outline">Manage</Button>
        </div>
      </div>
    </div>
  )
}

