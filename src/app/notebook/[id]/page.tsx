'use client'

import { useEffect, useState } from 'react';
import { Box,Button, Typography } from '@mui/material';
import withAuth from '@/components/withAuth';
import { useParams } from 'next/navigation';
import AnchorTemporaryDrawer from '@/components/notebook /hamburger';
import { SiJupyter } from 'react-icons/si';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';
import CustomButton from '@/components/ui/button';
import Image from 'next/image';
import { AiOutlineSync } from "react-icons/ai";
import { FaRocket } from "react-icons/fa6";

import deploy from "@/assets/deploy.png"
type Notebook = {
  id: number;
  name: string;
  notebook_url: string;
};

const NotebookPage = () => {
  const { id } = useParams();  
  const [notebook, setNotebook] = useState<Notebook | null>(null);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          });
        if (response.ok) {
          const data = await response.json();
          console.log("data",data.data.notebook.notebook_url)
          setNotebook(data.data.notebook);  
        } else {
          console.error('Failed to fetch notebook data');
        }
      } catch (error) {
        console.error('Error fetching notebook:', error);
      }
    };

    fetchNotebook();
  }, [id]);

  useEffect(()=>{
    console.log("id",id)
    console.log("notebook",notebook)
  })
  return (
    <div className="flex flex-col h-screen">
      <Box className="w-full bg-white flex items-center justify-between p-2">
        <Box className="flex  items-center px-4"> 
        <Link className=" flex items-center" href={`/dashboard`}>
          <Image 
          src= 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'
          width={1000}  
          height={1000}
          className=' w-20 h-12 '
          alt="AI Cloud Lab Logo" />
      </Link>          <Box>
          <Typography className=' text-2xl text-black font-poppins '>{notebook?.name}</Typography>
          </Box>
        </Box>
        <Box className="flex gap-8 items-center ">
        <button
      className={` bg-white hover:bg-[#1976D2] hover:text-white text-black shadow-none  text-[15px] font-semibold font-poppins  rounded-[10px] border px-2 py-1 border-gray-300  flex gap-1 items-center`}
      onClick={()=>{}}
      style={{ textTransform: 'none' }}
    >
      <AiOutlineSync />
    Sync
    </button>
        <button
      // variant="contained"
      className={` bg-white hover:bg-[#1976D2] hover:text-white text-black shadow-none  text-[15px] font-semibold font-poppins  rounded-[10px] border px-2 py-1 border-gray-300 flex gap-1 items-center`}
      onClick={()=>{}}
      style={{ textTransform: 'none' }}
    >
      <FaRocket/>
      Deploy
    </button>
      <Link href={'/profile'}>
      <PiUserCircleFill size={45} className='text-black' />
      </Link>
      </Box>
        {/* <AnchorTemporaryDrawer /> */}
      </Box>
      <Box className="w-full h-full">
        {notebook?.notebook_url && (
          <iframe
            src={notebook?.notebook_url}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
            title="Notebook"
          />
        )}
      </Box>
    </div>
  );
}

export default withAuth(NotebookPage);
