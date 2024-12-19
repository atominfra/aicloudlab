import { cn } from "@/lib/utils"


export function StatusBadge({ status }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("w-2 h-2 rounded-full", {
          "bg-green-500": status === "running",
          "bg-gray-500": status === "stopped",
          "bg-red-500": status === "error",
          "bg-blue-500": status === "creating",
        })}
      />
      <span
        className={cn("text-sm capitalize", {
          "text-green-600": status === "running",
          "text-gray-600": status === "stopped",
          "text-red-600": status === "error",
          "text-blue-600": status === "creating",
        })}
      >
        {status}
      </span>
    </div>
  )
}

