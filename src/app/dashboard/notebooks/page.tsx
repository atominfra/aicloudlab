"use client"
import { Button } from "@/components/ui/button"
import { NotebookCard } from "@/components/notebook-card"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/global-context";
import CreditsModal from "@/components/modals/creditsModal";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import notebook from '@/assets/notebook.png'

export default function NotebooksPage() {
  const router = useRouter();
  const {notebooks, setNotebooks, user, fetchUserDetails, auth} = useGlobal();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCreateClick = () => {
    if (user?.credits < 1) {
      setShowModal(true);
    } else {
      router.push('/create');
    }
  };
  const fetchNotebooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`, 
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setNotebooks(responseData.data.notebooks); 
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
  const handleOperationRequest = async (notebookId, operationName) => {
    try {
      console.log("operationName in dashboard",operationName)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
        },
        body: JSON.stringify({
          notebook_id: notebookId,
          operation_name: operationName,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }
      if(operationName === 'delete') {
        setLoading(true)
        fetchNotebooks()
        fetchUserDetails()
      }
      const result = await response.json();
      console.log('Operation successful:', result);
    } catch (error) {
      setError(error?.message);
    }
    fetchNotebooks();
    fetchUserDetails()
  };



  useEffect(() => {
    fetchNotebooks();
    fetchUserDetails()
  }, []);

  return (
      <div className="p-6 bg-neutral-100 h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Notebooks</h1>
          <Button className="bg-blue-600"
            onClick={handleCreateClick}>
            <span className="mr-2">+</span>
            Create 
          </Button>
        </div>
        {notebooks.length === 0 ? <div>
          <Box className='flex flex-col gap-2 justify-center items-center h-[60vh] w-full bg-neutral-100'>
          <Image 
            src={notebook}
            width={1000}  
            height={1000}
            className=' w-[100px] h-[100px] text-neutral-100'
            alt="AI Cloud Lab Logo" />
        <Typography variant="body1" className="text-gray-400 mb-4 px-6">
          No notebooks yet.
        </Typography>
        </Box>
        </div>:
        <div className="">
          {notebooks.map((notebook) => (
            <NotebookCard key={notebook.id} {...notebook} onOperation={handleOperationRequest}
            />
          ))}
        </div>
        }
        <CreditsModal showModal={showModal} onClose={() => setShowModal(false)}/>

      </div>
  )
}

