import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';

export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full p-6 flex justify-between select-none">
        <Link className=" flex items-center" href={`/dashboard`}>
        <Image 
        src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'}
        width={1000}  
        height={1000}
        className=' w-20 h-12'
        alt="AI Cloud Lab Logo" />
      </Link>

      <Box className="flex gap-8 items-center">
      <ThemeSwitch/>
      <Link href={'/profile'}>
      <PiUserCircleFill size={45}  />
      </Link>
      </Box>
      </Box>
  )
}
