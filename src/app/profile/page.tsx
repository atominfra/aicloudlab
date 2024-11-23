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
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
interface User {
  full_name: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(false)
  const [loadingRevokebttn, setLoadingRevokeBttn] = useState(false)
  const [hfUser, setHfUser] = useState<string | null>()
  const [error, setError] = useState({})
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const router = useRouter()

  const handleClick = async ()=>{
    setLoading(true)
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hf/connect`)
  }

  const handleLogout = ()=>{
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`;
    window.location.href = "/"
  }

  const fetchHfUser =  async ()=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hf/user `, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log('responseData',responseData)
      setHfUser(responseData.data.hf_username); 
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to fetch notebooks');
    } 

  }

  const revokeHfUser = async ()=>{
    setLoadingRevokeBttn(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hf/revoke `, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log('responseData',responseData)
      toast.success('Successfully logged out')
      setHfUser(null)
    } else {
      const errorData = await response.json();
      toast.error('Failed to logg out')
      setError(errorData.message || 'Failed to logg out');
    } 

  }

  useEffect(()=>{
    fetchHfUser()
  },[])
  return (
    <Box className="flex flex-col items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <Navbar />
      <Box className='w-full flex justify-center  p-4'>
      <Box className="flex flex-col space-y-4 border  rounded-[10px] w-[500px] border-[#cccccc] p-7  ">
        <Box className=' flex flex-col gap-3'>
        <Typography className="font-semibold text-[22px] ">
            My Profile 
          </Typography>
            <>
            <Box className="flex  items-center w-full h-[51px]">
              <Typography className="text-[16px] text-black w-[40%] ">Full Name</Typography>
              <Typography className=' p-3 text-[16px] bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.full_name}</Typography>
            </Box>
             <Box className="flex  items-center w-full h-[51px]">
              <Typography className="text-[16px] text-black w-[40%] ">Phone Number</Typography>
              <Typography className=' p-3 bg-white text-[16px] dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.phone}</Typography>
            </Box>
            <Box className="flex  items-center w-full h-[51px] ">
              <Typography className="text-[16px] text-black w-[40%] ">E-mail Address</Typography>
              <Typography className=' p-3 bg-white text-[16px] dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[60%]'>{user?.email}</Typography>
            </Box>
            </>
        </Box>
            <Box className="pt-2 w-full flex justify-end pr-4">
            <Button
              fullWidth
              className="bg-red-600 text-white font-semibold text-[15px] w-[121px] h-[39px] text-center rounded-[10px]"
              onClick={handleLogout}
              style={{ textTransform: 'none' }}
            >
              Log Out
            </Button>

          </Box>
          <Box className='pt-5'>
          <Typography  className=" mb-5 text-[22px] font-semibold">
            Connected Accounts
          </Typography>
          <Box className="space-y-4">
            <Box className="flex items-center justify-between p-3 border rounded-[10px] h-[70px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={github}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Typography className='text-[16px]'>GitHub</Typography>
              </Box>
              <Button  className='h-[39px] font-semibold text-white text-[15px] bg-[rgba(17,24,39,0.32)] rounded-[10px]' 
                style={{ textTransform: 'none' }}
              >
                Coming Soon
              </Button>
            </Box>
            <Box className="flex items-center justify-between  p-3 border rounded-[10px] h-[70px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={gdrive}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Typography className='text-[16px]'>Google Drive</Typography>
              </Box>
              <Button  className='h-[39px] font-semibold text-white text-[15px] bg-[rgba(17,24,39,0.32)] rounded-[10px]'
                style={{ textTransform: 'none' }}
              >
                Coming Soon
              </Button>
            </Box>
            <Box className="flex items-center justify-between p-3 border rounded-[10px] h-[70px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={huggingface}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Box>
                <Typography className='text-[16px]'>Hugging Face</Typography>
                {hfUser && <Typography className="text-[12px] text-[rgb(17,24,39,0.6)]">{String(hfUser)}</Typography>}
                </Box>
              </Box>
              {hfUser?
                <button
                disabled={loadingRevokebttn}
                className={`h-[39px] w-[93px] font-semibold text-black text-[15px] ${loadingRevokebttn?'bg-[#e3e3e3]':'bg-white border-[2px] border-[rgb(17,24,39,0.8)]'}  rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={revokeHfUser}
                >
                Remove
              </button>
              :<>
                <Button
                disabled={loading}
                className={`h-[39px] w-[93px] font-semibold text-white text-[15px] ${loading ?`bg-[#e3e3e3]`:`bg-[#1976D2]`} rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleClick}
                >
                Connect
              </Button>
                </>}
            </Box>
          </Box>
        </Box>
        </Box>
        </Box> 
        <Toaster position="top-center" reverseOrder={false} />
      </Box>

  );
}


export default withAuth(ProfilePage)