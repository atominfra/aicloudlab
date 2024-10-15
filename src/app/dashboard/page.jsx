import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import Image from 'next/image';
import book from "../../assets/book.png"

export default function page({}) {
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <Box className="absolute top-4 left-4 flex items-center">
      {/* <CloudIcon className="text-blue-400 mr-2" /> */}
      {/* <Typography variant="h6" className="font-semibold">
        Cloud Lab
      </Typography> */}
      <Image 
        src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png" 
        width={1000}
        height={1000}
        className=' w-20 h-16'
        alt="AI Cloud Lab Logo" />
    </Box>
    
    <Box className="absolute top-8 right-10">
      <Typography variant="h6" className="font-semibold bg-yellow-400 text-white rounded-full w-8 border border-white text-center">
        K
      </Typography>
    </Box>
    
    <Box className="flex flex-col items-center">
      <Image 
        src={book} 
        width={1000}
        height={1000}
        className='w-16 h-20 bg-gray-900'
        alt="AI Cloud Lab Logo" />
      <Typography variant="body1" className="text-gray-400 mb-4">
        No notebooks yet.
      </Typography>
      <Button
        variant="contained"
        className="bg-blue-600 hover:bg-blue-700"
      >
        + Create
      </Button>
    </Box>
  </Box>
  )
}