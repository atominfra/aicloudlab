"use client"
import Link from "next/link"
import { Book, Cloud, Cpu, FolderOpen, Router } from 'lucide-react'
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from 'next/navigation'
import Image from "next/image"
import { useApp } from '@/context/AppContext';
import { useEffect } from "react"
import nodeIcon from "@/assets/node.webp"
import atomInfra from "@/assets/atom-infra.png"
import { useAuth } from "@/context/AuthContext"
// import { ThemeToggle } from "./theme-toggle"
export function Sidebar() {
  const pathname = usePathname()
  console.log("pathname",pathname)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(()=>{
    router.prefetch("/profile")
    router.prefetch("/credits")
  },[])
  return (
    <div className=" bg-card border-r border-border bg-white rounded-r-2xl shadow-md flex-col fixed h-screen hidden lg:flex">
        <div className="flex px-4 pt-4 pb-2 border-b">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground">
        <div className='flex items-center'>
          <Image
            src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png" 
            width={30}
            height={30}
            alt="Atom Infra Logo"
            className='h-[22px] w-[23px]'
            priority
          />
          <div 
            className='relative text-[24px] font-[700] tracking-tight l-[30px]' 
            style={{ left: '-2px' }}
          >
            tom Infra
          </div>
        </div>

        </Link>
        </div>
        {/* <ThemeToggle /> */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
          <Link
              href="/dashboard/projects"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground ",
                pathname === '/dashboard/projects' || pathname ===  '/create/projects' ? "bg-blue-600 text-white":"hover:bg-accent",

              )}
            >
              <FolderOpen size={20} />
              {/* <Image
              alt="nodes"
              src={nodeIcon}/> */}
              <span>Projects</span>
            </Link>
          </li>
          <li>
          <Link
              href="/dashboard/accounts"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground ",
                pathname === '/dashboard/accounts' || pathname ===  '/dashboard/accounts' ? "bg-blue-600 text-white":"hover:bg-accent",

              )}
            >
              <Cloud size={20} />
              {/* <Image
              alt="nodes"
              src={nodeIcon}/> */}
              <span>Accounts</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-border ">
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
    </div>
  )
}

