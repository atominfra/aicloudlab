import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ServiceSidebar } from "@/components/service-sidebar"
import { ServiceHeader } from "@/components/service-header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="bg-neutral-100">
      <div className="flex h-screen w-full overflow-hidden bg-neutral-100">
        <ServiceSidebar  />
        <SidebarInset className="flex-1 overflow-auto bg-neutral-100">
          <div className="flex flex-col min-h-screen space-y-4 p-4 bg-neutral-100">
            <ServiceHeader
              name="backend"
              status="Running"
              memory="2G"
              cpu={4}
              replicas={3}
              hostname="hiring-dev-node"
              url="hiring-dev.atominfra.com"
            />
            <main className="flex-1 space-y-4 bg-neutral-100 ">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

