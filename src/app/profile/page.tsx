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
import Loader from '@/components/loader';
interface User {
  full_name: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  
  const [user, setUser] = useState<User | null>(null); 
  const [isfetchHfUserLoading, setIsfetchHfUserLoading] = useState(false)
  const [isfetchGhUserLoading, setIsfetchGhUserLoading] = useState(false)
  const [isfetchGdUserLoading, setIsfetchGdUserLoading] = useState(false)
  const [isloading, setIsloading] = useState(true)
  const [isloadingHfRevokebttn, setIsLoadingHfRevokeBttn] = useState(false)
  const [isloadingGhRevokebttn, setIsLoadingGhRevokeBttn] = useState(false)
  const [isloadingGdRevokebttn, setIsLoadingGdRevokeBttn] = useState(false)
  const [userDetails, setUserDetails] = useState<string | null>('')
  const [error, setError] = useState({})
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const router = useRouter()
  
  const handleHfConnect = async ()=>{
    setIsfetchHfUserLoading(true)
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hf/connect`)
  }
  const handleGhConnect = async ()=>{
    setIsfetchGhUserLoading(true)
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gh/connect`)
  }
  const handleGdConnect = async ()=>{
    setIsfetchGdUserLoading(true)
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/google/connect`)
  }

  const handleLogout = ()=>{
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`;
    window.location.href = "/"
  }

  const fetchUser = async () => {
    setIsloading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse the error body if possible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch Hugging Face user');
      }
  
      const responseData = await response.json();
      console.log('responseData', responseData);
      setUserDetails(responseData.data);
    } catch (error) {
      // Handle error of type `unknown`
      if (error instanceof Error) {
        console.error('Error fetching Hugging Face user:', error.message);
        toast.error(error.message);
      } else {
        console.error('Unknown error occurred:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsloading(false);
    }
  };
  
  const revokeHfUser = async () => {
    setIsLoadingHfRevokeBttn(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hf/revoke`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse the error body if possible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke Hugging Face user');
      }
  
      const responseData = await response.json();
      console.log('responseData', responseData);
    } catch (error) {
      // Handle error of type `unknown`
      if (error instanceof Error) {
        console.error('Error revoking Hugging Face user:', error.message);
        toast.error(error.message);
      } else {
        console.error('Unknown error occurred:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoadingHfRevokeBttn(false);
      fetchUser()
    }
  };

  const revokeGhUser = async () => {
    setIsLoadingGhRevokeBttn(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gh/revoke`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse the error body if possible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke Hugging Face user');
      }
  
      const responseData = await response.json();
      console.log('responseData', responseData);
    } catch (error) {
      // Handle error of type `unknown`
      if (error instanceof Error) {
        console.error('Error revoking Hugging Face user:', error.message);
        toast.error(error.message);
      } else {
        console.error('Unknown error occurred:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoadingGhRevokeBttn(false);
      fetchUser()
    }
  };

  const revokeGdUser = async () => {
    setIsLoadingGdRevokeBttn(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gopgle/revoke`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse the error body if possible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke Google user');
      }
  
      const responseData = await response.json();
      console.log('responseData', responseData);
    } catch (error) {
      // Handle error of type `unknown`
      if (error instanceof Error) {
        console.error('Error revoking Google user:', error.message);
        toast.error(error.message);
      } else {
        console.error('Unknown error occurred:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoadingGdRevokeBttn(false);
      fetchUser()
    }
  };
  

  useEffect(()=>{
    fetchUser()
  },[])
  return (
    <Box className="flex flex-col items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <div className="w-full z-[10] fixed  top-0 ">
      <Navbar />
      </div>

      {isloading ? 
      <>
        <Loader/>
      </>
      : 
      <Box className='w-full flex justify-center p-4 mt-[80px]'>
      <Box className="flex flex-col space-y-4 lg:border  rounded-[10px] w-[500px] lg:border-[#cccccc] p-7  ">
        <Box className=' flex flex-col gap-3'>
        <Typography className="font-semibold text-[22px] ">
            My Profile 
          </Typography>
            <>
            <Box className="flex  items-center w-full h-[51px]">
              <Typography className="text-[16px] text-black w-[40%] hidden lg:block ">Full Name</Typography>
              <Typography className=' p-3 text-[16px] bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[80vw] lg:w-[60%] overflow-clip'>{user?.full_name}</Typography>
            </Box>
             <Box className="flex  items-center w-full h-[51px]">
              <Typography className="text-[16px] text-black w-[40%] hidden lg:block">Phone Number</Typography>
              <Typography className=' p-3 bg-white text-[16px] dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[80vw] lg:w-[60%] overflow-clip'>{user?.phone}</Typography>
            </Box>
            <Box className="flex  items-center w-full h-[51px] ">
              <Typography className="text-[16px] text-black w-[40%] hidden lg:block ">E-mail Address</Typography>
              <Typography className=' p-3 bg-white text-[16px] dark:bg-gray-800 text-[#111827] dark:text-white border border-[#cccccc] rounded-[10px] w-[80vw] lg:w-[60%] overflow-clip'>{user?.email}</Typography>
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
                <Box>
                <Typography className='text-[16px]'>GitHub</Typography>
              {/* @ts-expect-error  error*/}
                {userDetails?.gh_username && <Typography className="text-[12px] text-[rgb(17,24,39,0.6)]">{String(userDetails?.gh_username)}</Typography>}
                </Box>
              </Box>
              {/* @ts-expect-error  error*/}
              {userDetails?.gh_username?
                <button
                disabled={isloadingGhRevokebttn}
                className={`h-[39px]  w-[121px] font-semibold text-black text-[15px] ${isloadingGhRevokebttn?'bg-[rgba(17,24,39,0.32)]':'bg-white border-[2px] border-[rgb(17,24,39,0.8)]'}  rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={revokeGhUser}
                >
                Remove
              </button>
              :<>
                <Button
                disabled={isfetchGhUserLoading}
                className={`h-[39px]  w-[121px] font-semibold text-white text-[15px] ${isfetchGhUserLoading ?`bg-[rgba(17,24,39,0.32)]`:`bg-[#1976D2]`} rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleGhConnect}
                >
                Connect
              </Button>
                </>}
              
            </Box>
            <Box className="flex items-center justify-between  p-3 border rounded-[10px] h-[70px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={gdrive}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Box>
                <Typography className='text-[16px]'>Google Drive</Typography>
              {/* @ts-expect-error  error*/}
                {userDetails?.google_username && <Typography className="text-[12px] text-[rgb(17,24,39,0.6)]">{String(userDetails?.google_username)}</Typography>}
                </Box>
              </Box>
              {/* @ts-expect-error  error*/}
              {userDetails?.google_username?
                <button
                disabled={isloadingGdRevokebttn}
                className={`h-[39px]  w-[121px] font-semibold text-black text-[15px] ${isloadingGdRevokebttn?'bg-[rgba(17,24,39,0.32)]':'bg-white border-[2px] border-[rgb(17,24,39,0.8)]'}  rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={revokeGdUser}
                >
                Remove
              </button>
              :<>
                <Button
                disabled={isfetchGdUserLoading}
                className={`h-[39px]  w-[121px] font-semibold text-white text-[15px] ${isfetchGdUserLoading ?`bg-[rgba(17,24,39,0.32)]`:`bg-[#1976D2]`} rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleGdConnect}
                >
                Connect
              </Button>
                </>}
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
              {/* @ts-expect-error  error*/}
                {userDetails?.hf_username && <Typography className="text-[12px] text-[rgb(17,24,39,0.6)]">{String(userDetails?.hf_username)}</Typography>}
                </Box>
              </Box>
              {/* @ts-expect-error  error*/}
              {userDetails?.hf_username?
                <button
                disabled={isloadingHfRevokebttn}
                className={`h-[39px]  w-[121px] font-semibold text-black text-[15px] ${isloadingHfRevokebttn?'bg-[rgba(17,24,39,0.32)]':'bg-white border-[2px] border-[rgb(17,24,39,0.8)]'}  rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={revokeHfUser}
                >
                Remove
              </button>
              :<>
                <Button
                disabled={isfetchHfUserLoading}
                className={`h-[39px]  w-[121px] font-semibold text-white text-[15px] ${isfetchHfUserLoading ?`bg-[rgba(17,24,39,0.32)]`:`bg-[#1976D2]`} rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleHfConnect}
                >
                Connect
              </Button>
                </>}
            </Box>
          </Box>
        </Box>
        </Box>
        </Box> 
      }
      
        <Toaster position="top-center" reverseOrder={false} />
      </Box>
  );
}


export default withAuth(ProfilePage)