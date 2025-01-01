"use client"
import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PiUserCircleFill } from 'react-icons/pi';
import CreditsPill from "@/components/creditsPill"
import { GiHamburgerMenu } from "react-icons/gi";
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomBar() {
  const { user } = useAuth()
  const router = useRouter()
  return (
    <div className=" lg:hidden  flex flex-col justify-center  px-4 border-t border-border h-[8dvh]  ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300" onClick={()=> router.push("/profile")}>
          <span className="text-md font-medium ">{user?.full_name && user?.full_name.split(' ').map(n=> n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">
            {user?.full_name && user?.full_name.split(' ')[0]}
            </div>
          </div>
          <div className="px-3 py-1 bg-blue-600 text-primary-foreground text-white text-sm rounded-[4px] hover:cursor-pointer" onClick={()=> router.push("/credits")}>
          <span className='font-serif pr-1 text-white'>₹</span>
            {user?.credits ? user?.credits : 0} 
            
          </div>
        </div>
      </div>
  )
}
