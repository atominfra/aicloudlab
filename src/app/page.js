'use client'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast';
import ComingSoonPage from '../app/components/comingSoon'
import { redirect } from 'next/navigation';
export default function Home() {

  redirect('/login');
  return (
    <div className="">
      {/* <ComingSoonPage/> */}
      <Toaster />
    </div>
  )
}

