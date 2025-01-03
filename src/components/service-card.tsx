import { Settings, Pause, Trash2, Cpu, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'
// import service from "@/assets/service.webp"
import { Router } from 'lucide-react'

import Image from 'next/image'
import { FaPause } from "react-icons/fa6"
import { IoMdSettings } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { FaArrowRight, FaPlay } from "react-icons/fa"
import { Box, CircularProgress, Modal, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import trianlgeAlert from "@/assets/trianlge-alert.svg" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from './ui/input'

interface NodeCardProps {
  id: string
  name: string
  notebook_url: string
  python_version: string
  status: "running" | "stopped" | "error"
  onOperation: (notebookId: string, operationName: string) => Promise<void>
}

export function ServiceCard({ id, name, status, notebook_url, python_version, onOperation }: NodeCardProps) {
  const [loading, setLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [inputValue, setInputValue] = useState("")
  const [isError, setIsError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setIsError(value !== name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputValue === name) {
      setIsDeleting(true)
      try {
        await onOperation(id, "delete")
        // toast.success('Service deleted successfully')
        handleClose()
      } catch (error) {
        console.error("Delete operation failed:", error)
        toast.error('Failed to delete service')
      } finally {
        setIsDeleting(false)
      }
    } else {
      setIsError(true)
    }
  }

  useEffect(() => {
    setIsRunning(status === 'running')
  }, [status])
  
  const handleToggle = async () => {
    const operationName = isRunning ? 'stop' : 'start'
    setLoading(true)

    try {
      await onOperation(id, operationName)
    } catch (error) {
      console.error("Operation failed:", error)
    } finally {
      setLoading(false)
      setIsRunning(!isRunning)
    }
  }

  const handleGoToNotebook = () => {
    if (status === 'running') {
      router.push(`/service/${id}`)
    } else {
      toast.error('Service is not running', { position: "bottom-right" })
    }
  }

  return (
    <div className="bg-white border-b rounded-md p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            {/* <Image
              src={service}
              alt="service"
              width={20}
              height={20}
            /> */}
            <Router size={20} />

          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <StatusBadge status={status} />
              <span className="text-gray-300 hidden lg:inline">|</span>
              <span>Python : {python_version}</span>
            </div>
          </div>
        </div>
        
        {/* Desktop view actions */}
        <div className="hidden lg:flex items-center gap-2">
          <div 
            className={`text-gray-400 p-2 hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggle}
          >
            {loading ? (
              <CircularProgress className="text-black" size={24}/> 
            ) : isRunning ? (
              <FaPause className="w-[20px] h-[20px] text-gray-400" />
            ) : (
              <FaPlay className="w-[15px] h-[20px] text-gray-400" />
            )}
          </div>
          <div onClick={handleOpen} className='p-2 hover:cursor-pointer'>
            <MdDelete className="w-[20px] h-[30px] text-red-600" />
          </div>
          <Button              
            disabled={status !== 'running'}
            variant="outline" 
            className={`text-gray-600 ${status !== 'running' ? "text-[#b0b0b0]":"text-[#111827] hover:text-gray-600"}`} 
            onClick={handleGoToNotebook}
          >
            Go to Service 
            <span className="ml-2"><FaArrowRight /></span>
          </Button>
        </div>

        {/* Mobile view actions */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={handleToggle}>
                {loading ? (
                  <CircularProgress className="text-black mr-2" size={16}/> 
                ) : isRunning ? (
                  <FaPause className="mr-2 h-4 w-4" />
                ) : (
                  <FaPlay className="mr-2 h-4 w-4" />
                )}
                {isRunning ? 'Stop Service' : 'Start Service'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpen} className="text-red-600">
                <MdDelete className="mr-2 h-4 w-4" />
                Delete Service
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToNotebook} disabled={status !== 'running'}>
                <FaArrowRight className="mr-2 h-4 w-4" />
                Go to Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="w-full h-full justify-items-center content-center"
      >
        <div className="p-6 bg-white shadow-xl rounded-[10px] item-center lg:w-[588px] m-4">
          <p className=" flex  gap-2 items-center pr-10 pb-4 text-[18px] lg:text-[20px] font-semibold text-[#111827]">
           <Image
           alt="triangle-alert" 
           src={trianlgeAlert}
           className=""/>
            <span className='pt-1'>Delete Service</span>
          </p>
          <p className="pb-4 text-[#374151] text-[15px] lg:text-base">
          This action cannot be undone. Please type the service&apos;s name to confirm deletion:
          </p>
          <div className='mb-4 h-[74px] p-4 w-[535px] border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
            <div className='text-[#4B5563] text-sm'>Service name:</div>
            <div className='font-medium text-[#111827] text-base'>{name}</div>
          </div>
          <form onSubmit={handleSubmit}>
            <Input 
                id="Confirm Name" 
                placeholder="Type service name to confirm" 
                required 
                value={inputValue}
                onChange={handleInputChange}
                className="max-w-full placeholder:text-[#9CA3AF] text-sm "
              />
            <Box className="flex w-full justify-end gap-4 pt-4">
              <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={handleClose}>Cancel</Button>
              <Button 
                variant="outline" 
                className='bg-[#EF4444] text-neutral-100' 
                onClick={handleSubmit}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <CircularProgress size={16} color="inherit" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Service'
                )}
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
    </div>
  )
}

