'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import Navbar from '@/components/navbar/navbar';
import withAuth from '@/components/withAuth';
import github from "@/assets/github.png"
import gdrive from "@/assets/googledrive.png"
import huggingface from "@/assets//huggingface.png"
import Loader from '@/components/loader';
import AccountButton from '@/components/accountButton';
import { useGlobalContext } from '@/context/GlobalContext';

const ProfilePage = () => {

  const { fetchUserDetails, isloading, user } = useGlobalContext();


  const handleLogout = ()=>{
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`;
    window.location.href = "/"
  }

  useEffect(()=>{
    fetchUserDetails()
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
          <AccountButton  account={ {id: 1, name: "Github", icon: github} } userName={user?.gh_username} api={'gh'} />
          <AccountButton  account={ {id: 1, name: "Google Drive", icon: gdrive} } userName={user?.google_username} api={'google'} />
          <AccountButton  account={ {id: 1, name: "Hugging Face", icon: huggingface} } userName={user?.hf_username} api={'hf'} />
          </Box>
        </Box>
        </Box>
        </Box> 
      }
      
      </Box>
  );
}


export default withAuth(ProfilePage)