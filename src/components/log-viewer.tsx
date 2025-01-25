"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, ChevronDown, Filter } from "lucide-react"
import Loader from "./loader"

interface LogViewerProps {
  containerName: string
}

export function LogViewer({ containerName }: LogViewerProps) {
  const [timeRange, setTimeRange] = React.useState("all-time")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  const handleExportLogs = () => {
    console.log("Export logs functionality to be implemented")
  }

  const getTimeRange = React.useCallback(() => {
    const now = Date.now()
    switch (timeRange) {
      case "last-hour":
        return `from=${now - 3600000}&to=${now}`
      case "last-day":
        return `from=${now - 86400000}&to=${now}`
      case "last-week":
        return `from=${now - 604800000}&to=${now}`
      default:
        return `from=${now - 86400000}&to=${now}` // Default to last 24 hours
    }
  }, [timeRange])

  const grafanaUrl = React.useMemo(() => {
    const baseUrl = "https://grafana.k3s.atominfra.com/d-solo/o6-BGgnnk/loki-kubernetes-logs"
    const timeRangeParam = getTimeRange()
    const queryParam = searchQuery ? `&var-query=${encodeURIComponent(searchQuery)}` : ""
    return `${baseUrl}?orgId=1&${timeRangeParam}&timezone=browser&var-namespace=$__all&var-stream=$__all&var-container=${containerName}&theme=dark&panelId=2${queryParam}`
  }, [containerName, getTimeRange, searchQuery])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true)
    setTimeRange(value)
  }

  React.useEffect(() => {
    setIsLoading(true)
  }, [timeRange]) //Corrected useEffect dependency

  return (
    <div className="space-y-4 rounded-lg border bg-white px-2 py-4 border-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex  flex-1 items-center justify-between gap-4 ">
          <div className="relative lg:max-w-2xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all-time"  onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="lg:w-[180px] w-[80px]">
              <SelectValue placeholder="Select time range">
                <span className="hidden sm:inline">
                  {timeRange === "all-time" && "All Time"}
                  {timeRange === "last-hour" && "Last Hour"}
                  {timeRange === "last-day" && "Last 24 Hours"}
                  {timeRange === "last-week" && "Last Week"}
                </span>
                <Filter className="sm:hidden h-4 w-4" />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="last-hour">Last Hour</SelectItem>
              <SelectItem value="last-day">Last 24 Hours</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-zinc-800 w-full sm:w-auto" onClick={handleExportLogs}>
          <Download className="size-4 mr-2" />
          <span>Export Logs</span>
        </Button>
      </div>
      <div
        className="relative rounded-md bg-zinc-950 overflow-hidden"
        style={{ height: "calc(100vh - 500px)", minHeight: "400px" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-50 z-10">
            <Loader />
          </div>
        )}
        <iframe
          src={grafanaUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Logs"
          className="absolute inset-0"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  )
}

