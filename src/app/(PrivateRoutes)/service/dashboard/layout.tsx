"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ServiceSidebar } from "@/components/service-sidebar"
import { ServiceHeader } from "@/components/service-header"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useApp } from "@/context/AppContext"
import { fetchServiceDetails, getAllProjectServices } from "../../api/services/api"
import { fetchNode } from "../../api/nodes/api"
import Loader from "@/components/loader"

interface Service {
  id: number
  name: string
  status: string
  mem_limit: string
  node_id: string
  replicas: string
  cpu_limit: string
}

interface Node {
  id: string
  name: string
  // Add other node properties as needed
}

interface ServiceResponse {
  data: {
    services: Service[]
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)
  const [node, setNode] = useState<Node | null>(null)
  const searchParams = useSearchParams()
  const id = searchParams.get("service-id")
  const name = searchParams.get("service-name")
  const projectId = searchParams.get("project-id")
  const { auth } = useApp()

  const fetchNodeDetails = async (nodeId: string) => {
    setLoading(true)
    try {
      const data = await fetchNode(auth, nodeId)
      setNode(data || null)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth && service?.node_id) {
      fetchNodeDetails(service.node_id)
    }
  }, [auth, service]) 

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const data = (await getAllProjectServices(auth, projectId)) as ServiceResponse

        if (!data?.data?.services) {
          console.error("Services array is undefined.")
          return
        }

        const filteredService = data.data.services.find((service) => service.id === Number(id))

        setService(filteredService || null)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    if (auth && id) {
      fetchServices()
    }
  }, [auth, id])


  if (loading) {
    return <Loader />
  }

  return (
    <SidebarProvider className="bg-neutral-100">
      <div className="flex h-screen w-full overflow-hidden bg-neutral-100">
        <ServiceSidebar id={id} name={name}/>
        <SidebarInset className="flex-1 overflow-auto bg-neutral-100 pb-16 md:pb-0">
          <div className="flex flex-col min-h-screen space-y-4 p-4 bg-neutral-100 ">
            <ServiceHeader
              name={service?.name || name || "Unknown"}
              status={service?.status || "Unknown"}
              memory={service?.mem_limit || "0 MB"}
              cpu={service?.cpu_limit || "0"}
              replicas={Number(service?.replicas) || 0}
              nodeName={node?.name || ""}
              url="hiring-dev.atominfra.com"
            />
            <main className="flex-1 space-y-4 bg-neutral-100 pb-20">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

