'use client'
import { NodeCard } from "@/components/node-card"
import { Button } from "@/components/ui/button"
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function NodesPage() {
  const [nodes, setNodes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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
        console.log("responseData.data.nodes",responseData.data.nodes)
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
  useEffect(()=>{
    fetchNodes()
  },[])
  useEffect(()=>{
    console.log("nodes",nodes)
  },[nodes])
  return (
      <div className="p-6 bg-neutral-100 h-screen  justify-center items-center">
        {/* <div className="text-neutral-200 font-extrabold font-sans text-7xl">Coming Soon</div> */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Nodes</h1>
          <Button className="bg-blue-600">
            <span className="mr-2">+</span>
            Create
          </Button>
        </div>
       {loading ? 
           <div className="flex flex-col justify-center items-center h-full w-full">
           <CircularProgress className="text-black" size={30}/> 
         </div>: 
        <div className="">
          {nodes.map((node) => (
            <NodeCard key={node.name} {...node} />
            // <ul >
            //   <li key={node.public_ip_address} className="text-black">{node.public_ip_address}</li>
            // </ul>  
          ))}
        </div>}
      </div>
  )
}



