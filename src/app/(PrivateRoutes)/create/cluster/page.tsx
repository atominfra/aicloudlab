"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircleAlert, FolderOpen, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { fetchOSOptions, fetchPlans, createNode, fetchPrice } from "@/app/(PrivateRoutes)/api/nodes/api"
import { getAllProjects, getOneProject } from "@/app/(PrivateRoutes)/api/projects/api"
import { fetchAllCloudAccounts } from "@/app/(PrivateRoutes)/api/cloud/api"
import { CircularProgress } from "@mui/material"
import { useApp } from "@/context/AppContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { createCluster } from "../../api/cluster/api"
// Types
interface NodeData {
  projects_id: string
  location: string
  cluster_name: string
  cluster_type: "on_prem" | "on_cloud"
  cloud_account_id: string
  os: string
  osVersion: string
  image: string
  commitmment: string
  machine_configurations: MachineConfig[]
}

interface MachineConfig {
  type: "master" | "worker"
  number_of_machines: number
  plan: string
}

interface OSOption {
  name: string
  version: string[]
}

interface Plan {
  id: string
  plan: string
  image: string
  cpu?: number
  cpu_type?: string
  ram?: number
  disk_space: string
  gpu_card_details?: {
    name?: string
  }
  price_per_hour?: number
}

interface NodeCreationFormProps {
  initialData?: NodeData
  isEditMode?: boolean
}

const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

// const fakeApi = {
//   fetchOSOptions: async () => {
//     return [
//       { name: "Ubuntu", version: ["20.04", "22.04"] },
//       { name: "CentOS", version: ["7", "8"] },
//     ]
//   },
//   fetchPlans: async () => {
//     return {
//       data: {
//         plans: [
//           { id: "plan1", name: "Basic", plan: "t1.micro", image: "ubuntu-20.04" },
//           { id: "plan2", name: "Standard", plan: "t2.small", image: "ubuntu-20.04" },
//         ],
//       },
//     }
//   },
//   createNode: async () => {
//     return { message: "Node created successfully" }
//   },
//   fetchPrice: async () => {
//     return {
//       data: {
//         price: [
//           { unit: "hour", price: "0.05", currency: "USD" },
//           { unit: "month", price: "30", currency: "USD" },
//         ],
//       },
//     }
//   },
//   getAllProjects: async () => {
//     return {
//       data: {
//         projects: [
//           { id: "proj1", name: "Project 1" },
//           { id: "proj2", name: "Project 2" },
//         ],
//       },
//     }
//   },
//   getOneProject: async () => {
//     return {
//       data: {
//         name: "Sample Project",
//       },
//     }
//   },
//   fetchAllCloudAccounts: async () => {
//     return {
//       data: {
//         cloud_accounts: [
//           { id: "acc1", name: "AWS Account", provider: "aws" },
//           { id: "acc2", name: "Azure Account", provider: "azure" },
//         ],
//       },
//     }
//   },
// }

export default function NodeCreationForm({ initialData, isEditMode = false }: NodeCreationFormProps) {
  const [formState, setFormState] = useState<NodeData>({
    projects_id: initialData?.projects_id || "",
    location: initialData?.location || "",
    cloud_account_id: initialData?.cloud_account_id || "",
    cluster_name: initialData?.cluster_name || "",
    cluster_type: initialData?.cluster_type || "on_cloud",
    os: initialData?.os || "",
    osVersion: initialData?.osVersion || "",
    image: initialData?.image || "",
    commitmment: initialData?.commitmment || "",
    machine_configurations: initialData?.machine_configurations || [
      { type: "master", number_of_machines: 1, plan: "" },
      { type: "worker", number_of_machines: 1, plan: "" },
    ],
  })
  const [projectData, setProjectData] = useState([])
  const [loadingProject, setLoadingProject] = useState(true)
  const [osOptions, setOSOptions] = useState<OSOption[]>([])
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [loadingOs, setLoadingOs] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [price, setPrice] = useState([])
  const [accounts, setAccounts] = useState([])
  const [projects, setProjects] = useState([])
  const [locations, setLocations] = useState([
    { id: "Delhi", name: "Delhi", provider: "e2e" },
    { id: "Mumbai", name: "Mumbai", provider: "e2e" },
    { id: "centralindia", name: "Central India", provider: "azure" },
    { id: "ap-south-1", name: "Mumbai", provider: "aws" },
  ])
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")
  const nodeID = searchParams.get("node-id")
  const [filteredLocations, setFilteredLocations] = useState([])
  const { auth } = useApp()
  const router = useRouter()
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof NodeData]?: string }>({})

  useEffect(() => {
    const fetchData = async () => {
      if (!auth) return
      try {
        setLoadingProjects(true)
        const data = await getAllProjects(auth)
        setProjects(data.data.projects)
      } catch (error) {
        console.error("Failed to fetch initial data:", error)
      }
      setLoadingProjects(false)
    }
    fetchData()
  }, [auth])

  useEffect(() => {
    const fetchData = async () => {
      if (!auth || !formState.cloud_account_id || !formState.location) return
      try {
        setLoadingOs(true)
        const data = await fetchOSOptions(auth,formState.cloud_account_id, formState.location)
        setOSOptions(data)
      } catch (error) {
        console.error("Failed to fetch initial data:", error)
      }
      setLoadingOs(false)
    }
    fetchData()
  }, [formState.cloud_account_id, formState.location, auth])

  useEffect(() => {
    const selectedOSOption = osOptions.find((os) => os.name === formState.os)
    setOSVersions(selectedOSOption?.version || [])
  }, [formState.os, osOptions])

  const fetchAvailablePlans = useCallback(async () => {
    if (!formState.os || !formState.osVersion || !formState.location || !formState.cloud_account_id) return
    setLoadingPlans(true)
    try {
      const plansData = await fetchPlans(auth,formState.os,
        formState.osVersion,
        formState.location,
        formState.cloud_account_id,)
      setPlans(plansData.data.plans)
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    } finally {
      setLoadingPlans(false)
    }
  }, [formState.cloud_account_id, formState.location, formState.os, formState.osVersion])

  useEffect(() => {
    fetchAvailablePlans()
  }, [fetchAvailablePlans])

  const fetchPriceData = useCallback(async () => {
    const selectedPlan = findplan(plans, formState.machine_configurations[0].plan)
    const provider = (accounts && accounts.find((p) => p.id === formState.cloud_account_id)?.provider) || ""
    const plan = provider === "e2e" ? selectedPlan?.plan : selectedPlan?.id
    console.log("plan", plan, provider)
    if (!formState.os || !formState.osVersion || !formState.location || !plan) return
    setLoadingPrice(true)
    try {
      const plansData = await fetchPrice(auth,
        formState.os,
        formState.osVersion,
        formState.location,
        formState.cloud_account_id,
        plan,)
      setPrice(plansData.data.price)
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    } finally {
      setLoadingPrice(false)
    }
  }, [
    accounts,
    formState.cloud_account_id,
    formState.location,
    formState.machine_configurations,
    formState.os,
    formState.osVersion,
    plans,
  ])

  useEffect(() => {
    if (auth && formState.machine_configurations[0].plan) {
      fetchPriceData()
    }
  }, [auth, formState.machine_configurations, fetchPriceData])

  useEffect(() => {
    async function loadCloudAccounts() {
      try {
        setLoadingAccounts(true)
        const accounts = await fetchAllCloudAccounts(auth)
        setAccounts(accounts?.data?.cloud_accounts)
      } catch (error) {
        console.error("Failed to fetch accounts:", error)
      } finally {
        setLoadingAccounts(false)
      }
    }
    if (auth) {
      loadCloudAccounts()
    }
  }, [auth])

  const updateFormState = (field: keyof NodeData, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const updateMachineConfig = (index: number, field: keyof MachineConfig, value) => {
    setFormState((prev) => {
      const newConfigurations = [...prev.machine_configurations]
      newConfigurations[index] = { ...newConfigurations[index], [field]: value }

      // If the new type is "master", update all other configurations to "worker"
      if (field === "type" && value === "master") {
        newConfigurations.forEach((config, i) => {
          if (i !== index) {
            config.type = "worker"
          }
        })
      }

      return {
        ...prev,
        machine_configurations: newConfigurations,
      }
    })

    // Clear the error for the updated field
    setFieldErrors((prev) => ({
      ...prev,
      machine_configurations: undefined,
    }))
  }

  const addMachineConfig = () => {
    setFormState((prev) => {
      const hasMaster = prev.machine_configurations.some((config) => config.type === "master")
      return {
        ...prev,
        machine_configurations: [
          ...prev.machine_configurations,
          { type: hasMaster ? "worker" : "master", number_of_machines: 1, plan: "" },
        ],
      }
    })
  }

  const removeMachineConfig = (index: number) => {
    setFormState((prev) => {
      const workerNodes = prev.machine_configurations.filter((config) => config.type === "worker")
      if (workerNodes.length === 1 && prev.machine_configurations[index].type === "worker") {
        // Don't remove if it's the last worker node
        return prev
      }
      return {
        ...prev,
        machine_configurations: prev.machine_configurations.filter((_, i) => i !== index),
      }
    })
  }

  const validateForm = () => {
    const errors: { [key in keyof NodeData]?: string } = {}
    if (!formState.cluster_name) errors.cluster_name = "Cluster name is required"
    else if (formState.cluster_name.includes("_") || formState.cluster_name.includes(" ")) {
      errors.cluster_name = "Cluster name cannot contain an underscore (_) or spaces."
    }
    if (!formState.cloud_account_id) errors.cloud_account_id = "Cloud account is required"
    if (!formState.location) errors.location = "Location is required"
    if (!formState.os) errors.os = "Operating system is required"
    if (!formState.osVersion) errors.osVersion = "OS version is required"
    if (formState.machine_configurations.length === 0) {
      errors.machine_configurations = "At least one machine configuration is required"
    }
    const masterNodes = formState.machine_configurations.filter((config) => config.type === "master")
    const workerNodes = formState.machine_configurations.filter((config) => config.type === "worker")

    if (masterNodes.length === 0) {
      errors.machine_configurations = "There must be at least one master node"
    } else if (masterNodes.length > 1) {
      errors.machine_configurations = "There can only be one master node"
    } else if (workerNodes.length === 0) {
      errors.machine_configurations = "There must be at least one worker node"
    }

    formState.machine_configurations.forEach((config, index) => {
      if (!config.plan) {
        errors.machine_configurations = "All machine configurations must have a plan selected"
      }
      if (config.type === "worker" && (!config.number_of_machines || config.number_of_machines < 1)) {
        errors.machine_configurations = "Worker nodes must have at least 1 machine"
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    const clusterData = {
      name: formState.cluster_name,
      image_url: "nginx", // You might want to make this dynamic
      mem_limit: "30Mi", // You might want to make this dynamic
      cpu_limit: "1", // You might want to make this dynamic
      replicas: 1, // You might want to make this dynamic
      env_variables: {}, // You might want to make this dynamic
      cluster_id: Number.parseInt(formState.projects_id), // Assuming projects_id is the cluster_id
      registry_credential_id: 1, // You might want to make this dynamic
      target_port: 80, // You might want to make this dynamic
    }

    try {
      setLoading(true)
      const result = await createCluster(auth, clusterData)
      console.log("Result:", result)
      if (result.error === "true") {
        setError(result.message)
        return
      } else {
        console.log("Cluster created successfully:", result)
        router.push(`/project/${projectId}?viewType=clusters`)
      }
    } catch (error) {
      console.error("Failed to create cluster:", error)
      setError("Something Went Wrong")
    } finally {
      setLoading(false)
    }
  }

  const findplan = (plans: Plan[], value: string) => {
    return plans.find((plan) => plan.id === value)
  }

  const fethcProjectData = useCallback(async () => {
    if (!projectId) return
    try {
      setLoadingProject(true)
      const data = await getOneProject(auth,projectId)
      setProjectData(data.data)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
    }
    setLoadingProject(false)
  }, [projectId])

  useEffect(() => {
    if (projectId) fethcProjectData()
  }, [projectId, fethcProjectData])

  const handleAccountChange = (value: string) => {
    const accountId = accounts.find((p) => p.name === value)?.id || ""
    setFormState((prev) => ({
      ...prev,
      cloud_account_id: accountId,
      location: "",
      os: "",
      osVersion: "",
      commitmment: "",
    }))
    setOSOptions([])
    setOSVersions([])
    setPrice([])
    setFieldErrors((prev) => ({ ...prev, cloud_account_id: undefined }))
  }

  const handleProjectChange = (value: string) => {
    const projects_id = projects.find((p) => p.name === value)?.id || ""
    setFormState((prev) => ({
      ...prev,
      projects_id: projects_id,
    }))
    setFieldErrors((prev) => ({ ...prev, projects_id: undefined }))
  }

  const handleLocationChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      location: value,
      os: "",
      osVersion: "",
      commitmment: "",
    }))
    setOSOptions([])
    setOSVersions([])
    setPrice([])
    setFieldErrors((prev) => ({ ...prev, location: undefined }))
  }

  const handleOsOptionsChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      os: value,
      osVersion: "",
      commitmment: "",
    }))
    setOSVersions([])
    setPrice([])
    setFieldErrors((prev) => ({ ...prev, os: undefined }))
  }

  const handleOsVersionChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      osVersion: value,
      commitmment: "",
    }))
    setPrice([])
    setFieldErrors((prev) => ({ ...prev, osVersion: undefined }))
  }

  const handleAddAccount = () => {
    window.open("/create/connect-account", "_ blank")
  }

  const handleAddProject = () => {
    window.open("/create/project", "_ blank")
  }

  const refreshAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await fetchAllCloudAccounts(auth)
      setAccounts(accounts?.data?.cloud_accounts)
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const refreshProjects = async () => {
    try {
      setLoadingProjects(true)
      const projectsData = await getAllProjects(auth)
      setProjects(projectsData?.data?.projects)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    return `/placeholder.svg?text=${provider.toUpperCase()}`
  }

  const formatPlanName = (plan: Plan) => {
    return (
      <div className="gap-2 w-[full]">
        {plan.cpu && plan.cpu_type && (
          <span className="inline-flex items-center min-w-[40px] px-2.5 py-0.5 rounded-full text-xs font-medium">
            {plan.cpu} {plan.cpu_type}
          </span>
        )}
        {plan.ram && <span>•</span>}
        {plan.ram && (
          <span className="inline-flex items-center px-2.5 min-w-[140px] py-0.5 rounded-full text-xs font-medium">
            {plan.ram} GB Ram
          </span>
        )}
        {plan.gpu_card_details && Object.keys(plan.gpu_card_details).length > 0 && plan.gpu_card_details.name && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {plan.gpu_card_details.name}
          </span>
        )}
      </div>
    )
  }

  const formatPrice = (priceItem) => {
    return `${priceItem.price} ${priceItem.unit}`
  }

  const hasMasterNode = (configurations: MachineConfig[]) => {
    return configurations.some((config) => config.type === "master")
  }

  useEffect(() => {
    router.prefetch("/dashboard/projects")
    router.prefetch(`/project/${projectId}?viewType=nodes`)
  }, [router, projectId])

  return (
    <div className="bg-neutral-100 lg:min-h-screen min-h-[92dvh] flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto lg:mt-[5vh]">
        <Card className="bg-neutral-100 shadow-none border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-lg lg:text-2xl font-semibold">
              {isEditMode ? "Edit Cluster" : "Create a New Cluster"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 border  max-w-2xl md:mx-auto border-red-100  p-4 rounded-lg flex gap-2 items-center">
                <CircleAlert className="text-red-500  size-4 " />
                <div>{error}</div>
              </div>
            )}
            {projectId && (
              <div className="">
                <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
                  Project *
                </label>
                {!loadingProject ? (
                  <div className="relative">
                    <Input
                      disabled={true}
                      id="service-name"
                      name="name"
                      // @ts-expect-error build
                      value={projectData.name}
                      placeholder="Enter service name"
                      className="max-w-full"
                    />
                    <div className="flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5">
                      <FolderOpen size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center border bg-white p-2 rounded-md text-sm text-gray-500">
                    <CircularProgress size={16} className="mr-2 " />
                    Loading Project Details..
                  </div>
                )}
              </div>
            )}

            {!projectId && (
              <div className="space-y-2">
                <label htmlFor="project-id" className="pl-2 text-sm font-medium">
                  Select Project *
                </label>
                <div className="flex gap-2">
                  <Select
                    value={(projects && projects.find((p) => p.id === formState.projects_id)?.name) || ""}
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger className={fieldErrors.projects_id ? "border-red-500" : ""}>
                      {loadingProjects ? (
                        <div className="flex items-center">
                          <CircularProgress size={16} className="mr-2" />
                          Loading Projects...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select Project" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {projects && projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-project-available">No projects Available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="flex-shrink-0" onClick={handleAddProject}>
                    <div>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add project</span>
                    </div>
                  </Button>
                  <Button type="button" variant="outline" onClick={refreshProjects} className="p-2">
                    <RefreshCw size={16} />
                  </Button>
                </div>
                {fieldErrors.projects_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.projects_id}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cluster_name">Cluster Name *</Label>
              <Input
                id="cluster_name"
                placeholder="Enter cluster name"
                value={formState.cluster_name}
                onChange={(e) => updateFormState("cluster_name", e.target.value)}
                className={`max-w-full placeholder:text-black text-sm ${fieldErrors.cluster_name ? "border-red-500" : ""}`}
              />
              {fieldErrors.cluster_name && <p className="text-red-500 text-sm mt-1">{fieldErrors.cluster_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster_type">Cluster Type *</Label>
              <Select value={formState.cluster_type} onValueChange={(value) => updateFormState("cluster_type", value)}>
                <SelectTrigger id="cluster_type" className={fieldErrors.cluster_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Cluster Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_prem">On-Premises</SelectItem>
                  <SelectItem value="on_cloud">On Cloud</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.cluster_type && <p className="text-red-500 text-sm mt-1">{fieldErrors.cluster_type}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="cloud_account" className="pl-2 text-sm font-medium">
                Select Cloud Account *
              </label>
              <div className="flex gap-2">
                <Select
                  value={(accounts && accounts.find((p) => p.id === formState.cloud_account_id)?.name) || ""}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger className={fieldErrors.cloud_account_id ? "border-red-500" : ""}>
                    {loadingAccounts ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Accounts...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select Cloud Account" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {accounts && accounts.length > 0 ? (
                      accounts.map((cloud_account) => (
                        <SelectItem key={cloud_account.name} value={cloud_account.name}>
                          <div className="flex gap-3 items-center">
                            {getProviderIcon(cloud_account.provider) && (
                              <Image
                                src={getProviderIcon(cloud_account.provider) || "/placeholder.svg"}
                                alt={cloud_account.provider}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            {`${cloud_account.name}`}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-account-available">No Account Available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="flex-shrink-0" onClick={handleAddAccount}>
                  <div>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Connect Account</span>
                  </div>
                </Button>
                <Button type="button" variant="outline" onClick={refreshAccounts} className="p-2">
                  <RefreshCw size={16} />
                </Button>
              </div>
              {fieldErrors.cloud_account_id && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.cloud_account_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cloud_account" className="pl-2 text-sm font-medium">
                Select Location *
              </label>
              <div className="flex gap-2">
                <Select
                  value={formState.location}
                  onValueChange={handleLocationChange}
                  disabled={!formState.cloud_account_id}
                >
                  <SelectTrigger className={fieldErrors.location ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter(
                        (location) =>
                          accounts.find((acc) => acc.id === formState.cloud_account_id)?.provider === location.provider,
                      )
                      .map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {fieldErrors.location && <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="os" className="pl-2 ">
                Operating System *
              </Label>
              <Select
                onValueChange={handleOsOptionsChange}
                value={formState.os}
                disabled={osOptions && osOptions.length === 0}
              >
                <SelectTrigger id="os" className={`max-w-full ${fieldErrors.os ? "border-red-500" : ""}`}>
                  {loadingOs ? (
                    <div className="flex items-center">
                      <CircularProgress size={16} className="mr-2" />
                      Loading Os Options ...
                    </div>
                  ) : (
                    <SelectValue placeholder="Select OS" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {osOptions.length > 0 ? (
                    osOptions.map((os) => (
                      <SelectItem key={os.name} value={os.name}>
                        {os.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-osOption-available">No Os Options Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {fieldErrors.os && <p className="text-red-500 text-sm mt-1">{fieldErrors.os}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="os-version">OS Version *</Label>
              <Select onValueChange={handleOsVersionChange} value={formState.osVersion} disabled={!formState.os}>
                <SelectTrigger
                  id="os-version"
                  className={`max-w-full ${fieldErrors.osVersion ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {osVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.osVersion && <p className="text-red-500 text-sm mt-1">{fieldErrors.osVersion}</p>}
            </div>

            <Accordion
              type="single"
              collapsible
              className={`w-full border rounded-md bg-white ${fieldErrors.machine_configurations ? "border-red-500" : ""}`}
            >
              <AccordionItem value="machine-configuration">
                <AccordionTrigger className="px-4 py-2">Machine Configuration</AccordionTrigger>
                <AccordionContent className="px-4 py-2 ">
                  <div className="space-y-4">
                    {formState.machine_configurations.map((config, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md space-y-4"
                        style={{ borderColor: fieldErrors.machine_configurations ? "red" : "inherit" }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="space-y-2 flex-grow">
                            <Label htmlFor={`node-type-${index}`}>Node Type *</Label>
                            <Select
                              value={config.type}
                              onValueChange={(value) => updateMachineConfig(index, "type", value)}
                              disabled={config.type === "master" && index !== 0}
                            >
                              <SelectTrigger id={`node-type-${index}`} className="w-full">
                                <SelectValue placeholder="Select Node Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="master"
                                  disabled={hasMasterNode(formState.machine_configurations) && config.type !== "master"}
                                >
                                  Master
                                </SelectItem>
                                <SelectItem value="worker">Worker</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMachineConfig(index)}
                              className="self-start mt-8"
                              disabled={
                                formState.machine_configurations.filter((c) => c.type === "worker").length === 1 &&
                                config.type === "worker"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {config.type === "worker" && (
                          <div className="space-y-2">
                            <Label htmlFor={`number-of-machines-${index}`}>Number of Machines *</Label>
                            <Input
                              id={`number-of-machines-${index}`}
                              type="number"
                              min="1"
                              value={config.number_of_machines}
                              onChange={(e) =>
                                updateMachineConfig(index, "number_of_machines", Number.parseInt(e.target.value))
                              }
                              className={
                                !config.number_of_machines || config.number_of_machines < 1 ? "border-red-500" : ""
                              }
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor={`plan-${index}`}>Plan *</Label>
                          <Select
                            value={config.plan}
                            onValueChange={(value) => updateMachineConfig(index, "plan", value)}
                          >
                            <SelectTrigger
                              id={`plan-${index}`}
                              className={`w-full ${fieldErrors.machine_configurations && !config.plan ? "border-red-500" : ""}`}
                            >
                              <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {plans.length > 0 ? (
                                plans.map((plan) => (
                                  <SelectItem key={plan.id} value={plan.id} className="flex border-b">
                                    {formatPlanName(plan)}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-plan-available">No Plans Available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    {fieldErrors.machine_configurations && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.machine_configurations}</p>
                    )}
                    <Button type="button" variant="outline" onClick={addMachineConfig}>
                      Add Machine
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* {fieldErrors.machine_configurations && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.machine_configurations}</p>
            )} */}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/projects")}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`bg-[#2563EB] text-white ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Creating..." : "Create Cluster"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

