"use client"

import { BarChart, Bell, Users, Globe, GitBranch, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function ServiceSidebar() {
  const pathname = usePathname()

const navigation = [
  { name: "Dashboard", href: "/service/dashboard", icon: BarChart },
  { name: "Deployments", href: "/service/dashboard/deployments", icon: GitBranch },
  { name: "Environment", href: "/service/dashboard/environment", icon: Settings },
  { name: "Domains", href: "/service/dashboard/domains", icon: Globe },
  { name: "Alerts", href: "/service/dashboard/alerts", icon: Bell },
  { name: "Users", href: "/service/dashboard/users", icon: Users },
]

  return (
    <div className="w-[12rem] bg-white border-r">
      <div className="flex h-full flex-col pt-14">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

