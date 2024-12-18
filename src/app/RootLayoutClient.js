'use client';

import { Sidebar } from '@/components/sidebar';
import { GlobalProvider } from '@/context/GlobalContext';
import { usePathname } from "next/navigation";
export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";
  return <>
        <GlobalProvider>
            <div className="flex h-screen bg-background text-foreground">
              {!hideSidebar && <Sidebar />}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
        </GlobalProvider>
  </>;
}
