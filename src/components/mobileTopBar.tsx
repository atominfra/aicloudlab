import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';
import CreditsPill from "@/components/creditsPill"
import { GiHamburgerMenu } from "react-icons/gi";

export default function MobileTopBar() {

  return (
    <Box className="lg:hidden w-full flex justify-between items-center select-none px-8 lg:px-10  py-4 shadow-lg bg-white h-[8vh] ">
        <Link className=" flex items-center" href={`/dashboard`}>
          <Image 
          src={'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png'}
          width={24}
          height={24}
          alt="AI Cloud Lab Logo" />
      </Link>
      <GiHamburgerMenu size={20}/>

      
      </Box>
  )
}
