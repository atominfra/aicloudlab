"use client"

import { useEffect, useState } from "react"
import { BarChart, Bell, Users, Globe, GitBranch, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function ServiceSidebar({id, name}) {
  const pathname = usePathname()

  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: `/service/dashboard?service-id=${id}&service-name=${name}`, icon: BarChart },
    { name: "Deployments", href: `/service/dashboard/deployments?service-id=${id}&service-name=${name}`, icon: GitBranch },
    { name: "Environment", href: `/service/dashboard/environment?service-id=${id}&service-name=${name}`, icon: Settings },
    { name: "Domains", href: `/service/dashboard/domains?service-id=${id}&service-name=${name}`, icon: Globe },
    { name: "Alerts", href: `/service/dashboard/alerts?service-id=${id}&service-name=${name}`, icon: Bell },
    { name: "Users", href: `/service/dashboard/users?service-id=${id}&service-name=${name}`, icon: Users },
  ])

  useEffect(() => {
    const disabledComponents = process.env.NEXT_PUBLIC_DISABLED_COMPONENTS
      ? process.env.NEXT_PUBLIC_DISABLED_COMPONENTS.split(",")
      : []

    setNavigation((prevNavigation) => prevNavigation.filter((item) => !disabledComponents.includes(item.name)))
  }, [])

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-white md:relative md:w-[12rem] md:border-r md:border-t-0">
      <div className="flex h-16 flex-row justify-around md:h-full md:flex-col md:justify-start md:pt-6">
        {/* Navigation */}
        <nav className="flex w-full overflow-x-auto scrollbar-hide px-4 md:flex-col md:space-y-1 md:overflow-visible md:px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex min-w-[100px] flex-col items-center gap-1 rounded-md px-3 py-2 text-xs transition-colors md:flex-row md:gap-3 md:text-sm md:font-medium
                  ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
                  ${isActive ? "md:bg-blue-600 md:text-white" : "md:text-gray-700 md:hover:bg-gray-100"}
                `}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 
                    ${isActive ? "text-blue-600" : "text-gray-700"}
                    ${isActive ? "md:text-white" : "md:text-gray-700"}
                  `}
                />
                <span className="md:inline">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

