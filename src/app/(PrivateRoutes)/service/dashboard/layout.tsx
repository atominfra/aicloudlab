"use client"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ServiceSidebar } from "@/components/service-sidebar"
import { ServiceHeader } from "@/components/service-header"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useApp } from "@/context/AppContext"
import { fetchServiceDetails } from "../../api/services/api"
import { fetchNode } from "../../api/nodes/api"
import Loader from "@/components/loader"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState([])
  const [node, setNode] = useState([])
  const searchParams = useSearchParams()
  const id = searchParams.get('service-id')
  const name = searchParams.get('service-name')
  const {auth} = useApp()

  const fetchNodeDetails = async (nodeId) => {
    setLoading(true);
    try {
      const data = await fetchNode(auth, nodeId);
      setNode(data || null); 
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    // @ts-expect-error build
    if(auth && service?.node_id){
      // @ts-expect-error build
      fetchNodeDetails(service.node_id)
    }
  },[auth, service])

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServiceDetails(auth, id);
        console.log("Fetched Data:", data); // Debugging the fetched data
        console.log("ID to Match:", id, typeof id); // Debugging the id value and type
  
        if (!data?.data?.services) {
          console.error("Services array is undefined.");
          return;
        }
  
        // Ensure the `id` is compared as a number
        const filteredService = data.data.services.find(
          (service) => service.id === Number(id)
        );
  
        console.log("Filtered Service:", filteredService); // Debugging the filtered result
        setService(filteredService || null); // Set null if no match found
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, [auth, id]); // Include `id` as a dependency
  
    useEffect(()=>{
      console.log("service",service)
    },[service])
   
    if(loading){
      return <Loader/>
      
    }else
      return (
    <SidebarProvider className="bg-neutral-100">
      <div className="flex h-screen w-full overflow-hidden bg-neutral-100">
        <ServiceSidebar />
        <SidebarInset className="flex-1 overflow-auto bg-neutral-100 pb-16 md:pb-0">
          <div className="flex flex-col min-h-screen space-y-4 p-4 bg-neutral-100">
            <ServiceHeader
            // @ts-expect-error build
              name={service?.name || name} // Use name from search params or default
              // @ts-expect-error build
              status={service?.status || "Unknown"} // Provide default values
              // @ts-expect-error build
              memory={service?.mem_limit || "0 MB"}
              // @ts-expect-error build
              cpu={service?.cpu_limit || "0"}
              // @ts-expect-error build
              replicas={service?.replicas || 0}
              // @ts-expect-error build
              nodeName={node?.name || ''} 
              url="hiring-dev.atominfra.com" 
            />
            <main className="flex-1 space-y-4 bg-neutral-100">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

