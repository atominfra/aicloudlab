"use client"
import Link from "next/link"
import { Book, Cpu } from 'lucide-react'
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
// import { useGlobal } from "@/contexts/global-context"
// import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  console.log("pathname",pathname)
  // const { userName, credits } = useGlobal()

  return (
    <div className="w-60 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl">LOGO</span>
        </Link>
        {/* <ThemeToggle /> */}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard/notebooks"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-accent",
                pathname === '/dashboard/notebooks' && "bg-accent text-accent-foreground"
              )}
            >
              <Book size={20} />
              <span>Notebooks</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/nodes"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-accent",
                pathname === '/dashboard/nodes' && "bg-accent text-accent-foreground"
              )}
            >
              <Cpu size={20} />
              <span>Nodes</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            {/* <span className="text-sm font-medium">{userName.split(' ').map(n => n[0]).join('')}</span> */}
          </div>
          <div className="flex-1">
            {/* <div className="font-medium">{userName}</div> */}
            <div className="text-sm text-muted-foreground">User</div>
          </div>
          <div className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
            {/* ¥{credits}  */}
            Credits
          </div>
        </div>
      </div>
    </div>
  )
}

