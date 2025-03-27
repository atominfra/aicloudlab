"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import withAuth from "@/components/withAuth"
import { ServiceCard } from "@/components/service-card"
import { ChevronDown, Router, Plus, Layers, Server, RefreshCw } from "lucide-react"
import { NodeCard } from "@/components/node-card"
import { getOneProject, getAllProjectNodes } from "@/app/(PrivateRoutes)/api/projects/api"
import { useApp } from "@/context/AppContext"
import Loader from "@/components/loader"
import { getAllProjectServices } from "@/app/(PrivateRoutes)/api/services/api"
import { Typography } from "@mui/material"
import Image from "next/image"
import noNodesIcon from "@/assets/noNodesIcon.svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClusterCard } from "@/components/cluster-card"
import { fetchAllClusters } from "@/app/(PrivateRoutes)/api/cluster/api"

interface Node {
  id: number
  name: string
}

type ViewType = "services" | "nodes" | "clusters" | null

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [services, setServices] = useState([])
  const [clusters, setClusters] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingClusters, setLoadingClusters] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [viewType, setViewType] = useState<ViewType>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [clusterServices, setClusterServices] = useState([])
  const [loadingClusterServices, setLoadingClusterServices] = useState(false)

  const searchParams = useSearchParams()
  const view = searchParams.get("viewType")

  useEffect(() => {
    const view = searchParams.get("viewType")
    if (view === "services" || view === "nodes" || view === "clusters") {
      setViewType(view as ViewType)
    } else {
      setViewType("services")
      const currentParams = new URLSearchParams(window.location.search)
      currentParams.set("viewType", "services")
      const newUrl = `${window.location.pathname}?${currentParams.toString()}`
      router.push(newUrl)
    }
  }, [searchParams, router])

  const { auth } = useApp()

  const fetchProjectDetails = useCallback(async () => {
    if (!auth) return
    try {
      setLoadingProjects(true)
      const data = await getOneProject(auth, params?.id)
      setProjectData(data.data)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
    } finally {
      setLoadingProjects(false)
    }
  }, [auth, params?.id])

  useEffect(() => {
    fetchProjectDetails()
  }, [fetchProjectDetails])

  const refreshRegistries = async () => {
    setIsRefreshing(true)
    try {
      if (viewType === "nodes") {
        await fetchNodes()
      } else if (viewType === "services") {
        await fetchServices()
        await fetchClusterServices() // Add this line
      } else if (viewType === "clusters") {
        await fetchClusters()
      }
    } catch (err) {
      console.log("refresh failed")
    } finally {
      setIsRefreshing(false)
    }
  }

  const fetchNodes = useCallback(async () => {
    if (!auth) return
    try {
      setLoadingNodes(true)
      const data = await getAllProjectNodes(auth, params?.id)
      setNodes(data.data.nodes)
    } catch (error) {
      console.error("Failed to fetch nodes:", error)
    }
    setLoadingNodes(false)
  }, [auth, params?.id])

  const fetchServices = useCallback(async () => {
    if (!auth) return
    try {
      setLoadingServices(true)
      const data = await getAllProjectServices(auth, params?.id)
      setServices(data.data.services)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    }
    setLoadingServices(false)
  }, [auth, params?.id])

  const fetchClusterServices = useCallback(async () => {
    if (!auth) return
    try {
      setLoadingClusterServices(true)
      // Call the deployment API with project_id
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/deployment?project_id=${params?.id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setClusterServices(data.data.deployments || [])
      } else {
        console.error("Failed to fetch cluster services:", data)
      }
    } catch (error) {
      console.error("Failed to fetch cluster services:", error)
    }
    setLoadingClusterServices(false)
  }, [auth, params?.id])

  const fetchClusters = useCallback(async () => {
    if (!auth) return
    try {
      setLoadingClusters(true)
      const data = await fetchAllClusters(auth)
      setClusters(data.data.clusters)
    } catch (error) {
      console.error("Failed to fetch clusters:", error)
    }
    setLoadingClusters(false)
  }, [auth, params?.id])

  useEffect(() => {
    if (viewType === "nodes") {
      fetchNodes()
    } else if (viewType === "services") {
      fetchServices()
      fetchClusterServices() // Add this line to fetch cluster services
    } else if (viewType === "clusters") {
      fetchClusters()
    }
  }, [viewType, fetchNodes, fetchServices, fetchClusters, fetchClusterServices])

  const handleViewTypeChange = (newViewType: ViewType) => {
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set("viewType", newViewType)
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`
    router.push(newUrl)
  }

  useEffect(()=>{
    console.log("nginx-55.k8s.dev.aicloudlab.atominfra.com",clusterServices)
  },[clusterServices])

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          {/* @ts-expect-error build */}
          {projectData?.name && <span>Project: {projectData?.name}</span>}
        </h1>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={refreshRegistries} disabled={isRefreshing} className="p-2">
            <RefreshCw size={16} />{" "}
            <span className="hidden lg:block">
              Refresh {viewType === "services" ? "Services" : viewType === "nodes" ? "Nodes" : "Clusters"}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4">
                {viewType === "services" ? (
                  <Layers className="h-4 w-4 " />
                ) : viewType === "nodes" ? (
                  <Server className="h-4 w-4 " />
                ) : (
                  <Layers className="h-4 w-4 " />
                )}
                <span className="hidden sm:inline">
                  {viewType === "services"
                    ? "View by Services"
                    : viewType === "nodes"
                      ? "View by Nodes"
                      : "View by Clusters"}
                </span>
                <ChevronDown className="h-4 w-4 ml-2 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuCheckboxItem
                checked={viewType === "services"}
                onCheckedChange={() => handleViewTypeChange("services")}
              >
                <Layers className="h-4 w-4 mr-2" />
                View by Services
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={viewType === "nodes"}
                onCheckedChange={() => handleViewTypeChange("nodes")}
              >
                <Server className="h-4 w-4 mr-2" />
                View by Nodes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={viewType === "clusters"}
                onCheckedChange={() => handleViewTypeChange("clusters")}
              >
                <Layers className="h-4 w-4 mr-2" />
                View by Clusters
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {viewType === "services" ? (
            <Button
              variant="default"
              className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90"
              onClick={() => router.push(`/create/service?projectId=${params.id}`)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Service</span>
            </Button>
          ) : viewType === "nodes" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Node</span>
                  <ChevronDown className="h-4 w-4 ml-2 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[228px]">
                <DropdownMenuItem onClick={() => router.push(`/create/node?projectId=${params.id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create new node
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/connect/node?projectId=${params.id}`)}>
                  <Router className="h-4 w-4 mr-2" />
                  Connect existing node
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90"
              onClick={() => router.push(`/create/cluster?projectId=${params.id}`)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Cluster</span>
            </Button>
          )}
        </div>
      </div>

      {!loadingProjects && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#111827]">
            {viewType === "services"
              ? "Services Running"
              : viewType === "nodes"
                ? "Available Nodes"
                : "Available Clusters"}
          </h2>
        </div>
      )}

      <div className="flex flex-col gap-2 items-center h-[calc(100vh-180px)] w-full">
        {viewType === "services" ? (
          loadingServices || loadingClusterServices ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loader />
            </div>
          ) : (services && services.length > 0) || (clusterServices && clusterServices.length > 0) ? (
            <>
              {/* Regular services */}
              {services && services.length > 0 && (
                <>
                  <div className="w-full mb-4 mt-2">
                    <h3 className="text-md font-medium text-gray-600">Project Services</h3>
                  </div>
                  {services.map((service) => (
                    <ServiceCard key={service.id} {...service} onOperation={() => {}} projectId={params?.id} />
                  ))}
                </>
              )}

              {/* Cluster services */}
              {clusterServices && clusterServices.length > 0 && (
                <>
                  {clusterServices.map((service) => (
                    <ServiceCard
                      key={`cluster-${service.id || service.deployment_id}`}
                      {...service}
                      isClusterService={true}
                      onOperation={() => {}}
                      projectId={params?.id}
                      type_cluster={true}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <Router className="w-16 h-16 text-neutral-200 mb-4" />
              <Typography variant="body1" className="text-gray-400 text-center">
                No services yet
              </Typography>
            </div>
          )
        ) : viewType === "nodes" ? (
          loadingNodes ? (
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
          )
        ) : loadingClusters ? (
          <div className="flex justify-center items-center h-full w-full">
            <Loader />
          </div>
        ) : clusters && clusters.length > 0 ? (
          clusters.map((cluster) => (
            <ClusterCard key={cluster.cluster_id} {...cluster} fetchClusters={fetchClusters} projectId={params.id} projectName={projectData?.name}/>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-full w-full">
            <Layers className="w-16 h-16 text-neutral-200 mb-4" />
            <Typography variant="body1" className="text-gray-400 text-center">
              No clusters yet
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

