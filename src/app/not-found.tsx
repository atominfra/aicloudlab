'use client'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  const {auth} = useApp()

  return (
    <div className="min-h-screen flex flex-col">

    {/* Main Content */}
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-[160px] font-bold text-primary leading-none text-blue-700">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-8">
        Page Not Found
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {auth ? 
        <Button asChild className='bg-blue-700 text-white'>
          <Link href="/dashboard">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Go to Dashboard
          </Link>
        </Button>
        :
        <Button variant="outline" asChild className='text-blue-700 border border-blue-700'>
          <Link href="/login">
            Login/ Signup
          </Link>
        </Button>
        }
      </div>
    </main>

    {/* Footer */}
    <footer className="p-6 text-center text-sm text-muted-foreground">
      © 2024 Ambition Forge. All rights reserved.
    </footer>
  </div>
  )
}