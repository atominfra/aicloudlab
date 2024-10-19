'use client'
import { Button, Typography, Box, ButtonBase } from '@mui/material';
import { useState } from 'react';
import { GoLinkExternal } from "react-icons/go";
import { IoMdPause } from "react-icons/io";
import { MdSettings } from "react-icons/md";

export default function NotebookItem({ name, version, status }) {
  const [isHovered, setIsHovered] = useState(false);
  console.log("isHovered", isHovered);

  const statusColors = {
    stopped:"#FF6F00",
    running:"#1EFF4F"
  }
  
  return (
    <Box className="flex items-center justify-between bg-white dark:bg-gray-800 text-[#111827] dark:text-white p-4 rounded-lg mb-2 w-[90%] border-2 border-[#111827] dark:border-0">
      {/* <Box className="flex items-center w-[66%] "> */}
      <Box className='w-[16%]'>
        <Typography variant="body1" className=" font-poppins  ">
          {name}
        </Typography>
        </Box>
        <Typography 
          variant="body2" 
          className={`text-[#111827] font-poppins  capitalize font-bold`}
        >
          {status}
        </Typography>
        <Typography variant="body2" className="text-[#111827] dark:text-white  font-poppins ">
          Python {version}
        </Typography>
      {/* </Box> */}
      <Box className="flex items-center justify-evenly font-poppins gap-10 w-[34%]">
        <Box className="gap-4 flex justify-evenly">
        <Button  className="text-gray-400 min-w-0 ">
        </Button>
        <ButtonBase title='Coming Soon' className="text-gray-400 min-w-0 dark:hover:text-yellow-500">
        <IoMdPause className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white ' />
          </ButtonBase>
        <ButtonBase title='Coming Soon' className="text-gray-400 min-w-0 dark:hover:text-yellow-500">
            <MdSettings className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' />
          </ButtonBase>
        </Box>
        <Button
          endIcon={<GoLinkExternal className='dark:hover:text-yellow-500 text-xl ' />}
          className=" dark:hover:text-yellow-500 font-poppins text-[#111827] dark:text-white underline capitalize"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          href={notebook_url}
        >
          Go to notebook
        </Button>
      </Box>
    </Box>
  );
}
