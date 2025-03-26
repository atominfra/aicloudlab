"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, MoreVertical, Trash2, Server, ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { deleteCluster, fetchPrivateKey } from "@/app/(PrivateRoutes)/api/cluster/api"
// import { toast } from "sonner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RedeployModal from "./modals/redeploy-modal"
import { DeleteModal } from "./delete-modal"

interface ClusterNode {
  id: number
  name: string
  role: "master" | "slave"
  memory: string
  vcpus: string
  disk: string
  publicIp: string
  public_ip: string
}

interface ClusterCardProps {
  cluster_id: number
  cluster_name: string
  cluster_type: string
  status: string
  nodes: ClusterNode[]
  fetchClusters: () => void
  projectId: string
}

export function ClusterCard({ cluster_id, cluster_name, cluster_type, status, nodes = [], fetchClusters, projectId }: ClusterCardProps) {
  const router = useRouter()
  const { auth } = useApp()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDelete = async () => {
    if (!auth) return
    try {
      
      setIsDeleting(true)
      await deleteCluster(auth, String(cluster_id))
      console.log("Cluster deleted successfully")
      fetchClusters()
    } catch (error) {
      console.error("Failed to delete cluster:", error)
      console.log("Failed to delete cluster")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }
  const handleDownloadPrivateKey = async () => {
    setIsRefreshing(true)
    try {
      const blob = await fetchPrivateKey(auth, cluster_id)
  
      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "private_key.pem" // Set file name
      document.body.appendChild(a)
      a.click()
      a.remove()
      
      // Cleanup the object URL
      window.URL.revokeObjectURL(url)
  
    } catch (error) {
      console.error("Something went wrong:", error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  

    const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "running":
        return "bg-green-500"
      case "inactive":
      case "pending":
        return "bg-yellow-500"
      case "error":
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full border border-gray-200 hover:border-gray-300 transition-all duration-200">
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{cluster_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {/* <div className={`h-2 w-2 rounded-full ${getStatusColor(status || '')}`} /> */}
                  <span className="text-sm text-gray-500 capitalize">{status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {cluster_type === "oncloud"?"On Cloud":"On Prem"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {nodes.length} {nodes.length === 1 ? "Node" : "Nodes"}
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadPrivateKey}>
                    Download Private Key
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CollapsibleContent className="mt-4">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[180px]">Node Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Disk</TableHead>
                    <TableHead>Public IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.length > 0 ? (
                    nodes.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-500" />
                            {node.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={node.role === "master" ? "default" : "outline"} className="capitalize">
                            {node.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{node.vcpus}</TableCell>
                        <TableCell>{node.memory}</TableCell>
                        <TableCell>{node.disk}</TableCell>
                        <TableCell className="font-mono text-xs">{node.public_ip}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No nodes in this cluster
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the cluster &quot;{cluster_name}&quot; and all its nodes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <DeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        name={cluster_name || ''}
        isLoading={isDeleting}
        type="cluster"
      />
    </Card>
  )
}

