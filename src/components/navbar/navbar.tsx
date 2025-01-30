import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';
import CreditsPill from "@/components/creditsPill"
import logo from "@/assets/logo.webp"
export default function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className=" w-full  flex justify-between select-none px-8 lg:px-10  py-4 shadow-lg bg-white h-[10vh] ">
        <Link className=" flex items-center" href={`/dashboard`}>
          <Image 
          src={logo}
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
