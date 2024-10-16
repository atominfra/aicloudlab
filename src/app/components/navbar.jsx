import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes';

export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full p-4 flex justify-between">
        <Box className=" flex items-center">
        <Image 
        src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729070176/cln14b1469_p3ymed.png'}
        width={1000}
        height={1000}
        className=' w-20 h-16'
        alt="AI Cloud Lab Logo" />
      </Box>

      <Box className="flex gap-8 items-center">
      <ThemeSwitch/>
        <Typography variant="h6" className="font-semibold bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center select-none">
          K
        </Typography>
      </Box>
      </Box>
  )
}
