'use client'
import { NodeCard } from "@/components/node-card"
import { Button } from "@/components/ui/button"
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import noNodesIcon from "@/assets/noNodesIcon.svg"
import Image from "next/image";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
export default function NodesPage() {
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const fetchNodes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/e2e/node`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData.data.nodes", responseData.data.nodes);
        setNodes(responseData.data.nodes); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch notebooks');
      }
    } catch (err) {
      setError('An error occurred while fetching notebooks');
    } finally {
      setLoading(false);
    }
  };

  // Function to check if there are active nodes
  const hasActiveNodes = () => {
    return nodes.some((node) => node.isDeleted === false);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

    // prefetch routes for faster navigation
    useEffect(() => {
      router.prefetch('/create/node');
    }, [router]);

  return (
    <div className="p-4 lg:p-6 bg-neutral-100 lg:h-screen h-[92vh]  justify-center items-center">
      <div className="flex items-center justify-between lg:mb-6 mb-5 h-[6vh]">
        <h1 className="text-lg lg:text-2xl font-semibold">Nodes</h1>
        <Button className="bg-blue-600" onClick={()=> router.push("/create/node")}>
          <span className="">+</span>
          Create
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center lg:h-[80vh] h-[70vh] w-full">
          <CircularProgress className="text-black" size={30} /> 
        </div>
      ) : (
        <div className="flex flex-col  items-center lg:h-[80vh] h-[70vh] w-full">
          {hasActiveNodes() ? (
            nodes.map((node) => 
              node.isDeleted === false && <NodeCard key={node.name} {...node} fetchNodes={fetchNodes} />
            )
          ) : (
            <Box className="flex flex-col gap-2 justify-center items-center lg:h-[80vh] h-[70vh] w-full bg-neutral-100">
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
  );
}
