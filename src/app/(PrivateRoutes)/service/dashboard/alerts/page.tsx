"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"

interface Alert {
  id: string
  type: string
  threshold: string
}

const initialAlerts: Alert[] = [
  { id: "1", type: "CPU Usage", threshold: "Above 80%" },
  { id: "2", type: "Memory Usage", threshold: "Above 80%" },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [newAlertType, setNewAlertType] = useState("")
  const [newAlertThreshold, setNewAlertThreshold] = useState("")

  const addAlert = () => {
    if (newAlertType && newAlertThreshold) {
      setAlerts([...alerts, { id: Date.now().toString(), type: newAlertType, threshold: newAlertThreshold }])
      setNewAlertType("")
      setNewAlertThreshold("")
    }
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Alert</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-end">
          <div className="grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">Alert type</label>
              <Select onValueChange={setNewAlertType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPU Usage">CPU Usage</SelectItem>
                  <SelectItem value="Memory Usage">Memory Usage</SelectItem>
                  <SelectItem value="Disk Usage">Disk Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">Set Limit</label>
              <Select onValueChange={setNewAlertThreshold}>
                <SelectTrigger>
                  <SelectValue placeholder="Set Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Above 50%">Above 50%</SelectItem>
                  <SelectItem value="Above 80%">Above 80%</SelectItem>
                  <SelectItem value="Above 90%">Above 90%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-blue-600 mt-6 w-full lg:w-[120px] " onClick={addAlert}>
          <span className="">+</span>
          Create
        </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-lg py-2 px-6 bg-[#F9FAFB]">
                <div>
                  <h3 className="font-medium">{alert.type}</h3>
                  <p className="text-sm text-muted-foreground">{alert.threshold}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="size-4 text-red-500" />
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

