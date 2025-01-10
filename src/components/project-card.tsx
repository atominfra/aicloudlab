"use client"
import { ExternalLink, Server, Cpu, MemoryStickIcon as Memory, Copy, MoreHorizontal, FolderInput, MoreVertical, ChevronRight, Settings, FolderOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  id: string
  projectName: string
  services: number
}

export function ProjectCard({ 
  id, 
  projectName, 
  services, 
}: ProjectCardProps) {
    const router = useRouter();
  const handleEdit = () => {
    router.push(`/create/service?id=${id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200  p-4 w-full hover:shadow-md transition-shadow duration-200" >
        <div className="flex flex-row items-center justify-between ">
          <div className=" w-full flex space-y-4 flex-row items-center space-x-4 hover:cursor-pointer" onClick={()=> router.push(`/project/${id}`)}>
            {/* Service Name with Icon */}
            <div className="flex items-center ">
              <div className=" p-2 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <FolderOpen className=" text-blue-600 "/>
              </div>
              <div className='w-full'>
               <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{projectName}</h3>
               </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2  :mt-0">
            <div 
              className="text-gray-600 p-2 hover:text-gray-900 hover:cursor-pointer w-full border-l border-none flex gap-2 items-center"
              onClick={()=> router.push(`/project/${id}/settings`)}
            >
              <Settings className="h-4 w-4 " />
                Manage
              </div>
          </div>
        </div>
    </div>
  )
}

