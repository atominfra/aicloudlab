'use client'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast';
import ComingSoonPage from '../components/comingSoon'
import { redirect } from 'next/navigation';
export default function Home() {

  redirect('/dashboard');
  return (
    <div className="">
      {/* <ComingSoonPage/> */}
      <Toaster />
    </div>
  )
}

