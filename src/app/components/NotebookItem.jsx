'use client'
import { AiOutlinePauseCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { BiExport } from 'react-icons/bi';
import { Button, Typography, Box } from '@mui/material';
import { useState } from 'react';

export default function NotebookItem({ name, version, isActive }) {
  const [isHovered, setIsHovered] = useState(false);
  console.log("name", name, version, isActive);

  return (
    <Box className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-2 w-full">
      <Box className="flex items-center w-[81%] ">
        <Typography variant="body1" className="text-white font-poppins  w-[27%]">
          {name}
        </Typography>
        <Typography 
          variant="body2" 
          className={isActive ? "text-[#1EFF4F] font-bold font-poppins w-[27%]" : "text-gray-400 font-bold font-poppins w-[27%]"}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
        <Typography variant="body2" className="text-white font-poppins w-[27%]">
          {version}
        </Typography>
      </Box>
      <Box className="flex items-center font-poppins">
        <Button  className="text-gray-400 min-w-0">
        <AiOutlinePauseCircle className='hover:text-yellow-500 text-2xl text-white' />
        </Button>
        <Button className="text-gray-400 min-w-0 hover:text-yellow-500">
        <FiSettings className='hover:text-yellow-500 text-xl text-white'/>
        </Button>
        <Button
          endIcon={<BiExport className='hover:text-yellow-500 text-xl ' />}
          className="text-white hover:text-yellow-500 font-poppins"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Go to notebook
        </Button>
      </Box>
    </Box>
  );
}
