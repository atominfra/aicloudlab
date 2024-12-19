import { Box } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { GiHamburgerMenu } from "react-icons/gi"
import { Book, Cpu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function MobileTopBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const navItems = [
    { href: '/dashboard/notebooks', icon: Book, label: 'Notebooks' },
    { href: '/dashboard/nodes', icon: Cpu, label: 'Nodes' },
  ]

  return (
    <>
      <Box className="lg:hidden w-full flex justify-between items-center select-none px-8 lg:px-10 py-4 shadow-lg bg-white h-[8vh]">
        <Link className="flex items-center" href={`/dashboard`}>
          <Image 
            src={'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png'}
            width={24}
            height={24}
            alt="AI Cloud Lab Logo" 
          />
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <GiHamburgerMenu size={20} />
        </Button>
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
            "fixed inset-y-0 right-0 z-50 w-3/4 max-w-xs bg-white shadow-xl transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={toggleSidebar}>
              <Image 
                src={'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png'}
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
      </div>
    </>
  )
}

