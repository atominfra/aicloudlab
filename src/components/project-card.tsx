"use client"

import { FolderOpen, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

interface ProjectCardProps {
  id: string
  name: string
  services: number
}

export function ProjectCard({ id, name, services }: ProjectCardProps) {
  const router = useRouter()
  const { setIsloading } = useApp()

  const handleClick = async () => {
    try {
      setIsloading(true)
      await router.push(`/project/${id}?viewType=services`)
    } catch (error) {
      console.error("Error navigating to project:", error)
    } finally {
      setIsloading(false)
    }
  }

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/project/${id}/settings`)
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 w-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FolderOpen className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">{name}</h3>
        </div>
        <div
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 border-l border-none"
          onClick={handleManageClick}
        >
          <Settings className="h-4 w-4" />
          <span className="hidden lg:block">Manage</span>
        </div>
      </div>
    </div>
  )
}

