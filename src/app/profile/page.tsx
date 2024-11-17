'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { PiUserCircleFill } from "react-icons/pi";
import Navbar from '@/components/navbar';
import { useTheme } from 'next-themes';
import withAuth from '@/components/withAuth';
import { SiHuggingface } from 'react-icons/si';
import github from "@/assets/github.png"
import gdrive from "@/assets/googledrive.png"
import huggingface from "@/assets//huggingface.png"
import Image from 'next/image';
interface User {
  full_name: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  const { resolvedTheme } = useTheme();
  
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleLogout = ()=>{
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`;
    window.location.href = "/"
  }
  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <Navbar />
      <Box className="flex justify-center items-center gap-8 w-[90vw] h-[100vh]">
        <Box className="flex flex-col space-y-4 border rounded-[10px] border-[#cccccc] p-10  w-[40vw]">
        <Box className=' flex flex-col gap-6'>
        <Typography variant="h5" className="font-bold ">
            Profile Page
          </Typography>
            <>
            <Box className="flex  items-center w-full">
              <Typography className="text-sm text-black w-[40%] ">Full Name</Typography>
              <Typography className=' p-5 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.full_name}</Typography>
            </Box>
             <Box className="flex  items-center w-full">
              <Typography className="text-sm text-black w-[40%] ">Phone Number</Typography>
              <Typography className=' p-5 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.phone}</Typography>
            </Box>
            <Box className="flex  items-center w-full ">
              <Typography className="text-sm text-black w-[40%] ">E-mail Address</Typography>
              <Typography className=' p-5 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.phone}</Typography>
            </Box>
            </>
        </Box>
            <Box className="pt-4 w-full flex justify-end">
            <Button
              variant="contained"
              color="error"
              fullWidth
              className="bg-[#FF0000] text-white w-[150px] text-center rounded-[10px]"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
          <Box className='pt-10'>
          <Typography variant="h5" className="font-bold mb-10">
            Connected Accounts
          </Typography>
          <Box className="space-y-4">
            <Box className="flex items-center justify-between p-4 border rounded-[10px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={github}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Typography>GitHub</Typography>
              </Box>
              <Button variant="contained" disabled>
                Coming Soon
              </Button>
            </Box>
            <Box className="flex items-center justify-between p-4 border rounded-[10px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={gdrive}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Typography>Google Drive</Typography>
              </Box>
              <Button variant="contained" disabled>
                Coming Soon
              </Button>
            </Box>
            <Box className="flex items-center justify-between p-4 border rounded-[10px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={huggingface}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Typography>Hugging Face</Typography>
              </Box>
              <Button variant="contained" disabled>
                Coming Soon
              </Button>
            </Box>
          </Box>
        </Box>
          
        </Box>
      </Box>
    </Box>
  );
}


export default withAuth(ProfilePage)