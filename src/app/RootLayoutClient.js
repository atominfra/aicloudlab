'use client';

import MobileBottomBar from '@/components/mobileBottomBar';
import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { GlobalProvider } from '@/context/GlobalContext';
import { usePathname } from "next/navigation";
export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";
  const hideMobileNavs = pathname === "/login" || pathname === "/signup";
  return <>
        <GlobalProvider>
            <div className="flex h-screen bg-background text-foreground">
            {!hideSidebar && <Sidebar />}
            <div className="w-full">
            {!hideMobileNavs && <MobileTopBar/>}
          <main className={`flex-1 overflow-auto ${hideMobileNavs ? "h-[100vh]":"h-[92vh]"} lg:h-auto `}>
            {children}
          </main>
          {/* {!hideMobileNavs && <MobileBottomBar/>} */}
          </div>
        </div>
        </GlobalProvider>
  </>;
}
