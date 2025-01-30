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
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import logo from "@/assets/logo.webp"
const navItems = [
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/accounts", label: "Accounts", icon: Cloud },
]

export function DashboardSidebar({ ...props }) {
  const pathname = usePathname()
  const router = useRouter()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const { user } = useAuth()

  // Determine if we should show the expanded view
  const showExpanded = isMobile || state === "expanded"

  const handleNavigation = (href: string) => {
    router.push(href)
    // if (isMobile) {
      setOpenMobile(false)
    // }
  }

  return (
    <Sidebar
      collapsible={"icon"}
      {...props}
      className={cn("bg-white border-r border-border flex-col fixed h-screen hidden lg:flex", !showExpanded && "w-16")}
    >
      <SidebarHeader className="flex items-center justify-center py-4 bg-white border-b">
        <SidebarMenu>
          <SidebarMenuItem className={`flex ${showExpanded ? "justify-between" : "justify-center"} items-center`}>
            {showExpanded ? (
              <Link href="/">
                <div className="flex items-center">
                  <Image
                    src={logo}
                    width={30}
                    height={30}
                    alt="Atom Infra Logo"
                    className="h-[22px] w-[23px]"
                    priority
                  />
                  <div className="relative text-[24px] font-[700] tracking-tight l-[30px]" style={{ left: "-2px" }}>
                    tom Infra
                  </div>
                </div>
              </Link>
            ) : (
              <Image
                src={logo}
                width={30}
                height={30}
                alt="Atom Infra Logo"
                className="h-[22px] w-[23px]"
                priority
              />
            )}
            {showExpanded && !isMobile && <SidebarTrigger />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={cn("flex-1", showExpanded ? "p-4" : "p-2")}>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg text-sm font-medium w-full",
                      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100",
                      !showExpanded ? "justify-center p-2" : "px-3 py-2",
                    )}
                  >
                    <item.icon size={20} />
                    {showExpanded && <span>{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </SidebarContent>
      <SidebarFooter className={cn("border-t border-border", showExpanded ? "p-4" : "p-2")}>
        {!showExpanded && <SidebarTrigger className="w-full" />}
        {showExpanded ? (
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300"
              onClick={() => handleNavigation("/profile")}
            >
              <span className="text-sm font-medium">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </button>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{user.full_name.split(" ")[0]}</div>
            </div>
            <button
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:cursor-pointer"
              onClick={() => handleNavigation("/credits")}
            >
              <span className="font-serif pr-1">₹</span>
              {user.credits}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              className="w-10 h-10 rounded-lg bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300"
              onClick={() => handleNavigation("/profile")}
            >
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

