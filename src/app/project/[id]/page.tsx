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
import { ChevronDown, Router } from 'lucide-react'
import { NodeCard } from "@/components/node-card"
import { getOneProject, getAllProjectNodes } from "@/app/api/projects/api"
import { useApp } from "@/context/AppContext"
import Loader from "@/components/loader"
import { Typography } from "@mui/material"
import Image from "next/image"
import noNodesIcon from "@/assets/noNodesIcon.svg"

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
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('nodes')

  const { auth,node_page_status } = useApp()
    useEffect(()=>{
      const fetchData = async () => {
        if (!auth ) return
        try {
          const data = await getOneProject(auth,params?.id)
          setProjectData(data.data)
        } catch (error) {
          console.error('Failed to fetch initial data:', error)
        }
      }
      fetchData()
    },[auth])

    useEffect(()=>{
      const fetchData = async () => {
        if (!auth ) return
        try {
          setLoading(true)
          const data = await getAllProjectNodes(auth, params?.id)
          setNodes(data.data.nodes)
        } catch (error) {
          console.error('Failed to fetch initial data:', error)
        }
        setLoading(false)
      }
      fetchData()
    },[auth])


  const handleCreateNode = () => {
    console.log("Create new node")
  }
  useEffect(()=>{
    console.log("nodes",nodes)
  },[nodes])

  if (loading) {
    return <div>
      <Loader/>
    </div>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
       {/* @ts-expect-error build */}
        <h1 className="text-2xl font-semibold">{projectData?.name}</h1>
        <div  className="flex items-center gap-2">
        <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="View by Nodes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="services">View by Services</SelectItem>
            <SelectItem value="nodes">View by Nodes</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => router.push(viewType === 'services' ? '/create/service' : '/create/node')} 
          className="bg-blue-600"
        >
          Create {viewType === 'services' ? 'Service' : 'Node'}
        </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#111827]">
          {viewType === 'services' ? 'Services Running' : 'Available Nodes'}
        </h2>
        
      </div>

      <div className="flex flex-col gap-2 items-center lg:h-[80vh] h-[70vh] w-full">
        {viewType === 'services' ? (
          serviceDatas.length>0 ? serviceDatas.map((service) => (
            <ServiceCard
            key={service.id}
            
            {...service}
            // @ts-expect-error build error
            onOperation={() => {}}
          />
          )):
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh]  w-full">
                  <Router 
                    className="w-[100px] h-[100px] text-neutral-300"
                  />
          <Typography variant="body1" className="text-gray-400 mb-4 px-6">
            No services yet.
          </Typography>
            </div>
        ) : (
          nodes.length>0 ? nodes.map((node) => (
            // @ts-expect-error build error
              <NodeCard key={node.id} {...node} fetchNodes={()=>{}} />
          )):
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh]  w-full">
                    <Image
                    src={noNodesIcon}
                    width={1000}
                    height={1000}
                    className="w-[100px] h-[100px] text-neutral-100"
                    alt="AI Cloud Lab Logo"
                  />
              <Typography variant="body1" className="text-gray-400 mb-4 px-6">
                No Nodes yet.
              </Typography>
            </div>
         )}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

