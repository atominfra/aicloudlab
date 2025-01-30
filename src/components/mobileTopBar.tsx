import { Box } from '@mui/material'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { GiHamburgerMenu } from "react-icons/gi"
import { Book, Cpu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import hameMenu from "@/assets/hammenu.svg"
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import navItems from './navbar/navitems'
import { SidebarTrigger } from './ui/sidebar'
import logo from "@/assets/logo.webp"
export default function MobileTopBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const {user} = useAuth()
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // const navItems = [
  //   { href: '/dashboard/notebooks', icon: Book, label: 'Notebooks' },
  //   { href: '/dashboard/notebooks', icon: Book, label: 'Notebooks' },
  //   { href: '/dashboard/nodes', icon: Cpu, label: 'Nodes' },
  //   // { href: '/profile', icon: User, label: 'Profile' },
  // ]


      // prefetch routes for faster navigation
    useEffect(() => {
        router.prefetch('/dashboard/nodes');
        router.prefetch('/dashboard/notebooks');
      }, [router]);

  return (
    <>
      <Box className="md:hidden w-full flex justify-between items-center select-none px-4 lg:px-10 py-4 shadow-lg bg-white h-[8dvh] ">
        <Link className="flex items-center" href={`/dashboard`}>
            <div className='flex items-center'>
                <Image
                  src={logo}
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
        <SidebarTrigger  />
        {/* <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Image 
            src={hameMenu}
            width={23}
            height={23}
            alt="hameMenu" 
          />
        </Button> */}
      </Box>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      >
        <div
          className={cn(
            "fixed inset-y-0 flex justify-between flex-col right-0 z-50 w-3/4 max-w-xs bg-white shadow-xl transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={toggleSidebar}>
              <Image 
                src={logo}
                width={24}
                height={24}
                alt="AI Cloud Lab Logo" 
              />
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-accent"
                    onClick={toggleSidebar}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </div>
          <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300" 
          onClick={()=>{ 
            router.push("/profile")
            toggleSidebar()
            }}>
          <span className="text-md font-medium ">{user?.full_name && user?.full_name.split(' ').map(n=> n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground" >
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
      </div>
    </>
  )
}

