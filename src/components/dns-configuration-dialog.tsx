'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, TriangleAlert } from 'lucide-react'
import { FaTriangleExclamation } from "react-icons/fa6"

interface DNSConfigurationDialogProps {
  domain: string
  nodeIp:string
}

export function DNSConfigurationDialog({ domain, nodeIp }: DNSConfigurationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='text-xs flex items-center gap-1 hover:underline hover:cursor-pointer underline'>
          {/* <TriangleAlert className='text-yellow-200' size={18}/> */}
          <FaTriangleExclamation className='text-orange-300 ' size={14} />
          Awaiting External DNS
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">DNS configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex gap-3 rounded bg-blue-50 p-4">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-600">
              This domain is waiting for External DNS propagation (that can take up to 24 hours) or has not been configured properly. Confirm you have configured this domain properly with the suggestions below. {' '}
              {/* <a href="#" className="text-blue-600 hover:underline">documentation</a>. */}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {/* Point {domain.split('.').slice(0, -2).join('.')} CNAME record to aicloudlab-dev.netlify.app */}
               Point A record to 75.2.60.5 
            </h3>
            <p className="text-sm text-gray-600">
              Log in to the account you have with your DNS provider, and add a A record for {domain} pointing to {nodeIp}
            </p>
            <div className="bg-gray-100 rounded p-4 font-mono text-sm">
            {domain} A {nodeIp}.
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="secondary" 
              className="bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

