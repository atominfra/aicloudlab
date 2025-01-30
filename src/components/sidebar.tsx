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
import logo from "@/assets/logo.webp"
// import { ThemeToggle } from "./theme-toggle"
import { BarChart, Box, Bell, Users, Globe, GitBranch, Settings, User2, ChevronUp } from "lucide-react"

const navigation = [
  { label: "Dashboard", href: "/service/dashboard", icon: BarChart },
  { label: "Deployments", href: "/service/dashboard/deployments", icon: GitBranch },
  { label: "Environment", href: "/service/dashboard/environment", icon: Settings },
  { label: "Domains", href: "/service/dashboard/domains", icon: Globe },
  { label: "Alerts", href: "/service/dashboard/alerts", icon: Bell },
  { label: "Users", href: "/service/dashboard/users", icon: Users },
]
const navItems = [
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/accounts", label: "Accounts", icon: Cloud },
];
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
    <div className=" bg-card border-r border-border bg-white flex-col fixed h-screen hidden lg:flex">
        <div className="flex px-4 pt-4 pb-2 border-b">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground">
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
        </div>
        {/* <ThemeToggle /> */}
        <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground",
                pathname === item.href ? "bg-blue-600 text-white" : "hover:bg-accent"
              )}
            >
              {item.icon && <item.icon size={20} />}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
      <div className="p-4 border-t border-border w-[13vw]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300" onClick={()=> router.push("/profile")}>
          <span className="text-md font-medium ">{user?.full_name && user?.full_name.split(' ').map(n=> n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground  w-[4vw]">
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

