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
import { ChevronDown, Router, Plus, Layers, Server } from 'lucide-react'
import { NodeCard } from "@/components/node-card"
import { getOneProject, getAllProjectNodes } from "@/app/api/projects/api"
import { useApp } from "@/context/AppContext"
import Loader from "@/components/loader"
import { getAllProjectServices } from "@/app/api/services/api"
import { Typography } from "@mui/material"
import Image from "next/image"
import noNodesIcon from "@/assets/noNodesIcon.svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [services, setServices] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('services')

  const { auth } = useApp()
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
    
    const fetchNodes = async () => {
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
    useEffect(()=>{
      fetchNodes()
    },[auth])

    const fetchServices = async () => {
      if (!auth ) return
      try {
        setLoading(true)
        const data = await getAllProjectServices(auth, params?.id)
        setServices(data.data.services)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
      setLoading(false)
    }

    useEffect(()=>{
      if(viewType === 'services'){
        fetchServices()
      }
    },[auth, viewType])

  if (loading) {
    return <div>
      <Loader/>
    </div>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        {/* @ts-expect-error build */}
        <h1 className="text-xl sm:text-2xl font-semibold">{projectData?.name}</h1>
        <div className="flex items-center gap-2">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"  className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4">
                {viewType === 'services' ? (
                  <Layers className="h-4 w-4 sm:mr-2" />
                ) : (
                  <Server className="h-4 w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">
                  {viewType === 'services' ? 'View by Services' : 'View by Nodes'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuCheckboxItem
                checked={viewType === 'services'}
                onCheckedChange={() => setViewType('services')}
              >
                <Layers className="h-4 w-4 mr-2" />
                View by Services
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={viewType === 'nodes'}
                onCheckedChange={() => setViewType('nodes')}
              >
                <Server className="h-4 w-4 mr-2" />
                View by Nodes
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button 
            variant="default" 
            className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90" 
            onClick={() => router.push(viewType === 'services' ? `/create/service?projectId=${params.id}` : `/create/node?projectId=${params.id}`)}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create {viewType === 'services' ? 'Service' : 'Node'}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#111827]">
          {viewType === 'services' ? 'Services Running' : 'Available Nodes'}
        </h2>
      </div>

      <div className="flex flex-col gap-2 items-center h-[calc(100vh-180px)] w-full">
        {viewType === 'services' ? ( services &&
          services.length > 0 ? services.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              onOperation={() => {}}
              projectId={params?.id}
            />
          )) : (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <Router 
                className="w-16 h-16 text-neutral-200 mb-4"
              />
              <Typography variant="body1" className="text-gray-400 text-center">
                No services yet
              </Typography>
            </div>
          )
        ) : (
          nodes.length > 0 ? nodes.map((node) => (
            // @ts-expect-error build error
            <NodeCard key={node.id} {...node} fetchNodes={fetchNodes} projectId={params.id}  />
          )) : (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <Image
                src={noNodesIcon}
                width={1000}
                height={1000}
                className="w-16 h-16 text-neutral-100 mb-4"
                alt="AI Cloud Lab Logo"
              />
              <Typography variant="body1" className="text-gray-400 text-center">
                No nodes yet
              </Typography>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

