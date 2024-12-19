'use client';

import MobileBottomBar from '@/components/mobileBottomBar';
import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { GlobalProvider } from '@/context/GlobalContext';
import { usePathname } from "next/navigation";
export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";
  return <>
        <GlobalProvider>
            {/* <div className="flex h-screen bg-background text-foreground">
              {!hideSidebar && <Sidebar />}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div> */}
            <div className="flex h-screen bg-background text-foreground">
            {!hideSidebar && <Sidebar />}
            <div className="w-full">
          <MobileTopBar/>
          <main className="flex-1 overflow-auto h-[84vh] lg:h-auto">
            {children}
          </main>
          <MobileBottomBar/>
          </div>
        </div>
        </GlobalProvider>
  </>;
}
