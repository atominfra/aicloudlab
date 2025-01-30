"use client"

import type React from "react"
import { useState } from "react"
import { FolderOpen, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { createProject } from "@/app/(PrivateRoutes)/api/projects/api"
import { useApp } from "@/context/AppContext"

export default function CreateProject() {
  const router = useRouter()
  const { auth } = useApp()
  const [formData, setFormData] = useState({
    projectName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState({
    projectName: "",
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
    setBackendError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBackendError(null)
    setIsLoading(true)

    // Validate project name
    const newFieldErrors = { projectName: "" }
    if (formData.projectName.trim() === "") {
      newFieldErrors.projectName = "Please enter a project name"
    } else if (formData.projectName.includes("_") || formData.projectName.includes(" ")) {
      newFieldErrors.projectName = "Name cannot contain an underscore (_) or spaces."
    }

    setFieldErrors(newFieldErrors)

    // If any field has an error, stop submission
    if (Object.values(newFieldErrors).some((error) => error !== "")) {
      setIsLoading(false)
      return
    }

    let userId: string | null = null
    try {
      const userDataString = localStorage.getItem("user")
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        userId = userData.id
      }

      if (!userId) {
        throw new Error("User ID not found")
      }
    } catch (err) {
      setBackendError("Failed to retrieve user information. Please log in again.")
      setIsLoading(false)
      return
    }

    const payload = {
      name: formData.projectName,
    }

    try {
      const response = await createProject(auth, payload)
      if (response.error === "true") {
        setBackendError(response.message)
      } else {
        console.log("Project created successfully:", response)
        router.push("/dashboard/projects")
      }
    } catch (err) {
      console.error("Failed to create Project:", err)
      setBackendError("Something Went Wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:p-6 bg-neutral-100 lg:h-screen flex justify-center h-[92dvh]">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Create New Project</h1>
        </div>
        {backendError && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 p-4 rounded-lg flex gap-2 items-center mb-4">
            <CircleAlert className="text-red-500 size-4" />
            <div>{backendError}</div>
          </div>
        )}

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium text-[#374151]">
              Project Name*
            </label>
            <div className="relative">
              <Input
                id="project-name"
                name="projectName"
                value={formData.projectName}
                onChange={(e) => handleChange("projectName", e.target.value)}
                placeholder="Enter project name"
                className={fieldErrors.projectName ? "border-red-500" : ""}
              />
              <div className="flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5">
                <FolderOpen className="text-muted-foreground h-[15px] w-[15px]" />
              </div>
            </div>
            {fieldErrors.projectName && <p className="text-red-500 text-sm mt-1">{fieldErrors.projectName}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" className="text-[14px]" onClick={() => router.push("/dashboard/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2563EB] text-[14px]">
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

