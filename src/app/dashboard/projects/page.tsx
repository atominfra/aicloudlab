'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from '@/components/withAuth'
import { ProjectCard } from "@/components/project-card"
import Image from "next/image"
import { Typography } from "@mui/material"
import { FolderOpen } from "lucide-react"
import Loader from "@/components/loader"
import { useApp } from "@/context/AppContext"
import { getAllProjects } from "@/app/api/projects/api"

interface Node {
  id: string
  projectName: string
  servicesRunning:number
}

interface Project {
  id: string
  projectName: string
  servicesRunning: number
}

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const {auth} = useApp()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const data = await getAllProjects(auth)
        setProjects(data.data.projects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Project {params.id}</h1>
        <Button onClick={()=> router.push('/create/project')} className="bg-blue-600">Create Project</Button>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {projects && projects.length>0 ? projects.map((project) => (
          // @ts-expect-error build error
          <ProjectCard key={project.id} {...project}/>
        )) : <>
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70dvh]  w-full">
              <FolderOpen className="w-[100px] h-[100px] text-neutral-200" />
              <Typography variant="body1" className="text-gray-400 mb-4 px-6">
                No notebooks yet.
              </Typography>
            </div>
        </>}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

