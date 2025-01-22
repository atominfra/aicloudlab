'use client';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import Loader from '@/components/loader';
import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import withAuth from '@/components/withAuth';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import React from 'react'

const  Layout = ({children}) => {
    const pathname = usePathname();
    const {auth,setAuth} = useApp();
    console.log("auth",auth)
    const hideSidebar = pathname === "/login" || pathname === "/signup";
    const hideMobileNavs = pathname === "/login" || pathname === "/signup";

      return (
        <div className="flex h-screen bg-neutral-100 text-foreground">
           <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
        {/* {!hideSidebar && (
          <div className="lg:w-[15vw] bg-neutral-100">
            <Sidebar />
          </div>
        )} */}
        {/* <div className={`${hideSidebar ? 'w-full' : 'lg:w-[85vw] w-[100vw]'} bg-neutral-100`}>
          { !hideMobileNavs && <MobileTopBar />}
          <main
            className={`flex-1 overflow-y-scroll bg-neutral-100 ${
              hideMobileNavs ? 'h-[100vh]' : 'h-[92vh]'
            } lg:h-auto`}
          >
            {children}
          </main>
        </div> */}
      </div>
      )


}


export default withAuth(Layout)