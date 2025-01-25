import { Button } from "@/components/ui/button"
import { Circle, X } from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  action: {
    label: string
    onClick: () => void
  }
  timestamp: string
  onDismiss?: () => void
}

interface AlertsSectionProps {
  alerts: Alert[]
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-white p-6 border-none">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <Button variant="link" className="text-black hover:text-gray-600 border hover:no-underline rounded-[5px]">
          View All
        </Button>
      </div>
      <div className="flex gap-5 flex-wrap">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border bg-white p-4 w-full lg:w-auto lg:min-w-96">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Circle className="mt-1 size-2 fill-red-500 text-red-500" />
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                {alert && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2" onClick={alert.onDismiss}>
                    <X className="size-4" />
                    <span className="sr-only">Dismiss alert</span>
                  </Button>
                )}
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

