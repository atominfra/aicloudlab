'use client'

import { useEffect, useState } from 'react';
import { Box, Button, Popper, Typography } from '@mui/material';
import withAuth from '@/components/withAuth';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineSync } from "react-icons/ai";
import { FaRocket } from "react-icons/fa6";
import { PiUserCircleFill } from 'react-icons/pi';
import rackCorp from "@/assets/rackCorp.png"
import Loader from "@/components/loader"; // Import your loader
import deploy from "@/assets/deploy.png";
import { FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";

import { IoIosArrowBack } from "react-icons/io";
import NoteBookLoader from '@/components/notebook/notebookLoader';
type Notebook = {
  id: number;
  name: string;
  notebook_url: string;
};

const NotebookPage = () => {
  const { id } = useParams();  
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popperId = open ? 'simple-popper' : undefined;
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

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

  const handleIframeLoad = () => {
    setIsLoading(false); // Hide loader once the iframe finishes loading
  };

  return (
    <div className="flex flex-col h-screen">
      <Box className="w-full bg-white flex items-center justify-between px-10   py-4 shadow-lg z-[10]">
        <Box className="flex items-end"> 
          <Link className="flex items-center" href={`/dashboard`}>
            <Image 
              src='https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'
              width={1000}  
              height={1000}
              className=' w-[63px] h-[38px] '
              alt="AI Cloud Lab Logo" 
            />
          </Link>          
          <Box>
            <Typography className='pl-4 text-2xl text-black'>
              {notebook?.name}
            </Typography>
          </Box>
        </Box>
        <Box className="flex gap-8 items-center">
          <button
            className={`bg-white hover:bg-[#1976D2] h-[38px]  hover:text-white text-black shadow-none text-[16px] font-semibold rounded-[10px] border px-4 py-1 border-gray-300 flex gap-2 items-center justify-center`}
            onClick={() => toast.success('Coming Soon',{position: 'bottom-right'})}
            style={{ textTransform: 'none' }}
          >
            <AiOutlineSync />
            Sync
          </button>
          <button
            className={`bg-white   text-black shadow-none text-[16px] font-semibold rounded-[10px] ${open ? "border border-black":"border border-gray-300 hover:bg-[#1976D2] hover:text-white"} px-4 py-1 h-[38px]   flex gap-2 items-center justify-center `}
            onClick={() => toast.success('Coming Soon',{position: 'bottom-right'})}
            style={{ textTransform: 'none' }}
          >
            <FaRocket className='pt-[2px]' />
            Deploy
          </button>
          <button
            className={` bg-[#1976D2] h-[38px] w-[142px] text-white  shadow-none text-[16px] font-semibold rounded-[10px] border px-2 py-1 border-gray-300 flex gap-2 items-center justify-center ml-6`}
            onClick={()=> router.push('/dashboard')}
            style={{ textTransform: 'none' }}
          >
            <IoIosArrowBack />
            Dashboard
          </button>
        </Box>
      </Box>
      <Box className="w-full h-full relative">
        {isLoading && (
          <Box className="absolute inset-0 flex items-center justify-center bg-white">
            <NoteBookLoader />         
          </Box>
        )}
        {notebook?.notebook_url && (
          <iframe
            src={notebook?.notebook_url}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
            title="Notebook"
            onLoad={handleIframeLoad} 
          />
        )}
      </Box>
      <Popper id={popperId} open={open} anchorEl={anchorEl} placement='bottom-end'>
        <Box className='border p-4 flex flex-col gap-6 bg-white text-black mt-2 rounded-[10px]'>
          <Box className="flex justify-between gap-2 items-center">
          <Image alt='RackCorp' src={rackCorp} width={63} height={15.27}/> 
          <Typography className='  w-[204px] bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px]  h-[37px] flex '>
          <div className='p-2 w-[80%] overflow-clip'>link</div>
          <div className='border-l w-[20%] hover:cursor-pointer p-2 flex justify-center items-center hover:bg-gray-200 rounded-l-none rounded-[10px]'>
            <FiExternalLink/>
          </div>
            </Typography>

          </Box>
          <Box className='hover:cursor-pointer'>Redeploy Server</Box>
          <Box className='hover:cursor-pointer'>Stop Server</Box>
        </Box>
      </Popper>
    </div>
  );
};

export default withAuth(NotebookPage);
