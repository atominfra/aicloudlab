"use client"

import type React from "react"
import { useState } from "react"
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
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    name: false,
    url: false,
    username: false,
    password: false,
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setFieldErrors((prev) => ({ ...prev, [name]: false }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validate required fields
    const newFieldErrors = {
      name: !formData.name.trim(),
      url: !formData.url.trim(),
      username: !formData.username.trim(),
      password: !formData.password.trim(),
    }
    setFieldErrors(newFieldErrors)

    if (Object.values(newFieldErrors).some(Boolean)) {
      setError("All fields are required")
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
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:p-6 bg-neutral-100 lg:h-screen h-[92dvh] overflow-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full mt-4">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Add Registry Credential</h1>
        </div>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100  p-4 rounded-lg">{error}</div>
        )}
        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#374151]">
              Name*
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter registry name"
              className={`max-w-full ${fieldErrors.name ? "border-red-500" : ""}`}
            />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">Please enter a name</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-[#374151]">
              Registry URL*
            </label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="Enter registry URL"
              className={`max-w-full ${fieldErrors.url ? "border-red-500" : ""}`}
            />
            {fieldErrors.url && <p className="text-red-500 text-sm mt-1">Please enter a registry URL</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-[#374151]">
              Username*
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
              className={`max-w-full ${fieldErrors.username ? "border-red-500" : ""}`}
            />
            {fieldErrors.username && <p className="text-red-500 text-sm mt-1">Please enter a username</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#374151]">
              Password*
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              className={`max-w-full ${fieldErrors.password ? "border-red-500" : ""}`}
            />
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">Please enter a password</p>}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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

