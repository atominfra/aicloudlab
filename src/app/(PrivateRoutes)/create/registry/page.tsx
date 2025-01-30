"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

interface RegistryCredential {
  name: string
  url: string
  username: string
  password: string
}

export default function AddRegistryCredential() {
  const router = useRouter()
  const { auth } = useApp()
  const [formData, setFormData] = useState<RegistryCredential>({
    name: "",
    url: "",
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({
    name: "",
    url: "",
    username: "",
    password: "",
  })
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (backendError) {
      topRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [backendError])

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setBackendError(null)
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBackendError(null)
    setIsLoading(true)

    // Validate required fields
    const newFieldErrors: Record<string, string> = {}
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof RegistryCredential].trim()) {
        newFieldErrors[key] = `Please enter a ${key}`
      }
    })
    setFieldErrors(newFieldErrors)

    if (Object.keys(newFieldErrors).length > 0) {
      setIsLoading(false)
      return
    }

    const registryData = {
      name: formData.name,
      registry_url: formData.url,
      username: formData.username,
      password: formData.password,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/registry/credential`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(registryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create registry credential")
      }

      router.push("/dashboard/projects")
    } catch (error) {
      setBackendError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:p-6 bg-neutral-100 lg:h-screen h-[92dvh] overflow-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full mt-4">
        <div ref={topRef} className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Add Registry Credential</h1>
        </div>
        {backendError && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 p-4 rounded-lg flex gap-2 items-center mb-4">
            <CircleAlert className="text-red-500 size-4" />
            <div>{backendError}</div>
          </div>
        )}
        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          {(["name", "url", "username", "password"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <label htmlFor={field} className="text-sm font-medium text-[#374151]">
                {field.charAt(0).toUpperCase() + field.slice(1)}*
              </label>
              <Input
                id={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${field === "url" ? "registry URL" : field}`}
                className={`max-w-full ${fieldErrors[field] ? "border-red-500" : ""}`}
              />
              {fieldErrors[field] && <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>}
            </div>
          ))}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" className="text-[14px]" onClick={() => router.push("/dashboard/registries")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2563EB] text-[14px]">
              {isLoading ? "Saving..." : "Add Credential"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

