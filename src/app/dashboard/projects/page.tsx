'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from '@/components/withAuth'
import { ProjectCard } from "@/components/project-card"

interface Node {
  id: string
  projectName: string
  servicesRunning:number
}

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to fetch nodes for this project
    const fetchProjects = async () => {
      setLoading(true)
      try {
        // In a real scenario, this would be an API call using the project ID
        const fakeNodes = [
          { id: '1', projectName: "Projects 1", servicesRunning:4 },
          { id: "2", projectName: "Projects 2", servicesRunning:1 },
          { id: '3', projectName: "Projects 3", servicesRunning:12 },
        ]
        setNodes(fakeNodes)
      } catch (error) {
        console.error("Error fetching nodes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [params.id])

  const handleCreateNode = () => {
    // In a real app, this would navigate to a node creation page or open a modal
    console.log("Create new node")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 bg-neutral-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project {params.id}</h1>
        <Button onClick={()=> router.push('/create/project')} className="bg-blue-600">Create Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {nodes.map((project) => (
          <ProjectCard key={project.id} {...project}/>
        ))}
      </div>
    </div>
  )
}

export default withAuth(ProjectPage)

