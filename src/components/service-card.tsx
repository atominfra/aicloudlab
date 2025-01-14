"use client"
import { ExternalLink, Server, Cpu, MemoryStickIcon as Memory, Copy, MoreHorizontal, Settings } from 'lucide-react'
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
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  id: string
  name: string
  status: "running" | "stopped" | "error"
  mem_limit: string
  cpu_limit: string
  replicas: number
  service_url: string
  projectId:string
  onOperation: (serviceId: string, operationName: string) => Promise<void>
  
}

export function ServiceCard({ 
  id, 
  name, 
  status="running", 
  mem_limit, 
  cpu_limit, 
  replicas, 
  service_url,
  projectId,
  onOperation 
}: ServiceCardProps) {
    const router = useRouter();
  const handleEdit = () => {
    router.push(`/create/service?id=${id}`);
  };

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
              <div className='w-full'>
               <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{name}</h3>
                <span className=' block md:hidden'><StatusBadge status={status} /></span>
               </div>
               <div className='flex items-center gap-3 pt-2 md:pt-0'>
                <span className='hidden md:block  w-[75px]'><StatusBadge status={status} /></span>
                {/* Service Metrics */}
                <div className="lg:flex flex-col md:flex-row items-center gap-4 w-[45vw]">
                  <TooltipProvider>
                    {/* Memory Info */}
                    <div className="flex  items-center lg:w-[150px] ">
                    <Tooltip >
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-gray-600 hover:text-gray-900">
                          <Memory className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            <span className="font-medium">Memory:</span> {mem_limit}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Memory Limit</p>
                      </TooltipContent>
                    </Tooltip>
                    </div>

                    {/* CPU Info */}
                    <div className="flex  items-center lg:w-[100px] ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-gray-600 hover:text-gray-900">
                          <Cpu className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            <span className="font-medium">CPU:</span> {cpu_limit}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>CPU Limit</p>
                      </TooltipContent>
                    </Tooltip>
                      </div>
                    {/* Replicas Info */}
                    <div className="flex  items-center lg:w-[150px] ">
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
                  </div>
                  </TooltipProvider>
                </div>
               </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div 
              className="text-gray-600 p-2 hover:text-gray-900 hover:cursor-pointer w-full border-l border-none"
              onClick={()=> router.push(`/service/${id}/settings?projectId=${projectId}&serviceName=${name}`)}
            >
              <Settings className="h-4 w-4 " />
              
              </div>
            {/* <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 w-full"
              onClick={()=>    window.open (service_url, '_ blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Visit
            </Button> */}

          </div>
        </div>
      </div>
    </div>
  )
}

