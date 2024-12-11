'use client';

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { userAgent } from "next/server";

export default function CreditsPill() {
  const router = useRouter();
  const { user } = useGlobalContext();

  return (
    <div 
      className='text-black border-2 text-[16px] rounded-[12px] flex p-2 hover:cursor-pointer hover:bg-gray-200' 
      onClick={() => router.push('/credits')}
    >
      Credits: 
      <span className='text-black font-semibold flex items-center'>
        <span className='font-serif px-1'>₹</span>
        {user?.credits ? user?.credits : 0}
      </span>
    </div>
  );
}