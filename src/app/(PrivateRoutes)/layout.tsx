'use client';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import Loader from '@/components/loader';
import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import withAuth from '@/components/withAuth';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

const  Layout = ({children}) => {
    const pathname = usePathname();
    const {auth,setAuth, isLoading, setIsLoading} = useApp();
    const hideMobileNavs = pathname === "/login" || pathname === "/signup";

      return (
        <div className="flex h-screen bg-neutral-100 text-foreground">
          <SidebarProvider className=' flex-col md:flex-row'>
          { !hideMobileNavs && <MobileTopBar />}
          <DashboardSidebar />
          <SidebarInset>
            {isLoading ? <Loader/>: <>{children}</>}
            </SidebarInset>
        </SidebarProvider>
      </div>
      )


}


export default withAuth(Layout)