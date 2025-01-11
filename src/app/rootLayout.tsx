'use client';
import Loader from '@/components/loader';
import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import React from 'react'


export default function RootLayout({children}) {
    const pathname = usePathname();
    const {auth,setAuth} = useApp();
    
    const hideSidebar = pathname === "/login" || pathname === "/signup";
    const hideMobileNavs = pathname === "/login" || pathname === "/signup";

    // if(auth){
      return (
        <div className="flex h-screen bg-neutral-100 text-foreground">
        {auth &&!hideSidebar && (
          <div className="lg:w-[15vw] bg-neutral-100">
            <Sidebar />
          </div>
        )}
        <div className={`${hideSidebar ? 'w-full' : 'lg:w-[85vw] w-[100vw]'} bg-neutral-100`}>
          {auth && !hideMobileNavs && <MobileTopBar />}
          <main
            className={`flex-1 overflow-y-scroll bg-neutral-100 ${
              hideMobileNavs ? 'h-[100vh]' : 'h-[92vh]'
            } lg:h-auto`}
          >
            {children}
          </main>
          {/* {!hideMobileNavs && <MobileBottomBar/>} */}
        </div>
      </div>
      )
    // }


}