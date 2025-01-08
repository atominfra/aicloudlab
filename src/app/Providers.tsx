'use client';

import MobileTopBar from '@/components/mobileTopBar';
import { Sidebar } from '@/components/sidebar';
import { AppProvider } from '@/context/AppContext';
import { usePathname } from "next/navigation";
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/signin" || pathname === "/signup";
  const hideMobileNavs = pathname === "/signin" || pathname === "/signup";

  return (
    <>
      <AuthProvider>
        <AppProvider>
          <div className="flex h-screen bg-neutral-100 text-foreground">
            {!hideSidebar && (
              <div className="lg:w-[15vw] bg-neutral-100">
                <Sidebar />
              </div>
            )}
            <div className={`${hideSidebar ? 'w-full' : 'lg:w-[85vw] w-[100vw]'} bg-neutral-100`}>
              {!hideMobileNavs && <MobileTopBar />}
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
        </AppProvider>
      </AuthProvider>
    </>
  );
}
