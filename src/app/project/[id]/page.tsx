'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import withAuth from '@/components/withAuth'
import { ServiceCard } from "@/components/service-card"
import { ChevronDown } from 'lucide-react'
import { NodeCard } from "@/components/node-card"

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
]

const nodesData = [
  {
    id: 1,
    name: "Node-A",
    memory: "16GB",
    vcpus: "4 vCPU",
    disk: "500GB",
    private_ip_address: "192.168.1.10",
    public_ip_address: "203.0.113.10",
    gpu: "NVIDIA Tesla V100",
    isDeleted: false,
    status: "running",
  },
  {
    id: 2,
    name: "Node-B",
    memory: "32GB",
    vcpus: "8 vCPU",
    disk: "1TB",
    private_ip_address: "192.168.1.11",
    public_ip_address: "203.0.113.11",
    gpu: "NVIDIA A100",
    isDeleted: false,
    status: "stopped",
  },
  {
    id: 3,
    name: "Node-C",
    memory: "64GB",
    vcpus: "16 vCPU",
    disk: "2TB",
    private_ip_address: "192.168.1.12",
    public_ip_address: "203.0.113.12",
    gpu: "NVIDIA RTX 3090",
    isDeleted: true,
    status: "error",
  },
];


type ViewType = 'services' | 'nodes'

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<ViewType>('services')

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true)
      try {
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
    console.log("Create new node")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Project Alpha</h1>
        <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="View by Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="services">View by Services</SelectItem>
            <SelectItem value="nodes">View by Nodes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#111827]">
          {viewType === 'services' ? 'Services Running' : 'Available Nodes'}
        </h2>
        <Button 
          onClick={() => router.push(viewType === 'services' ? '/create/service' : '/create/node')} 
          className="bg-blue-600"
        >
          Create {viewType === 'services' ? 'Service' : 'Node'}
        </Button>
      </div>

      <div className="flex flex-col gap-2 items-center lg:h-[80vh] h-[70vh] w-full">
        {viewType === 'services' ? (
          serviceDatas.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
            // @ts-expect-error build error
              onOperation={() => {}}
            />
          ))
        ) : (
          nodesData.map((node) => (
            // @ts-expect-error build error
            node.isDeleted === false && <NodeCard key={node.name} {...node} fetchNodes={()=>{}} />
           
          ))
        )}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

