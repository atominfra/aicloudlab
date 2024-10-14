'use client'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="flex items-center flex-col gap-8 justify-center h-screen">
      <div>Landing Page</div>
      <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </Link>
      <Toaster />
    </div>
  )
}