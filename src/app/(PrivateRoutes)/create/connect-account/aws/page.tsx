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
import { AWSAccountInstructions } from "@/components/awsdocs"
import { CircleAlert } from "lucide-react"

export default function CloudProviderForm() {
  const { auth } = useApp()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [access_key, setAccess_key] = useState("")
  const [secret_key, setSecret_key] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    access_key: false,
    secret_key: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check for empty fields
    const newFieldErrors = {
      name: name.trim() === "",
      access_key: access_key.trim() === "",
      secret_key: secret_key.trim() === "",
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
        provider: "aws",
        providerText: "Aws",
        credentials: {
          access_key: access_key,
          secret_key: secret_key,
        },
      }

      const res = await createCloudAccount(auth, apiData)
      if (res.error === "true") {
        setError(res.message)
      } else {
        console.log("Aws Networks account connected:", res)
        router.push("/dashboard/accounts")
      }
    } catch (error) {
      console.error("Error connecting account:", error)
      setError("Something Went Wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:p-6 bg-neutral-100 h-screen flex justify-center ">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full ">
        <div className="text-center mb-8">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Connect AWS Account</h1>
        </div>

        <Card className="border-none shadow-none">
          <CardContent>
            <div className="pt-4">
            {error && <div className="text-red-500 text-sm bg-red-50 border border-red-100  p-4 rounded-lg flex gap-2 items-center">
              <CircleAlert className='text-red-500  size-4 ' />
              <div>{error}</div>
              </div>}
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
                  <Label htmlFor="access_key">Access key</Label>
                  <ToggleableInput
                    id="access_key"
                    name="access_key"
                    placeholder="Enter Access key"
                    value={access_key}
                    onChange={(e) => {
                      setAccess_key(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, access_key: false }))
                    }}
                    className={fieldErrors.access_key ? " border border-red-500" : ""}
                  />
                  {fieldErrors.access_key && <p className="text-red-500 text-sm mt-1">Please enter an access key</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret_key">Secret Key</Label>
                  <ToggleableInput
                    id="secret_key"
                    name="secret_key"
                    placeholder="Enter Secret Key"
                    value={secret_key}
                    onChange={(e) => {
                      setSecret_key(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, secret_key: false }))
                    }}
                    className={fieldErrors.secret_key ? "border border-red-500" : ""}
                  />
                  {fieldErrors.secret_key && <p className="text-red-500 text-sm mt-1">Please enter a secret key</p>}
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
          <AWSAccountInstructions />
        </div>
      </div>
    </div>
  )
}

