"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { NavMain } from "./sidebar-components/nav-main"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { NavUser } from "./sidebar-components/nav-user"
import { Book, Cloud, Cpu, FolderOpen, Router } from 'lucide-react'

import Image from "next/image"

const navigation = [
  { href: "/dashboard/projects", name: "Projects", icon: FolderOpen },
  { href: "/dashboard/accounts", name: "Accounts", icon: Cloud },
];

export function DashboardSidebar({...props}) {
  const pathname = usePathname()
  const {state} = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props} className="bg-white">
    <SidebarHeader className="flex items-center justify-center py-4 bg-white border-b">
        <SidebarMenu >
          <SidebarMenuItem className={`flex ${state ==="expanded"?"justify-between":"justify-center"} items-center`}>
          {state ==="expanded" ? 
        <Link href="/" >
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
        :<>
        <Image
                  src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png" 
                  width={30}
                  height={30}
                  alt="Atom Infra Logo"
                  className='h-[22px] w-[23px]'
                  priority
                />               </>}
              {/* </a> */}
            {/* </SidebarMenuButton> */}
            {state==='expanded' && <SidebarTrigger  />}
          </SidebarMenuItem>
          
        </SidebarMenu>
        
      </SidebarHeader>
      <SidebarContent className="bg-white pt-4">
          <SidebarMenu>
            {navigation.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.name} className={`flex items-center justify-center  ${state==='expanded' ?"pl-1":""}`}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <Icon className="size-4" />
                    <span >{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
            })}
          </SidebarMenu>
        </SidebarContent>
    <SidebarFooter className="bg-white">
      {state==='collapsed' && <SidebarTrigger />}
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  )
}

