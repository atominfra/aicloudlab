import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes';
import { HiUserCircle } from "react-icons/hi2";
import Link from 'next/link';

export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full p-4 flex justify-between select-none ">
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
      {/* <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#111827]"
      style={{
        borderColor: resolvedTheme === 'dark' ? 'white' : 'black',
        backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#f9f9f9'
      }}>
    </div> */}
      <HiUserCircle size={45}  />
      </Box>
      </Box>
  )
}
