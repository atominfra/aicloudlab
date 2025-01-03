import { ExternalLink, Server, Cpu, MemoryStickIcon as Memory, Copy, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ServiceCardProps {
  id: string
  name: string
  status: "running" | "stopped" | "error"
  memory: string
  cpu: string
  replicas: number
  onOperation: (serviceId: string, operationName: string) => Promise<void>
}

export function ServiceCard({ 
  id, 
  name, 
  status, 
  memory, 
  cpu, 
  replicas, 
  onOperation 
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full hover:shadow-sm transition-shadow duration-200">
      <div className="flex flex-col space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4">
            {/* Service Name with Icon */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Service Metrics */}
            <div className="flex flex-wrap items-center gap-4">
              <TooltipProvider>
                {/* Memory Info */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-600 hover:text-gray-900">
                      <Memory className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">
                        <span className="font-medium">Memory:</span> {memory}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Memory Limit</p>
                  </TooltipContent>
                </Tooltip>

                {/* CPU Info */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-600 hover:text-gray-900">
                      <Cpu className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">
                        <span className="font-medium">CPU:</span> {cpu}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>CPU Limit</p>
                  </TooltipContent>
                </Tooltip>

                {/* Replicas Info */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-600 hover:text-gray-900">
                      <Copy className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">
                        <span className="font-medium">Replicas:</span> {replicas}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of Replicas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 w-full"
              onClick={() => window.open(`/service/${id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Visit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 w-full">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="ml-1.5">Manage</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => onOperation(id, 'start')}>
                  Start Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOperation(id, 'stop')}>
                  Stop Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOperation(id, 'restart')}>
                  Restart Service
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onOperation(id, 'delete')}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

