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
import CustomButton from './button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface NodeCardProps {
  id: number
  name: string
  memory: string
  vcpus: string,
  disk: string,
  private_ip_address: string,
  public_ip_address: string,
  gpu: string
  isDeleted: true
  status: string
  fetchNodes:() => Promise<void>
}

export function NodeCard({id, name, memory, vcpus, disk, private_ip_address, public_ip_address, gpu, isDeleted, status, fetchNodes }: NodeCardProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRunning,setIsRunning] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isError, setIsError] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    try {
      // await onOperation(id, operationName)
    } catch (error) {
      console.error("Operation failed:", error)
    } finally {
      setLoading(false)
      setIsRunning(!isRunning)
    }
  }

  const handleCopy = async () => {
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

  const handleSubmit = async (e) => {
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

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setIsError(value !== name)
  }

  if(isDeleted === true){
    return null
  }

  const handleDelete = async (id) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/e2e/node/${encodeURIComponent(id)}`

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

  return (
    <div className="bg-white border-b rounded-md p-4 w-full">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Image
              alt='nodeIcon'
              src={nodeIcon}
              className=''
            />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <StatusBadge status={status.toLowerCase()} />
              <span>IP: {public_ip_address}</span>
              <button onClick={handleCopy}>
                <Image
                  alt='copyIcon'
                  src={copyIcon}
                />
              </button>
              <div className='flex gap-2'>
                {specs}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className={`text-gray-400 p-2 hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggle}
          >
            {loading ? (
              <CircularProgress className="text-black" size={24}/> 
            ) : isRunning ? (
              <FaPause className="w-[20px] h-[30px] text-gray-400" />
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
          >
            Manage
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
              <Image
                alt='nodeIcon'
                src={nodeIcon}
                width={16}
                height={16}
              />
            </div>
            <h3 className="font-medium text-sm">{name}</h3>
          </div>
          <StatusBadge status={status.toLowerCase()} />
        </div>
        
        <div className="text-sm text-gray-500">
          IP: {public_ip_address}
        </div>
        
        <div className="text-sm text-gray-500">
          {specs}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button 
              className={`text-gray-400 hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleToggle}
            >
              {loading ? (
                <CircularProgress className="text-black" size={20}/> 
              ) : isRunning ? (
                <FaPause className="w-4 h-4 text-gray-400" />
              ) : (
                <FaPlay className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button onClick={handleOpen} className='text-red-600'>
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
          <Button              
            disabled={status !== 'running'}
            variant="secondary" 
            size="sm"
            className={`text-gray-600 ${status !== 'running' ? "opacity-50" : ""}`} 
          >
            Manage
          </Button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="w-full h-full justify-items-center content-center"
      >
        <div className="p-8 bg-white shadow-xl rounded-2xl item-center lg:w-[30vw] m-4">
          <p className="pr-10 pb-4 text-[18px] lg:text-[22px] font-semibold text-[#111827]">
            You are deleting &apos;{name}&apos;
          </p>
          <p className="pb-4 text-gray-600 text-[15px] lg:text-lg">
            If you&apos;re sure, type &apos;{name}&apos; to confirm.
          </p>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Confirm Name"
              value={inputValue}
              onChange={handleInputChange}
              variant="outlined"
              required
              error={isError}
              helperText={isError ? "Entered text does not match the name." : ""}
              InputProps={{
                className: "bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]",
              }}
              InputLabelProps={{
                sx: {
                  color: "black",
                  fontFamily: "poppins",
                  "&.Mui-focused": { color: "black" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            />
            <Box className="flex w-full justify-between gap-4 pt-4">
              <CustomButton
                text="No, cancel"
                onclickhandler={handleClose}
                customCss="w-[50%] bg-[#e3e3e3] text-black shadow-none text-[15px] lg:text-[16px]"
              />
              <CustomButton
                text={loading ? 'Deleting...' : 'Delete Node'}
                onclickhandler={handleSubmit}
                customCss="w-[50%] bg-red-600 text-white text-[15px] lg:text-[16px]"
                disabled={loading}
              />
            </Box>
          </form>
        </div>
      </Modal>
    </div>
  )
}

