"use client"
import { Button } from "@/components/ui/button"
import { Clipboard, RefreshCw, Trash2 } from "lucide-react"
import Link from "next/link"
import copyIcon from "@/assets/copy.webp"
import Image from "next/image"
import { StatusBadge } from "./status-badge"
import RedeployModal from "./modals/redeploy-modal"
import { useState } from "react"
import { redeployService } from "@/app/(PrivateRoutes)/api/services/api"
import { useApp } from "@/context/AppContext"

interface ServiceHeaderProps {
  id: number | null
  name: string
  status: string
  memory: string
  cpu: string
  replicas: number
  nodeName: string
  url: string
  image_url: string
}

export function ServiceHeader({ id, name, image_url, status, memory, cpu, replicas, nodeName, url }: ServiceHeaderProps) {
    const [isRedeployModalOpen, setIsRedeployModalOpen] = useState(false)
    const [isRedeploying, setIsRedeploying] = useState(false)
    const [error, setError] = useState("")
    const { auth } = useApp()

      const handleRedeploy = async (tag: string) => {
        setIsRedeploying(true)
        setError("")
        try {
          const response = await redeployService(auth, String(id), tag)
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
          setIsRedeploying(false)
          setError("Something went wrong")
        } 
      }
    


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
          <div className="flex gap-2">
            <Button variant="ghost"  onClick={() => setIsRedeployModalOpen(true)} className="h-9 bg-blue-600 text-white">
              <RefreshCw className="h-4 w-4" /><span>Redeploy</span>
            </Button>
            <Button variant="destructive" size="icon" className="h-9 w-9">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <RedeployModal
        open={isRedeployModalOpen}
        serviceName={name}
        image_url={image_url}
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

