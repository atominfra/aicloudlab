"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { Eye, EyeOff, Trash2, GalleryVerticalEnd, Router, RefreshCw, Plus, FolderOpen, CircleAlert } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { CircularProgress } from "@mui/material"
import { getOneProject } from "@/app/(PrivateRoutes)/api/projects/api"
import { getAllProjectNodes } from "@/app/(PrivateRoutes)/api/projects/api"
import azureIcon from "@/assets/azure.svg"
import gcpIcon from "@/assets/gcp.svg"
import awsIcon from "@/assets/aws.svg"
import Image from "next/image"
import e2eIcon from "@/assets/e2elogo.webp"

interface EnvVariable {
  key: string
  value: string
  isVisible: boolean
}

interface RegistryCredential {
  id: number
  name: string
}

interface CreateServiceProps {
  serviceId?: string
}

const CreateService: React.FC<CreateServiceProps> = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId = searchParams.get("id")

  const { auth } = useApp()
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    node_id: "",
    target_port: "",
    memoryLimit: "",
    cluster: "",
    cpuLimit: "",
    registryCredential: "",
    env_variables: [{ key: "", value: "", isVisible: false }] as EnvVariable[],
  })
  const [registries, setRegistries] = useState<RegistryCredential[]>([])
  const [isRegistriesLoading, setIdRegistriesLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [customMemoryLimit, setCustomMemoryLimit] = useState("")
  const [isNodeLoading, setIsNodeLoading] = useState(false)
  const [customCpuLimit, setCustomCpuLimit] = useState("")
  const [serviceType, setServiceType] = useState("docker-compose")
  const [nodes, setNodes] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loadingProject, setLoadingProject] = useState(true)
  const [loadingNodes, setLoadingNodes] = useState(false)
  const projectId = searchParams.get("projectId")

  const fethcProjectData = async () => {
    if (!auth) return
    try {
      setLoadingProject(true)
      const data = await getOneProject(auth, projectId)
      setProjectData(data.data)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
    }
    setLoadingProject(false)
  }

  useEffect(() => {
    if (projectId) fethcProjectData()
  }, [auth, projectId]) // Added projectId to dependencies

  useEffect(() => {
    if (serviceId) {
      // Fetch existing service details
      const fetchServiceDetails = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/deployment/${serviceId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Assuming you have a token in auth
            },
          })
          const res = await response.json()
          const data = res.data.deployment
          setFormData({
            name: data.name,
            cluster: data.cluster,
            image: data.image_url,
            target_port: data.target_port,
            memoryLimit: data.mem_limit,
            cpuLimit: data.cpu_limit,
            node_id: data.node_id,
            registryCredential: data.registry_credential_id,
            env_variables: Object.keys(data.env_variables).map((key) => ({
              key,
              value: data.env_variables[key],
              isVisible: false,
            })),
          })
        } catch (error) {
          setError("Failed to fetch service details")
        }
      }

      fetchServiceDetails()
    }
  }, [serviceId])

  const fetchNodeData = async () => {
    if (!auth) return
    try {
      setIsNodeLoading(true)
      const data = await getAllProjectNodes(auth, projectId)
      setNodes(data.data.nodes)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
    }
    setIsNodeLoading(false)
  }

  useEffect(() => {
    fetchNodeData()
  }, [auth, projectId]) // Added projectId to dependencies

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        setIdRegistriesLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/registry/credential`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        if (response.ok) {
          const responseData = await response.json()
          setRegistries(responseData.data.credentials)
        } else {
          const errorData = await response.json()
          setError(errorData.message || "Failed to fetch registries")
        }
      } catch (err) {
        setError("An error occurred while fetching registries")
      } finally {
        setIdRegistriesLoading(false)
      }
    }

    fetchRegistries()
  }, [])

  const handleChange = (name: string, value: string) => {
    const finalValue = name === "node_id" ? Number.parseInt(value) : value
    setFormData((prev) => ({ ...prev, [name]: finalValue }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleEnvVariableChange = (index: number, field: "key" | "value", value: string) => {
    setFormData((prev) => {
      const newEnvVariables = [...prev.env_variables]
      newEnvVariables[index][field] = value
      return { ...prev, env_variables: newEnvVariables }
    })
  }

  const addEnvVariable = () => {
    setFormData((prev) => ({
      ...prev,
      env_variables: [...prev.env_variables, { key: "", value: "", isVisible: false }],
    }))
  }

  const removeEnvVariable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      env_variables: prev.env_variables.filter((_, i) => i !== index),
    }))
  }

  const handleCustomInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setter(value)
      }
    }

  const handleCustomMemoryLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setCustomMemoryLimit(value)
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.name.trim()) errors.name = "Service name is required"
    else if (formData.name.includes("_") || formData.name.includes(" ")) {
      errors.name = "Name cannot contain an underscore (_) or spaces."
    }
    if (!formData.image.trim()) errors.image = "Image is required"

    // New port validation
    if (!formData.target_port.trim()) errors.target_port = "Port is required"
    else {
      const port = Number.parseInt(formData.target_port)
      if (isNaN(port) || port < 0 || port > 65535) {
        errors.target_port = "Port must be a numeric value between 0-65,535"
      }
    }

    // New memory limit validation
    if (!formData.memoryLimit) errors.memoryLimit = "Memory limit is required"
    else if (formData.memoryLimit === "custom") {
      if (!customMemoryLimit.trim()) {
        errors.customMemoryLimit = "Custom memory limit is required"
      } else {
        const memoryValue = Number.parseInt(customMemoryLimit)
        if (isNaN(memoryValue) || memoryValue < 0 || memoryValue > 10000) {
          errors.customMemoryLimit = "Memory limit must be a numeric value between 0-10000"
        }
      }
    }

    // New CPU limit validation
    if (!formData.cpuLimit) errors.cpuLimit = "CPU limit is required"
    else if (formData.cpuLimit === "custom") {
      if (!customCpuLimit.trim()) {
        errors.customCpuLimit = "Custom CPU limit is required"
      } else {
        const cpuValue = Number.parseFloat(customCpuLimit)
        if (isNaN(cpuValue) || cpuValue < 0 || cpuValue > 1000) {
          errors.customCpuLimit = "CPU limit must be a numeric value between 0-1000"
        }
      }
    }

    if (serviceType === "docker-compose" && !formData.node_id) errors.node_id = "Node selection is required"
    if (serviceType === "kubernetes" && !formData.cluster) errors.cluster = "Cluster selection is required"

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    const memoryLimit = formData.memoryLimit === "custom" ? customMemoryLimit : formData.memoryLimit
    const memoryLimitRegex = /^\d+(m|g)$/

    if (!memoryLimitRegex.test(memoryLimit)) {
      setFieldErrors((prev) => ({ ...prev, memoryLimit: 'Memory limit must be an integer followed by "m" or "g"' }))
      setIsLoading(false)
      return
    }

    const deploymentData = {
      name: formData.name,
      image_url: formData.image,
      target_port: formData.target_port,
      mem_limit: memoryLimit,
      node_id: formData.node_id,
      cpu_limit: formData.cpuLimit === "custom" ? customCpuLimit : formData.cpuLimit,
      env_variables: {},
      replicas: 1,
    }

    function removeEmptyStringKeys(obj) {
      if (typeof obj !== "string") return {}
      return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== ""))
    }

    if (formData.registryCredential) {
      // @ts-expect-error build error
      deploymentData.registry_credential_id = Number(formData.registryCredential)
    }
    if (formData.env_variables) {
      const newob = removeEmptyStringKeys(formData.env_variables)
      deploymentData.env_variables = newob
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/v2/`, {
        method: serviceId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(deploymentData),
      })

      const data = await response.json()
      if (data.error === "false") {
        router.push(`/project/${projectId}?viewType=services`)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Something Went Wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      env_variables: prev.env_variables.map((variable, i) =>
        i === index ? { ...variable, isVisible: !variable.isVisible } : variable,
      ),
    }))
  }

  const handleAddNewCluster = () => {
    window.open("/create/cluster", "_ blank")
  }

  const handleAddNewNode = () => {
    window.open(`/create/node?projectId=${projectId}`, "_ blank")
  }

  const handleAddNewRegistry = () => {
    window.open("/create/registry", "_ blank")
  }

  const refreshRegistries = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/registry/credential`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        setRegistries(responseData.data.credentials)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to fetch registries")
      }
    } catch (err) {
      setError("An error occurred while fetching registries")
    } finally {
      setIsRefreshing(false)
    }
  }

  const refreshNodes = async () => {
    try {
      setLoadingNodes(true)
      await fetchNodeData()
    } catch (error) {
      console.error("Failed to fetch nodes:", error)
    } finally {
      setLoadingNodes(false)
    }
  }

  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case "azure":
        return azureIcon
      case "gcp":
        return gcpIcon
      case "aws":
        return awsIcon
      case "e2e":
        return e2eIcon
      default:
        return null
    }
  }

  // useEffect(() => {
  //   console.log("form", formData)
  // }, [formData])

  useEffect(() => {
    router.prefetch("/create/node")
    router.prefetch(`/project/${projectId}?viewType=services`)
  }, [router, projectId]) // Added projectId to dependencies

  return (
    <div className="bg-neutral-100  py-12 sm:px-6 lg:px-8  ">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full mt-4">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">
            {serviceId ? "Edit Service" : "Create New Service"}
          </h1>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 border  max-w-2xl md:mx-auto border-red-100  p-4 rounded-lg flex gap-2 items-center">
          <CircleAlert className="text-red-500  size-4 " />
          <div>{error}</div>
        </div>
      )}
      <form className="space-y-6 max-w-2xl md:mx-auto pb-6 pt-4 mx-4" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
            Project*
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

        <div className="">
          <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
            Service Name*
          </label>
          <div className="relative">
            <Input
              id="service-name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter service name"
              className={`max-w-full ${fieldErrors.name ? "border-red-500" : ""}`}
            />
            <div className="flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5">
              <Router size={18} />
            </div>
          </div>
          {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
        </div>

        {serviceType === "docker-compose" && (
          <div>
            <label htmlFor="node" className="pl-2 text-sm font-medium text-[#374151]">
              Select Node*
            </label>
            <div className="flex gap-2">
              <Select
                value={formData.node_id?.toString()}
                onValueChange={(value) => {
                  if (value === "create_node") {
                    handleAddNewNode()
                  } else {
                    handleChange("node_id", value)
                  }
                }}
              >
                <SelectTrigger className={fieldErrors.node_id ? "border-red-500" : ""}>
                  {isNodeLoading ? (
                    <div className="flex items-center">
                      <CircularProgress size={16} className="mr-2" />
                      Loading Nodes...
                    </div>
                  ) : (
                    <SelectValue placeholder="Select Node" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {nodes.length > 0 ? (
                    nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id.toString()} disabled={node.status !== "running"}>
                        <div className="flex gap-3 items-center">
                          {getProviderIcon(node.provider) && (
                            <Image
                              src={getProviderIcon(node.provider) || "/placeholder.svg"}
                              alt={node.provider}
                              width={40}
                              height={40}
                              className="w-6 h-6 object-contain"
                            />
                          )}{" "}
                          {node.name} {node.status !== "running" && <span className="capitalize">{node.status}</span>}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="create_node">No node Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleAddNewNode} className="flex-shrink-0">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add New Node</span>
              </Button>
              <Button type="button" variant="outline" onClick={refreshNodes} disabled={loadingNodes} className="p-2">
                <RefreshCw size={16} />
              </Button>
            </div>
            {fieldErrors.node_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.node_id}</p>}
          </div>
        )}

        {serviceType === "kubernetes" && (
          <div>
            <label htmlFor="cluster" className="pl-2 text-sm font-medium text-[#374151]">
              Select Cluster*
            </label>
            <div className="flex gap-2">
              <Select
                value={formData.cluster}
                onValueChange={(value) => {
                  if (value === "create_cluster") {
                    handleAddNewCluster()
                  } else {
                    handleChange("cluster", value)
                  }
                }}
              >
                <SelectTrigger className={fieldErrors.cluster ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a Cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-cluster">No cluster Available</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleAddNewCluster} className="flex-shrink-0">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add New Cluster</span>
              </Button>
            </div>
            {fieldErrors.cluster && <p className="text-red-500 text-sm mt-1">{fieldErrors.cluster}</p>}
          </div>
        )}

        <div>
          <label htmlFor="image" className="pl-2 text-sm font-medium text-[#374151]">
            Image*
          </label>
          <div className="relative">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="Enter image link"
              className={fieldErrors.image ? "border-red-500" : ""}
            />
            <div className="flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5">
              <GalleryVerticalEnd size={18} className="bg-muted" />
            </div>
          </div>
          {fieldErrors.image && <p className="text-red-500 text-sm mt-1">{fieldErrors.image}</p>}
        </div>

        <div className="">
          <label htmlFor="target_port" className="pl-2 text-sm font-medium text-[#374151]">
            Port*
          </label>
          <Input
            id="target_port"
            name="target_port"
            value={formData.target_port}
            onChange={(e) => {
              const value = e.target.value
              if (value === "" || /^\d+$/.test(value)) {
                handleChange("target_port", value)
              }
            }}
            placeholder="Enter port"
            className={fieldErrors.target_port ? "border-red-500" : ""}
          />
          {fieldErrors.target_port && <p className="text-red-500 text-sm mt-1">{fieldErrors.target_port}</p>}
        </div>

        <div className="">
          <label htmlFor="memory-limit" className="pl-2 text-sm font-medium text-[#374151]">
            Memory Limit (m/g)*
          </label>
          <Select
            value={formData.memoryLimit}
            onValueChange={(value) => {
              handleChange("memoryLimit", value)
            }}
          >
            <SelectTrigger className={fieldErrors.memoryLimit ? "border-red-500" : ""}>
              <SelectValue placeholder="Select memory limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="512m">512m</SelectItem>
              <SelectItem value="1g">1g</SelectItem>
              <SelectItem value="2g">2g</SelectItem>
              <SelectItem value="4g">4g</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formData.memoryLimit === "custom" && (
            <Input
              type="text"
              placeholder="Enter Custom Memory Limit (e.g., 128m, 1g)"
              value={customMemoryLimit}
              onChange={handleCustomMemoryLimitChange}
              className={`mt-2 ${fieldErrors.customMemoryLimit ? "border-red-500" : ""}`}
            />
          )}
          {fieldErrors.memoryLimit && <p className="text-red-500 text-sm mt-1">{fieldErrors.memoryLimit}</p>}
          {fieldErrors.customMemoryLimit && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.customMemoryLimit}</p>
          )}
        </div>

        <div className="">
          <label htmlFor="cpu-limit" className="pl-2 text-sm font-medium text-[#374151]">
            CPU Limit*
          </label>
          <Select
            value={formData.cpuLimit}
            onValueChange={(value) => {
              handleChange("cpuLimit", value)
            }}
          >
            <SelectTrigger className={fieldErrors.cpuLimit ? "border-red-500" : ""}>
              <SelectValue placeholder="Select CPU limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5 </SelectItem>
              <SelectItem value="1">1 </SelectItem>
              <SelectItem value="2">2 </SelectItem>
              <SelectItem value="4">4 </SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formData.cpuLimit === "custom" && (
            <Input
              type="text"
              placeholder="Enter Custom CPU Limit (e.g., 1, 2)"
              value={customCpuLimit}
              onChange={handleCustomInputChange(setCustomCpuLimit)}
              className={`mt-2 ${fieldErrors.customCpuLimit ? "border-red-500" : ""}`}
            />
          )}
          {fieldErrors.cpuLimit && <p className="text-red-500 text-sm mt-1">{fieldErrors.cpuLimit}</p>}
          {fieldErrors.customCpuLimit && <p className="text-red-500 text-sm mt-1">{fieldErrors.customCpuLimit}</p>}
        </div>

        <div className="">
          <label htmlFor="registry-credential" className="pl-2 text-sm font-medium text-[#374151]">
            Registry Credential
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={formData.registryCredential}
              onValueChange={(value) => {
                if (value === "add_new") {
                  handleAddNewRegistry()
                } else {
                  handleChange("registryCredential", value)
                }
              }}
              disabled={isRefreshing}
            >
              <SelectTrigger>
                {isRegistriesLoading ? (
                  <div className="flex items-center">
                    <CircularProgress size={16} className="mr-2" />
                    Loading Registries...
                  </div>
                ) : (
                  <SelectValue placeholder="Select registry" />
                )}
              </SelectTrigger>
              <SelectContent>
                {registries.length > 0 ? (
                  registries.map((registry) => (
                    <SelectItem key={registry.id} value={registry.id.toString()}>
                      {registry.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="create_node">No Registry Available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleAddNewRegistry} className="flex-shrink-0">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add New Node</span>
            </Button>
            <Button type="button" variant="outline" onClick={refreshRegistries} disabled={isRefreshing} className="p-2">
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="pl-2 text-sm font-medium text-[#374151]">Environment Variables</label>
          </div>
          <>
            {formData.env_variables.map((variable, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Key"
                  value={variable.key}
                  onChange={(e) => handleEnvVariableChange(index, "key", e.target.value)}
                />
                <Input
                  type={variable.isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => handleEnvVariableChange(index, "value", e.target.value)}
                />
                <Button type="button" variant="outline" onClick={() => toggleVisibility(index)} className="p-2">
                  {variable.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button type="button" variant="outline" onClick={() => removeEnvVariable(index)} className="p-2">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEnvVariable} className="mt-2">
              Add Variable
            </Button>
          </>
        </div>

        <div className="flex justify-end space-x-4 pt-4 max-w-2xl md:mx-auto">
          <Button variant="outline" className="text-[14px]" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#2563EB] text-[14px]">
            {isLoading ? "Creating..." : serviceId ? "Update Service" : "Deploy Service"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateService

