'use client'

import { NodeCard } from "@/components/node-card"
import { Button } from "@/components/ui/button"
import { Box, CircularProgress, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import noNodesIcon from "@/assets/noNodesIcon.svg"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

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
  cloudName: string
  accountName: string
  nodes: Node[]
}

export default function NodesPage() {
  const [accountData, setAccountData] = useState<AccountData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { node_page_status } = useApp()

  const fetchNodes = async () => {
    try {
      // For now, we'll use the fake data
      const fakeAccountData: AccountData = {
        cloudName: "Azure",
        accountName: "John Doe",
        nodes: [
          {
            id: 1,
            name: "Node-A",
            memory: "16GB",
            vcpus: "4 vCPU",
            disk: "500GB",
            private_ip_address: "192.168.1.10",
            public_ip_address: "203.0.113.10",
            gpu: "NVIDIA Tesla V100",
            isDeleted: false,
            status: "running",
          },
          {
            id: 2,
            name: "Node-B",
            memory: "32GB",
            vcpus: "8 vCPU",
            disk: "1TB",
            private_ip_address: "192.168.1.11",
            public_ip_address: "203.0.113.11",
            gpu: "NVIDIA A100",
            isDeleted: false,
            status: "stopped",
          },
          {
            id: 3,
            name: "Node-C",
            memory: "64GB",
            vcpus: "16 vCPU",
            disk: "2TB",
            private_ip_address: "192.168.1.12",
            public_ip_address: "203.0.113.12",
            gpu: "NVIDIA RTX 3090",
            isDeleted: true,
            status: "error",
          },
        ]
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAccountData(fakeAccountData)
    } catch (err) {
      setError('An error occurred while fetching nodes')
    } finally {
      setLoading(false)
    }
  }

  // Function to check if there are active nodes
  const hasActiveNodes = () => {
    return accountData?.nodes.some((node) => !node.isDeleted) ?? false
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  // prefetch routes for faster navigation
  useEffect(() => {
    router.prefetch('/create/node')
  }, [router])

  return (
    <div className="p-4 bg-neutral-100 lg:h-screen h-[92dvh] justify-center items-center">
      <div className="flex items-center justify-between lg:mb-6 mb-5 h-[6vh]">
        <div>
          <h1 className="text-lg lg:text-2xl font-semibold">{accountData?.cloudName} - {accountData?.accountName}</h1>
        </div>
        <Button className="bg-blue-600" onClick={() => router.push("/create/node")} disabled={!node_page_status}>
          <span className="">+</span>
          Create
        </Button>
      </div>
      {node_page_status === false ? 
        <div className='flex justify-center items-center lg:h-[80vh] h-[70vh] w-full'>
          <div className="text-neutral-200 font-extrabold font-sans text-7xl">Coming Soon</div>   
        </div>
      :
        <>
          {loading ? (
            <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70vh] w-full">
              <CircularProgress className="text-black" size={30} /> 
            </div>
          ) : (
            <div className="flex flex-col items-center lg:h-[80vh] h-[70vh] w-full">
              {hasActiveNodes() ? (
                accountData?.nodes.map((node) => 
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
        </>
      }
    </div>
  )
}

