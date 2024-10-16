import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes';
import { FaUser } from 'react-icons/fa';
export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full p-4 flex justify-between select-none">
        <Box className=" flex items-center">
        <Image 
        src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729071166/Untitled_design_15_nnjw9y.png'}
        width={1000}
        height={1000}
        className=' w-20 h-16'
        alt="AI Cloud Lab Logo" />
      </Box>

      <Box className="flex gap-8 items-center">
      <ThemeSwitch/>
      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2"
      style={{
        borderColor: resolvedTheme === 'dark' ? 'white' : 'black',
        backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#f9f9f9'
      }}>
      <FaUser size={16} color={resolvedTheme === 'dark' ? 'white' : 'black'} />
    </div>
      </Box>
      </Box>
  )
}
