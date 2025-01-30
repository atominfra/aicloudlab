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
