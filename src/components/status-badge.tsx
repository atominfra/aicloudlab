import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "Running" | "Stopped" | "Error" | 'Creating'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("w-2 h-2 rounded-full", {
          "bg-green-500": status === "Running",
          "bg-gray-500": status === "Stopped",
          "bg-red-500": status === "Error",
          "bg-blue-500": status === "Creating",
        })}
      />
      <span
        className={cn("text-sm capitalize", {
          "text-green-600": status === "Running",
          "text-gray-600": status === "Stopped",
          "text-red-600": status === "Error",
          "bg-blue-600": status === "Creating",

        })}
      >
        {status}
      </span>
    </div>
  )
}

