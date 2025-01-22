import { Button } from "@/components/ui/button"
import { Circle } from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  action: {
    label: string
    onClick: () => void
  }
  timestamp: string
}

interface AlertsSectionProps {
  alerts: Alert[]
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <Button variant="link" className="text-blue-500 hover:text-blue-600">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border bg-white p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="mt-1 size-2 fill-red-500 text-red-500" />
                <div className="space-y-1">
                  <p className="font-medium leading-none">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600" onClick={alert.action.onClick}>
                {alert.action.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

