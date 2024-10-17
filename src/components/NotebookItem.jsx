'use client'
import { Button, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { GoLinkExternal } from "react-icons/go";
import { IoMdPause } from "react-icons/io";
import { MdSettings } from "react-icons/md";

export default function NotebookItem({ name, version, isActive }) {
  const [isHovered, setIsHovered] = useState(false);
  // console.log("name", name, version, isActive);

  return (
    <Box className="flex items-center justify-between bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg mb-2 w-[90%] border-2 dark:border-0">
      {/* <Box className="flex items-center w-[66%] "> */}
      <Box className='w-[16%]'>
        <Typography variant="body1" className=" font-poppins  ">
          {name}
        </Typography>
        </Box>
        <Typography 
          variant="body2" 
          className={isActive ? "text-[#1EFF4F] font-bold font-poppins " : "text-gray-400 font-bold font-poppins w-[27%]"}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
        <Typography variant="body2" className="text-black dark:text-white  font-poppins ">
          {version}
        </Typography>
      {/* </Box> */}
      <Box className="flex items-center justify-evenly font-poppins gap-10 w-[34%]">
        <Box className="gap-4 flex justify-evenly">
        <Button  className="text-gray-400 min-w-0 ">
        <IoMdPause className='dark:hover:text-yellow-500 text-2xl text-black dark:text-white ' />
        </Button>
        <Button className="text-gray-400 min-w-0  dark:hover:text-yellow-500">
        <MdSettings className='dark:hover:text-yellow-500 text-2xl text-black dark:text-white '/>
        </Button>
        </Box>
        <Button
          endIcon={<GoLinkExternal className='dark:hover:text-yellow-500 text-xl ' />}
          className=" dark:hover:text-yellow-500 font-poppins text-black dark:text-white underline"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Go to notebook
        </Button>
      </Box>
    </Box>
  );
}
