import { Settings, Pause, Trash2, Cpu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'
import { useState } from 'react'
import copyIcon from "@/assets/copy.webp"
import nodeIcon from "@/assets/node.webp"
import Image from 'next/image'
import { MdDelete } from 'react-icons/md'
import { FaArrowRight, FaPause, FaPlay } from 'react-icons/fa6'
import { Box, CircularProgress, Modal, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import trianlgeAlert from "@/assets/trianlge-alert.svg" 
import { Input } from './ui/input'
import Link from 'next/link'
import azureIcon from "@/assets/azure.svg";
import gcpIcon from "@/assets/gcp.svg";
import awsIcon from "@/assets/aws.svg";
import e2eIcon from "@/assets/e2elogo.webp";

interface NodeCardProps {
  id: number
  name: string
  memory: string
  vcpus: string,
  disk: string,
  private_ip_address: string,
  public_ip_address: string,
  gpu: string
  location: string
  isDeleted: boolean
  status: string
  fetchNodes: () => Promise<void>
  projectId: string
  provider: string
}

export function NodeCard({
  id, name, memory, vcpus, disk, private_ip_address, public_ip_address, gpu, isDeleted, status = "Running",
  fetchNodes, projectId, location, provider
}: NodeCardProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isError, setIsError] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const router = useRouter()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'azure':
        return azureIcon;
      case 'gcp':
        return gcpIcon;
      case 'aws':
        return awsIcon;
      case 'e2e':
        return e2eIcon;
      default:
        return null;
    }
  };

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(public_ip_address)
      setCopySuccess(true)
      toast.success('IP copied to clipboard')
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      toast.error('Failed to copy IP')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue === name) {
      setLoading(true)
      try {
        await handleDelete(id)
        handleClose()
      } catch (error) {
        toast.error('Failed to delete node')
      } finally {
        setLoading(false)
      }
    } else {
      setIsError(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsError(value !== name)
  }

  if (isDeleted) {
    return null
  }

  const handleDelete = async (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cloud/node/${encodeURIComponent(id)}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Details: ${errorDetails}`)
    }

    const result = await response.json()
    await fetchNodes()
    return result
  }

  const specs = [
    vcpus && `${vcpus}vCPU`,
    memory,
    disk,
    gpu
  ].filter(Boolean).join(' • ')

  const handleSSHCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const sshCommand = provider === 'e2e' ? `ssh root@${public_ip_address}` : `ssh ubuntu@${public_ip_address}`
      await navigator.clipboard.writeText(sshCommand)
      setCopySuccess(true)
      toast.success('SSH command copied')
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      toast.error('Failed to copy SSH command')
    }
  }

  return (
    <div className="bg-white border-b rounded-md p-4 w-full">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between">
        <Link href={`/project/${projectId}/node/${id}?projectId=${projectId}`} className="w-full">
          <div className="flex items-center gap-4 hover:cursor-pointer">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              {getProviderIcon(provider) && (
                <Image
                  src={getProviderIcon(provider) || "/placeholder.svg"}
                  alt={provider}
                  width={40}
                  height={40}
                  className="w-6 h-6 object-contain"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <StatusBadge status={status.toLowerCase()} />
                <span>IP: {public_ip_address}</span>
                <button
                  onClick={handleCopy}
                  className="h-full w-4 focus:outline-none"
                  aria-label="Copy IP address"
                >
                  <Image
                    alt='copyIcon'
                    src={copyIcon || "/placeholder.svg"}
                    width={16}
                    height={16}
                  />
                </button>
                <div className='flex gap-2'>
                  {specs}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className='w-[200px] rounded-full bg-gray-200 py-1 px-2 flex gap-2 items-center justify-center hover:bg-gray-300 hover:cursor-pointer'
            onClick={handleSSHCopy}
          >
            <Image
              alt='copyIcon'
              src={copyIcon || "/placeholder.svg"}
              width={16}
              height={16}
            />
            <span className='text-sm text-gray-700'>Copy SSH Command</span>
          </button>
          <button onClick={handleOpen} className='p-2 hover:cursor-pointer'>
            <MdDelete className="w-[20px] h-[30px] text-red-600" />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-2">
        <Link href={`/project/${projectId}/node/${id}?projectId=${projectId}`} className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <Image
                  alt='nodeIcon'
                  src={nodeIcon || "/placeholder.svg"}
                  width={16}
                  height={16}
                />
              </div>
              <h3 className="font-medium text-sm">{name}</h3>
            </div>
            <StatusBadge status={status.toLowerCase()} />
          </div>
          
          <div className="text-sm text-gray-500 flex items-center gap-2">
            IP: {public_ip_address}
            <button
              onClick={handleCopy}
              className="focus:outline-none"
              aria-label="Copy IP address"
            >
              <Image
                alt='copyIcon'
                src={copyIcon || "/placeholder.svg"}
                width={16}
                height={16}
              />
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {specs}
          </div>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={handleOpen} className='text-red-600'>
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
          <button
            className='rounded-full bg-gray-200 py-1 px-2 flex gap-2 items-center justify-center hover:bg-gray-300 hover:cursor-pointer'
            onClick={handleSSHCopy}
          >
            <Image
              alt='copyIcon'
              src={copyIcon || "/placeholder.svg"}
              width={16}
              height={16}
            />
            <span className='text-sm text-gray-700'>Copy SSH</span>
          </button>
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
          <p className="flex gap-2 items-center pr-10 pb-4 text-[18px] lg:text-[20px] font-semibold text-[#111827]">
           <Image
             alt="triangle-alert" 
             src={trianlgeAlert || "/placeholder.svg"}
             width={24}
             height={24}
           />
            <span className='pt-1'>Delete Node</span>
          </p>
          <p className="pb-4 text-[#374151] text-[15px] lg:text-base">
            This action cannot be undone. Please type the node&apos;s name to confirm deletion:
          </p>
          <div className='mb-4 h-[74px] p-4 lg:w-[535px] border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
            <div className='text-[#4B5563] text-sm'>Node name:</div>
            <div className='font-medium text-[#111827] text-base'>{name}</div>
          </div>
          <form onSubmit={handleSubmit}>
            <Input 
              id="Confirm Name" 
              placeholder="Type node name to confirm" 
              required 
              value={inputValue}
              onChange={handleInputChange}
              className="max-w-full placeholder:text-[#9CA3AF] text-sm"
            />
            <Box className="flex w-full justify-end gap-4 pt-4">
              <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={handleClose}>Cancel</Button>
              <Button 
                variant="outline" 
                className='bg-[#EF4444] text-neutral-100' 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} color="inherit" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Node'
                )}
              </Button>
            </Box>
          </form>
        </div>
      </Modal>
    </div>
  )
}

