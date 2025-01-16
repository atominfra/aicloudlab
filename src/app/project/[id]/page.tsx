'use client'

import { useRouter, useSearchParams } from "next/navigation"
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
import { ChevronDown, Router, Plus, Layers, Server, RefreshCw } from 'lucide-react'
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

type ViewType = 'services' | 'nodes' | null

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [services, setServices] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [viewType, setViewType] = useState<ViewType>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const searchParams = useSearchParams()
  const view = searchParams.get('viewType')

  useEffect(() => {
    console.log("viewType",view)
    if (view === 'services') {
      setViewType('services')
    }else if (view === 'nodes'){
      setViewType('nodes')
    }
    else{
      setViewType('services')
    }
  }, [])

  const { auth } = useApp()

  const fetchProjectDetails = async () => {
    if (!auth) return
    try {
      setLoadingProjects(true)
      const data = await getOneProject(auth, params?.id)
      setProjectData(data.data)
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [auth])

  const refreshRegistries = async () => {
    setIsRefreshing(true)
    try {
      if (viewType === "nodes") {
        const data = await fetchNodes()
      } else {
        const data = await fetchServices()
      }
    } catch (err) {
      console.log("refresh failed")
    } finally {
      setIsRefreshing(false)
    }
  }

  const fetchNodes = async () => {
    if (!auth) return
    try {
      setLoadingNodes(true)
      const data = await getAllProjectNodes(auth, params?.id)
      setNodes(data.data.nodes)
    } catch (error) {
      console.error('Failed to fetch nodes:', error)
    }
    setLoadingNodes(false)
  }

  useEffect(() => {
    if (viewType === 'nodes') {
      fetchNodes()
    }
  }, [auth, viewType])

  const fetchServices = async () => {
    if (!auth) return
    try {
      setLoadingServices(true)
      const data = await getAllProjectServices(auth, params?.id)
      setServices(data.data.services)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
    setLoadingServices(false)
  }

  useEffect(() => {
    if (viewType === 'services') {
      fetchServices()
    }
  }, [auth, viewType])

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          {/* @ts-expect-error build */}
          {projectData?.name && <span>Project: {projectData?.name}</span>}
        </h1>
        <div className="flex items-center gap-2">
        <Button
            type="button"
            variant="outline"
            onClick={refreshRegistries}
            disabled={isRefreshing}
            className="p-2"
          >
            <RefreshCw size={16} /> <span>Refresh {viewType==='services'? "Services":"Nodes"}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4">
                {viewType === 'services' ? (
                  <Layers className="h-4 w-4 " />
                ) : (
                  <Server className="h-4 w-4 " />
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
          </DropdownMenu>
          
          <Button
            variant="default"
            className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90"
            onClick={() =>
              router.push(
                viewType === 'services'
                  ? `/create/service?projectId=${params.id}`
                  : `/create/node?projectId=${params.id}`
              )
            }
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create {viewType === 'services' ? 'Service' : 'Node'}</span>
          </Button>
        </div>
      </div>

      {!loadingProjects && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#111827]">
            {viewType === 'services' ? 'Services Running' : 'Available Nodes'}
          </h2>
        </div>
      )}

      <div className="flex flex-col gap-2 items-center h-[calc(100vh-180px)] w-full">
        {viewType === 'services' ? (
          loadingServices ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loader />
            </div>
          ) : services && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                onOperation={() => {}}
                projectId={params?.id}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <Router className="w-16 h-16 text-neutral-200 mb-4" />
              <Typography variant="body1" className="text-gray-400 text-center">
                No services yet
              </Typography>
            </div>
          )
        ) : loadingNodes ? (
          <div className="flex justify-center items-center h-full w-full">
            <Loader />
          </div>
        ) : nodes.length > 0 ? (
          nodes.map((node) => (
            // @ts-expect-error build
            <NodeCard key={node.id} {...node} fetchNodes={fetchNodes} projectId={params.id} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-full w-full">
            <Image
              src={noNodesIcon || "/placeholder.svg"}
              width={1000}
              height={1000}
              className="w-16 h-16 text-neutral-100 mb-4"
              alt="AI Cloud Lab Logo"
            />
            <Typography variant="body1" className="text-gray-400 text-center">
              No nodes yet
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)
