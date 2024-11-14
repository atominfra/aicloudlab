'use client'

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import withAuth from '@/components/withAuth';
import { useParams } from 'next/navigation';
import AnchorTemporaryDrawer from '@/components/notebook /hamburger';
import { SiJupyter } from 'react-icons/si';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';

const NotebookPage = () => {
  const { id } = useParams();  // Get notebook id from params
  const [notebook, setNotebook] = useState(null);

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
      <Box className="w-full h-[50px] bg-white flex items-center justify-between m-2">
        <Box className="flex gap-2 items-center pl-4"> 
          <SiJupyter  className='text-[#ff7c20]' size={40}/>
          <Box>
          <Typography className=' text-2xl text-black font-poppins '>{notebook?.name}</Typography>
            <div className='text-black flex gap-3 font-light font-poppins text-sm'>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Run</span>
            <span>kernel</span>
            <span>Settings</span>
            </div>
          </Box>
        </Box>
        <Box className="flex gap-8 items-center pr-6">
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
