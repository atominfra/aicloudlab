"use client"

import { useState, useEffect } from "react"
import { Copy, CircleAlert, Eye, EyeOff, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { CircularProgress } from "@mui/material"
import { getAllProjects, getOneProject } from "@/app/(PrivateRoutes)/api/projects/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type React from "react"

export default function ConnectNode() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")
  const { auth } = useApp()

  const [formData, setFormData] = useState({
    ipAddress: "",
    sshUsername: "",
    sshPort: "",
    password: "",
    projects_id: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState({
    ipAddress: "",
    sshUsername: "",
    sshPort: "",
    password: "",
    projects_id: "",
  })
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectData, setProjectData] = useState(null)
  const [loadingProject, setLoadingProject] = useState(false)
  const [sshKey, setSshKey] = useState(null)
  const [loadingSSHKey, setLoadingSSHKey] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth) return
      try {
        setLoadingProjects(true)
        const data = await getAllProjects(auth)
        setProjects(data.data.projects)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [auth])

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!auth || !projectId) return
      try {
        setLoadingProject(true)
        const data = await getOneProject(auth, projectId)
        setProjectData(data.data)
      } catch (error) {
        console.error("Failed to fetch project data:", error)
      } finally {
        setLoadingProject(false)
      }
    }
    fetchProjectData()
  }, [auth, projectId])

  useEffect(() => {
    const fetchSSHKey = async () => {
      setLoadingSSHKey(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cloud_connect/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        })
        console.log("response", response)
        const data = await response.json()
        if (data.error === "true") {
          // @ts-expect-error build
          setConnectError(response.message)
          return
        }
        if (!response.ok) {
          return
        }
        console.log("data", data)
        setSshKey(data?.data)
      } catch (error) {
        console.error("Error fetching SSH key:", error)
        setConnectError("Failed to fetch SSH key. Please try again.")
      } finally {
        setLoadingSSHKey(false)
      }
    }
    if (auth) 
      {
        fetchSSHKey()
      }
  }, [auth])

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
    setVerifyError(null)
  }

  const handleProjectChange = (value: string) => {
    const projects_id = projects.find((p) => p.name === value)?.id || ""
    setFormData((prev) => ({
      ...prev,
      projects_id: projects_id,
    }))
    setFieldErrors((prev) => ({ ...prev, projects_id: "" }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setVerifyError(null)

    // Validate all fields
    const newFieldErrors = {
      ipAddress: "",
      sshUsername: "",
      sshPort: "",
      password: "",
      projects_id: "",
    }

    if (formData.ipAddress.trim() === "") {
      newFieldErrors.ipAddress = "IP Address is required"
    }
    if (formData.sshUsername.trim() === "") {
      newFieldErrors.sshUsername = "SSH Username is required"
    }
    if (formData.sshPort.trim() === "") {
      newFieldErrors.sshPort = "SSH Port is required"
    }
    if (!projectId && !formData.projects_id) {
      newFieldErrors.projects_id = "Project selection is required"
    }

    setFieldErrors(newFieldErrors)

    // If any field has an error, stop submission
    if (Object.values(newFieldErrors).some((error) => error !== "")) {
      setIsLoading(false)
      return
    }

    try {
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cloud_connect/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({
          connection_id: String(sshKey?.id),
          ip: formData.ipAddress,
          ssh_user_name: formData.sshUsername,
          ssh_port: Number.parseInt(formData.sshPort),
          project_id: String(formData.projects_id) || String(projectId),
        }),
      })
      const verifyData = await verifyResponse.json()
      if (verifyData.error === "true") {
        setVerifyError(verifyData.message)
        return
      }
      if (!verifyResponse.ok) {
        return
      }
      console.log("Verification successful:", verifyData)

      router.push(`/project/${formData.projects_id || projectId}?viewType=nodes`)
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  useEffect(() => {
    console.log("sshKey", sshKey)
  }, [sshKey])
  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-xl font-semibold text-center">Connect Node</h1>

        {/* SSH Key Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {connectError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{connectError}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Public SSH Key</label>
            <p className="text-sm text-gray-500">Add this key to authorized_keys in your VM</p>
            {loadingSSHKey ? (
              <div className="flex items-center border bg-white p-2 rounded-md text-sm text-gray-500">
                <CircularProgress size={16} className="mr-2" />
                Loading SSH Key...
              </div>
            ) : (
              <div className="relative flex items-center">
                <Input value={sshKey?.public_key} readOnly className="bg-gray-50 pr-12 font-mono text-sm" />
                <div className="absolute right-0 h-full px-3 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100 h-8 w-8 p-0"
                    onClick={() => copyToClipboard(sshKey?.public_key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Connection Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-base font-medium mb-6">Connection Details</h2>

          {verifyError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{verifyError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {projectId ? (
              <div className="">
                <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
                  Project *
                </label>
                {!loadingProject ? (
                  <div className="relative">
                    <Input
                      autoComplete="new-password"
                      disabled={true}
                      id="service-name"
                      name="name"
                      value={projectData?.name || ""}
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
            ) : (
              <div className="space-y-2">
                <label htmlFor="project-id" className="pl-2 text-sm font-medium">
                  Select Project *
                </label>
                <div className="flex gap-2">
                  <Select
                    value={(projects && projects.find((p) => p.id === formData.projects_id)?.name) || ""}
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
                </div>
                {fieldErrors.projects_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.projects_id}</p>}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">IP Address*</label>
              <Input
                name="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => handleChange("ipAddress", e.target.value)}
                placeholder="Enter IP Address"
                className={fieldErrors.ipAddress ? "border-red-500" : ""}
              />
              {fieldErrors.ipAddress && <p className="text-sm text-red-500">{fieldErrors.ipAddress}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SSH Username*</label>
              <Input
                autoComplete="new-password"
                name="sshUsername"
                value={formData.sshUsername}
                onChange={(e) => handleChange("sshUsername", e.target.value)}
                placeholder="Enter username"
                className={fieldErrors.sshUsername ? "border-red-500" : ""}
              />
              {fieldErrors.sshUsername && <p className="text-sm text-red-500">{fieldErrors.sshUsername}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SSH Port*</label>
              <Input
                name="sshPort"
                value={formData.sshPort}
                onChange={(e) => handleChange("sshPort", e.target.value)}
                placeholder="Enter SSH Port"
                className={fieldErrors.sshPort ? "border-red-500" : ""}
              />
              {fieldErrors.sshPort && <p className="text-sm text-red-500">{fieldErrors.sshPort}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Super User Password (optional)</label>
              <div className="relative">
                <Input
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter Password"
                  className={`pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/project/${projectId || formData.projects_id}?viewType=nodes`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

