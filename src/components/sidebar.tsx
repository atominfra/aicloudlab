"use client"
import Link from "next/link"
import { Book, Cpu, Router } from 'lucide-react'
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from 'next/navigation'
import Image from "next/image"
import { useGlobal } from "@/context/global-context"
// import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  console.log("pathname",pathname)
  const { user } = useGlobal()
  const router = useRouter()
  return (
    <div className="w-60 bg-card border-r border-border flex flex-col h-full">
        <Link href="/" className="p-4 flex items-center justify-center border-b w-full ">
          <Image 
          src='https://res.cloudinary.com/dy8hx2xrj/image/upload/v1734099746/atominfra-logo_pmfxxq.png'
          alt='logo'
          width={24}
          height={24}
          ></Image>
          <div className="font-bold text-xl pt-[0.8px] pl-2">AI Cloud Lab</div>
        </Link>
        {/* <ThemeToggle /> */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard/notebooks"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground ",
                pathname === '/dashboard/notebooks'  ? "bg-blue-600 text-white":"hover:bg-accent",

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
                "flex items-center gap-2 px-4 py-2 rounded-lg text-foreground ",
                pathname === '/dashboard/nodes'  ? "bg-blue-600 text-white":"hover:bg-accent",

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
          <div className="w-10 h-10 rounded-full bg-neutral-100 border flex items-center justify-center hover:cursor-pointer hover:border-gray-300" onClick={()=> router.push("/credits")}>
            <span className="text-md font-medium ">{'Shryansh'.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">
              {user.full_name}
              </div>
          </div>
          <div className="px-3 py-1 bg-blue-600 text-primary-foreground text-sm rounded-[4px] hover:cursor-pointer" onClick={()=> router.push("/credits")}>
          <span className='font-serif px-1'>₹</span>
            {user.credits} 
            
          </div>
        </div>
      </div>
    </div>
  )
}

