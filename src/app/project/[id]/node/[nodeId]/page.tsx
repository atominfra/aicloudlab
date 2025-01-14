'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from '@/components/withAuth'
import Image from "next/image"
import { Typography } from "@mui/material"
import { FolderOpen } from "lucide-react"
import Loader from "@/components/loader"
import { useApp } from "@/context/AppContext"
import { getAllNodeServices } from "@/app/api/services/api"
import { fethcNode } from "@/app/api/nodes/api"
import { ServiceCard } from "@/components/service-card"

interface Node {
  id: string
  projectName: string
  servicesRunning:number
}



const NodePage = ({ params }: { params: { nodeId: string } }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Node[]>([])
  const [nodeData, setNodeData] = useState<Node[]>([])
  const searchParams = useSearchParams()

  const nodeName = searchParams.get('nodeName')
  const {auth} = useApp()
  // useEffect(() => {
  //   const fetchNodeData = async () => {
  //     setLoading(true)
  //     try {
  //       const data = await fethcNode(auth,params.nodeId)
  //       setServices(data.data)
  //     } catch (error) {
  //       console.error("Error fetching services:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchNodeData()
  // }, [])
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
        <h1 className="text-2xl font-semibold">{nodeName}</h1>
        <Button onClick={()=> router.push(`/create/service`)} className="bg-blue-600">Create Service</Button>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {services && services.length>0 ? services.map((service) => (
          // @ts-expect-error build error
          <ServiceCard key={service.id} {...service}/>
        )) : <>
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh]  w-full">
              <FolderOpen className="w-[100px] h-[100px] text-neutral-200" />
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

