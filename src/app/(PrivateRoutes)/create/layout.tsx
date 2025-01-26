import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return <>
       {/* <div className="flex h-screen bg-background text-foreground">
          <Sidebar /> */}
          <main className="bg-neutral-100">
            {children}
          </main>
        {/* </div> */}
    </>
  
}