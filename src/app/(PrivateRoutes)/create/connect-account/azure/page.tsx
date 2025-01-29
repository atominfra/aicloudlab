"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCloudAccount } from "@/app/(PrivateRoutes)/api/cloud/api"
import { useApp } from "@/context/AppContext"
import { ToggleableInput } from "@/components/ToggleableInput"
import { AzureAccountInstructions } from "@/components/azuredocs"

export default function AzurePage() {
  const { auth } = useApp()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [subscriptionId, setSubscriptionId] = useState("")

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    tenantId: false,
    clientId: false,
    clientSecret: false,
    subscriptionId: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check for empty fields
    const newFieldErrors = {
      name: name.trim() === "",
      tenantId: tenantId.trim() === "",
      clientId: clientId.trim() === "",
      clientSecret: clientSecret.trim() === "",
      subscriptionId: subscriptionId.trim() === "",
    }
    setFieldErrors(newFieldErrors)

    // If any field is empty, stop submission
    if (Object.values(newFieldErrors).some(Boolean)) {
      setIsLoading(false)
      return
    }

    try {
      const apiData = {
        name,
        provider: "azure",
        credentials: {
          tenant_id: tenantId,
          client_id: clientId,
          client_secret: clientSecret,
          subscription_id: subscriptionId,
        },
      }

      const res = await createCloudAccount(auth, apiData)
      if (res.error === "true") {
        setError(res.message)
      } else {
        console.log("Azure account connected:", res)
        router.push("/dashboard/accounts")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred while creating the cluster")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:p-6 bg-neutral-100 h-screen flex justify-center ">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Microsoft Azure</h1>
        </div>

        <Card className="border-none shadow-none">
          <CardContent>
            <div className="pt-4">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-100  p-4 rounded-lg">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, name: false }))
                    }}
                    className={fieldErrors.name ? "border-red-500" : ""}
                  />
                  {fieldErrors.name && <p className="text-red-500 text-sm mt-1">Please enter a name</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant_id">Tenant ID</Label>
                  <ToggleableInput
                    id="tenant_id"
                    name="tenant_id"
                    placeholder="Enter Tenant ID"
                    value={tenantId}
                    onChange={(e) => {
                      setTenantId(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, tenantId: false }))
                    }}
                    className={fieldErrors.tenantId ? "border-red-500" : ""}
                  />
                  {fieldErrors.tenantId && <p className="text-red-500 text-sm mt-1">Please enter a Tenant ID</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_id">Client ID</Label>
                  <ToggleableInput
                    id="client_id"
                    name="client_id"
                    placeholder="Enter Client ID"
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, clientId: false }))
                    }}
                    className={fieldErrors.clientId ? "border-red-500" : ""}
                  />
                  {fieldErrors.clientId && <p className="text-red-500 text-sm mt-1">Please enter a Client ID</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secret">Client Secret</Label>
                  <ToggleableInput
                    id="client_secret"
                    name="client_secret"
                    placeholder="Enter Client Secret"
                    value={clientSecret}
                    onChange={(e) => {
                      setClientSecret(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, clientSecret: false }))
                    }}
                    className={fieldErrors.clientSecret ? "border-red-500" : ""}
                  />
                  {fieldErrors.clientSecret && (
                    <p className="text-red-500 text-sm mt-1">Please enter a Client Secret</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscription_id">Subscription ID</Label>
                  <ToggleableInput
                    id="subscription_id"
                    name="subscription_id"
                    placeholder="Enter Subscription ID"
                    value={subscriptionId}
                    onChange={(e) => {
                      setSubscriptionId(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, subscriptionId: false }))
                    }}
                    className={fieldErrors.subscriptionId ? "border-red-500" : ""}
                  />
                  {fieldErrors.subscriptionId && (
                    <p className="text-red-500 text-sm mt-1">Please enter a Subscription ID</p>
                  )}
                </div>
                <div className="w-full text-end">
                  <Button type="submit" className="bg-[#2563EB]" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect Account"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
        <div className="py-4">
          <AzureAccountInstructions />
        </div>
      </div>
    </div>
  )
}

