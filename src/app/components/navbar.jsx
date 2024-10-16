import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'

export default function Navbar() {
  return (
    <Box className=" w-full p-4 flex justify-between">
        <Box className=" flex items-center">
        <Image 
        src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png" 
        width={1000}
        height={1000}
        className=' w-20 h-16'
        alt="AI Cloud Lab Logo" />
      </Box>

      <Box className="flex gap-8 items-center">
      <ThemeSwitch/>
        <Typography variant="h6" className="font-semibold bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
          K
        </Typography>
      </Box>
      </Box>
  )
}
