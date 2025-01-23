"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { FolderOpen, Cloud, User2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/accounts", label: "Accounts", icon: Cloud },
]

export function DashboardSidebar({ ...props }) {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const { user } = useAuth()
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={cn(
        "bg-white border-r border-border flex-col fixed h-screen hidden lg:flex",
        state === "collapsed"&& "w-16" ,
      )}
    >
      <SidebarHeader className="flex px-4 pt-4 pb-2 border-b">
        <Link href="/" className="flex items-center justify-center w-full">
          <div className={cn("flex items-center justify-center", state === "collapsed" ? "h-[30px]" : "w-full")}>
            {/* <Image
              src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png"
              width={30}
              height={30}
              alt="Atom Infra Logo"
              className={cn(
                "transition-all duration-300 ease-in-out",
                state === "collapsed" ? "w-[30px]" : "w-[22px] ",
              )}
              priority
            /> */}
            {state === "expanded" ? (
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
            ):<Image
            src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png" 
            width={30}
            height={30}
            alt="Atom Infra Logo"
            className=' w-[23px]'
            priority
          />}
          </div>
        </Link>
   
          
      </SidebarHeader>
      <SidebarContent className={cn("flex-1", state === "expanded" ? "p-4" : "p-2")}>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return  <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium",
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100",
                  state === "collapsed" ? "justify-center p-2" : "px-3 py-2",
                )}
              >
                <item.icon size={20} />
                {state === "expanded" && <span>{item.label}</span>}
              </Link>
            </li>
            })}
          </ul>
        </nav>
      </SidebarContent>
      <SidebarFooter className={cn("border-t border-border", state === "expanded" ? "p-4" : "p-2")}>
      <SidebarTrigger className=" w-full" />

        {state === "expanded" ? (
          <>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300"
              onClick={() => router.push("/profile")}
            >
              <span className="text-sm font-medium">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{user.full_name.split(" ")[0]}</div>
            </div>
            <div
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:cursor-pointer"
          onClick={() => router.push("/credits")}
        >
          <span className="font-serif pr-1">₹</span>
          {user.credits}
        </div>
          </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-lg bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300"
              onClick={() => router.push("/profile")}
            >
              {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
            </div>
            <div
              className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:cursor-pointer"
              onClick={() => router.push("/credits")}
            >
              <span className="font-serif pr-1">₹</span>
              {user.credits}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

