'use client'

import { NodeCard } from "@/components/node-card"
import { Button } from "@/components/ui/button"
import { Box, CircularProgress, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import noNodesIcon from "@/assets/noNodesIcon.svg"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { fetchNodesForAccount, fetchCloudAccount } from "@/app/api/cloud/api"
import loader from '@/assets/LoaderAtomInfra.gif';

interface Node {
  id: number
  name: string
  memory: string
  vcpus: string
  disk: string
  private_ip_address: string
  public_ip_address: string
  gpu: string
  isDeleted: boolean
  status: string
}

interface AccountData {
  name: string
  nodes: Node[]
  provider:string
}

export default function NodesPage({ params }: { params: { id: string } }) {
  const [accountData, setAccountData] = useState<AccountData>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useState<Node[]>([])

  const router = useRouter()
  const { auth } = useApp()
    console.log("id",params.id)

  
      useEffect(()=>{
        const fetchData = async () => {
          if (!auth ) return
          try {
            setLoading(true)
            const data = await fetchCloudAccount(auth, params?.id)
            setAccountData(data.data)
          } catch (error) {
            console.error('Failed to fetch initial data:', error)
          }
          setLoading(false)
        }
        fetchData()
      },[auth])

      const fetchNodes = async () => {
        try {
          setLoading(true)
          const data = await fetchNodesForAccount(auth, params?.id)
          setNodes(data.data.nodes)
        } catch (error) {
          console.error('Failed to fetch initial data:', error)
        }
        setLoading(false)
      }
      useEffect(()=>{
        if (auth ){
          fetchNodes()
        } 
      },[auth])

  // Function to check if there are active nodes
  const hasActiveNodes = () => {
    return nodes.some((node) => !node.isDeleted) ?? false
  }


  // prefetch routes for faster navigation
  useEffect(() => {
    router.prefetch('/create/node')
  }, [router])

  return (
    <div className="p-4 bg-neutral-100 lg:h-screen h-[92dvh] justify-center items-center">
      <div className="flex items-center justify-between lg:mb-6 mb-5 h-[6vh]">
        <div>
          {accountData && 
          <h1 className="text-lg lg:text-2xl font-semibold">{accountData?.name} ({accountData?.provider})</h1>
        }
        </div>
             
       
        <Button className="bg-blue-600" onClick={() => router.push("/create/node")} >
          <span className="">+</span>
          Create
        </Button>
      </div>
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#111827]">
         Nodes Running
        </h2>
      </div>
          {loading ? (
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70vh] w-full">
              <Image 
                src={loader} 
                alt="Loading..." 
                width={50} // Adjust width based on your design
                height={50} // Adjust height based on your design
                priority={true} // Ensures the loader is prioritized for loading
              />
            </div>
          ) : (
            <div className="flex flex-col items-center lg:h-[80vh] h-[70vh] w-full">
              {hasActiveNodes() ? (
                nodes?.map((node) => 
                  // @ts-expect-error build
                  !node.isDeleted && <NodeCard key={node.id} {...node} fetchNodes={fetchNodes} />
                )
              ) : (
                <Box className="flex flex-col gap-2 justify-center items-center lg:h-[80vh] h-[70dvh] w-full bg-neutral-100">
                  <Image
                    src={noNodesIcon}
                    width={1000}
                    height={1000}
                    className="w-[100px] h-[100px] text-neutral-100"
                    alt="AI Cloud Lab Logo"
                  />
                  <Typography variant="body1" className="text-gray-400 mb-4 px-6">
                    No nodes yet
                  </Typography>
                </Box>
              )}
            </div>
          )}
    </div>
  )
}

