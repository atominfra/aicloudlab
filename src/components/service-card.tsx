"use client"

import { Server, Cpu, MemoryStickIcon as Memory, Copy, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { redeployService } from "@/app/(PrivateRoutes)/api/services/api"
import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { useSidebar } from "./ui/sidebar"
import RedeployModal from "./modals/redeploy-modal"
interface ServiceCardProps {
  id: string
  name: string
  status: "running" | "stopped" | "error"
  mem_limit: string
  cpu_limit: string
  replicas: number
  service_url: string
  projectId: string
}

export function ServiceCard({
  id,
  name,
  status = "running",
  mem_limit,
  cpu_limit,
  replicas,
  service_url,
  projectId,
}: ServiceCardProps) {
  const { toggleSidebar, state, isMobile } = useSidebar()
  const router = useRouter()
  const { auth } = useApp()
  const [isRedeployModalOpen, setIsRedeployModalOpen] = useState(false)
  const [isRedeploying, setIsRedeploying] = useState(false)
  const [error, setError] = useState("")
  const handleClick = () => {
    if (process.env.NEXT_PUBLIC_SERVICE_MANAGEMENT_STATUS === "true") {
      if (state === "expanded" && !isMobile) {
        toggleSidebar()
      }
      router.push(`/service/dashboard?service-id=${id}&service-name=${name}&project-id=${projectId}`)
    }
  }

  const handleRedeploy = async (tag: string) => {
    setIsRedeploying(true)
    setError("")
    try {
      const response = await redeployService(auth, id, tag)
      if(response.error==="true"){
        console.error("Failed to redeploy service:", error)
        setError(response.message)
        setIsRedeploying(false)
      }else{
        console.log("Service redeployed successfully")
        setIsRedeploying(false)
        setIsRedeployModalOpen(false)
      }
    } catch (error) {
      console.error("Failed to redeploy service:", error)
      setError("Something went wrong")
    } 
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full hover:shadow-sm transition-shadow duration-200">
      <div className="flex space-y-4 sm:space-y-0 w-full">
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between w-full ${process.env.NEXT_PUBLIC_SERVICE_MANAGEMENT_STATUS === "true" && "hover:cursor-pointer"}`}
          onClick={handleClick}
        >
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 ">
            <div className="flex items-center ">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{name}</h3>
                  <span className="block md:hidden">
                    <StatusBadge status={status} />
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-2 md:pt-0">
                  <span className="hidden md:block w-[75px]">
                    <StatusBadge status={status} />
                  </span>
                  <div className="lg:flex flex-col md:flex-row items-center gap-4 w-[45vw]">
                    <TooltipProvider>
                      <div className="flex items-center lg:w-[150px] ">
                        <Tooltip>
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
                      <div className="flex items-center lg:w-[100px] ">
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
                      <div className="flex items-center lg:w-[150px] ">
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
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="ghost" size="icon" onClick={() => setIsRedeployModalOpen(true)} className="ml-2">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div
            className="text-gray-600 p-2 hover:text-gray-900 hover:cursor-pointer w-full border-l border-none"
            onClick={() => router.push(`/service/${id}/settings?projectId=${projectId}&serviceName=${name}`)}
          >
            <Settings className="h-4 w-4" />
          </div>
        </div>
      </div>
      <RedeployModal
        open={isRedeployModalOpen}
        serviceName={name}
        onCancel={() => {
          setIsRedeployModalOpen(false)
          setError("")
        }}
        onConfirm={handleRedeploy}
        isRedeploying={isRedeploying}
        error={error}
      />
    </div>
  )
}

