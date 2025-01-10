'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from '@/components/withAuth'
import { ServiceCard } from "@/components/service-card"

interface Node {
  id: number
  name: string
}

const serviceDatas = [
  {
    id: "1",
    name: "Authentication Service",
    status: "running",
    mem_limit: "512MB",
    cpu_limit: "1.5 ",
    replicas: 3,
    service_url: "https://auth.example.com",
  },
  {
    id: "2",
    name: "Payment Gateway",
    status: "stopped",
    mem_limit: "1GB",
    cpu_limit: "2 ",
    replicas: 2,
    service_url: "https://payments.example.com",
  },
  {
    id: "3",
    name: "Notification Service",
    status: "error",
    mem_limit: "256MB",
    cpu_limit: "1 ",
    replicas: 1,
    service_url: "https://notify.example.com",
  },
];

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to fetch nodes for this project
    const fetchNodes = async () => {
      setLoading(true)
      try {
        // In a real scenario, this would be an API call using the project ID
        const fakeNodes = [
          { id: 1, name: "Node 1" },
          { id: 2, name: "Node 2" },
          { id: 3, name: "Node 3" },
        ]
        setNodes(fakeNodes)
      } catch (error) {
        console.error("Error fetching nodes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [params.id])

  const handleCreateNode = () => {
    // In a real app, this would navigate to a node creation page or open a modal
    console.log("Create new node")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
        <h1 className="text-2xl font-semibold mt-1">Project {params.id}</h1>
      <div className="flex justify-between items-center mb-4 mt-2">
        <h1 className="text-lg font-medium text-[#111827]">Services Running</h1>
        <Button onClick={()=> router.push('/create/service')} className="bg-blue-600">Create Service</Button>
      </div>
      <div className="flex flex-col gap-2 items-center lg:h-[80vh] h-[70vh] w-full">
        {serviceDatas.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            // @ts-expect-error build error

            onOperation={()=>{}}
          />
        ))}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

