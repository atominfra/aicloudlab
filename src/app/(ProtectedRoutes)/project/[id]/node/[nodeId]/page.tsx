'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from '@/components/withAuth'
import Image from "next/image"
import { Typography } from "@mui/material"
import { FolderOpen, Server } from "lucide-react"
import Loader from "@/components/loader"
import { useApp } from "@/context/AppContext"
import { getAllNodeServices } from "@/app/(ProtectedRoutes)/api/services/api"
import { fetchNode } from "@/app/(ProtectedRoutes)/api/nodes/api"
import { ServiceCard } from "@/components/service-card"

interface Node {
  cloud_account_id:number
  disk:string
  id:number
  location:string
  memory:string
  name:string
  private_ip_address:string
  public_ip_address:string
  vcpus:string
}
interface Service {
  id: string
  projectName: string
  servicesRunning:number
}



const NodePage = ({ params }: { params: { nodeId: string } }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [nodeData, setNodeData] = useState<Node[]>([])
  const searchParams = useSearchParams()

  const projectId = searchParams.get('projectId')
  const {auth} = useApp()

  const fetchNodeData = async () => {
    if(!auth) return
    setLoading(true)
    try {
      const data = await fetchNode(auth,params.nodeId)
      setNodeData(data.data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNodeData()
  }, [auth])

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const data = await getAllNodeServices(auth,params.nodeId)
        setServices(data.data.services)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return <Loader/>
  }

return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        {/* @ts-expect-error build error */}
        {nodeData?.name && <h1 className="text-2xl font-semibold"> Node: {nodeData?.name}</h1>}
        <Button onClick={()=> router.push(`/create/service?projectId=${projectId}`)} className="bg-blue-600">Create Service</Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#111827]">
          Services Running
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {services && services.length>0 ? services.map((service) => (
          // @ts-expect-error build error
          <ServiceCard key={service.id} {...service} projectId={projectId}/>
        )) : <>
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh]  w-full">
              <Server className="w-[100px] h-[100px] text-neutral-200" />
              <Typography variant="body1" className="text-gray-400 mb-4 px-6">
                No Services yet.
              </Typography>
            </div>
        </>}
      </div>
    </div>
  )
}

export default withAuth(NodePage)

