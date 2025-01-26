"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react"

interface EnvVar {
  id: string
  key: string
  value: string
}
const initialEnvVars: EnvVar[] = [
  {
    id: "1",
    key: "NEXT_PUBLIC_BACKEND_URL",
    value: "0bt4hDUZsPEFTsgaag0ghDsVpV9ESmetpmwnfNpy0X4e4FoeXz/"
  },
]
export default function EnvironmentPage() {
  const [envVars, setEnvVars] = useState<EnvVar[]>(initialEnvVars)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [showValue, setShowValue] = useState<Record<string, boolean>>({})

  const addEnvVar = () => {
    if (newKey && newValue) {
      setEnvVars([...envVars, { id: Date.now().toString(), key: newKey, value: newValue }])
      setNewKey("")
      setNewValue("")
    }
  }

  const deleteEnvVar = (id: string) => {
    setEnvVars(envVars.filter((env) => env.id !== id))
  }

  const toggleShowValue = (id: string) => {
    setShowValue((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Environment variables</CardTitle>
        </CardHeader>
        <CardContent className="flex  flex-col  items-end">
          <div className="grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key</label>
              <Input placeholder="Enter Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input placeholder="Enter Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            </div>
          </div>
          <Button className="bg-blue-600 w-[120px]  mt-6 " onClick={addEnvVar}>
          <span className="">+</span>
          Add 
        </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {envVars.map((envVar) => (
              <div key={envVar.id} className="flex  lg:items-center justify-between rounded-lg border p-4">
                <div className="grid grid-col-1 lg:grid-cols-2 gap-4 flex-1">
                  <h3 className="font-medium truncate">{envVar.key}</h3>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-muted-foreground flex-1 truncate max-w-[30vw]">
                      {showValue[envVar.id] ? envVar.value : "••••••••"}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => toggleShowValue(envVar.id)}>
                      {showValue[envVar.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteEnvVar(envVar.id)}>
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

