import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';
import CreditsPill from "@/components/creditsPill"
export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full  flex justify-between select-none px-8 lg:px-10  py-4 shadow-lg bg-white h-[10vh]">
        <Link className=" flex items-center" href={`/dashboard`}>
          <Image 
          src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729418783/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_2_sogohi.webp' : 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'}
          width={1000}  
          height={1000}
          className=' w-[63px] h-[38px] '
          alt="AI Cloud Lab Logo" />
      </Link>

      <Box className=" gap-8 items-center text-black hidden lg:flex">
        <CreditsPill/>
        <Link href={'/profile'}>
        <PiUserCircleFill className='size-[38px] text-black' />
        </Link>
      </Box>
      </Box>
  )
}
