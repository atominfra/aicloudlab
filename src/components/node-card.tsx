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
  status: "running" | "stopped" | "error"
}



export function NodeCard({id, name, memory, vcpus, disk, private_ip_address, public_ip_address, gpu, isDeleted, status }: NodeCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRunning,setIsRunning] = useState(false);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const popperId = open ? 'simple-popper' : undefined;
  const handleClose = () => setOpen(false);
  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const router= useRouter()

  const handleToggle = async () => {
      setLoading(true);
  
      try {
        // await onOperation(id, operationName); 
      } catch (error) {
        console.error("Operation failed:", error);
      } finally {
        setLoading(false);
        setIsRunning(!isRunning)
      }
    };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(public_ip_address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset message after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If inputValue matches name, proceed with deletion
    if (inputValue === name) {
      handleClose();
    } else {
      setIsError(true); // Set error if input doesn't match the name
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsError(value !== name); // Set error if input doesn't match the name
  };


  return (
    <div className="bg-white border-b rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Image
                  alt='nodeIcon'
                  src={nodeIcon}
                  className=''
                />
          </div>
          <div>
            <h3 className="font-medium">Name</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <StatusBadge status={"running"} />
              <span>IP: {public_ip_address}</span>
              <button onClick={handleCopy} >
                <Image
                  alt='copyIcon'
                  src={copyIcon}
                />
              </button>
              <div className='flex gap-2'>
              {vcpus && <div>
                <span>{vcpus+'vCPU'}</span>
                </div> }
              {memory && <div>
                <span className='pr-1'>•</span>
                <span>{memory}</span>
                </div> }
              {disk && <div>
                <span className='pr-1'>•</span>
                <span>{disk}</span>
                </div> }
              {gpu && <div>
                <span className='pr-1'>•</span>
                <span>{gpu}</span>
                </div> }
              </div>
             
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <div 
              className={`text-gray-400 p-2 hover:cursor-pointer  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleToggle}
              >
            {loading ? (
              <CircularProgress className="text-black" size={24}/> 
            ) : isRunning ? (
              <FaPause className="w-[20px] h-[30px text-gray-400 " />
            ) : (
              <FaPlay className="w-[15px] h-[20px] text-gray-400 " />
            )}
          </div>
          {/* <div  className='p-2 hover:cursor-pointer'>
            <IoMdSettings className="w-[20px] h-[30px] text-gray-400" />
          </div> */}
          <div  onClick={handleOpen} className='p-2 hover:cursor-pointer'>
            <MdDelete className="w-[20px] h-[30px] text-red-600" />
          </div>
          <Button              
              disabled={status !== 'running'}
              variant="outline" 
              className={`text-gray-600 ${status !== 'running' ? "text-[#b0b0b0]":"text-[#111827] hover:text-gray-600"}`} 
              onClick={()=>{
                if(status === 'running'){
                  router.push(`/notebook/${id}`)
                }else{
                  toast.error('Notebook is not running',{position:"bottom-right"})
                }
              }}>Manage 
            {/* <span className=''><FaArrowRight /></span> */}
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
          <div
            className=" p-8 bg-white shadow-xl rounded-2xl item-center lg:w-[35vw] m-4"
          >
            <p className="pr-10 pb-4 text-[18px] lg:text-[22px] font-semibold text-[#111827]">You are deleting &apos;{name}&apos;</p>
            <p className="pb-4 text-gray-600 text-[15px] lg:text-lg">If you&apos;re sure, type &apos;{name}&apos; to confirm.</p>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Confirm Name"
                value={inputValue}
                onChange={handleInputChange}
                variant="outlined"
                required
                error={isError} // Show error if input doesn't match
                helperText={
                  isError ? "Entered text does not match the name." : ""
                } // Display error message
                InputProps={{
                  className:
                    "bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]",
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
                  text="Delete Notebook"
                  onclickhandler={handleSubmit}
                  customCss="w-[50%] bg-red-600 text-white text-[15px] lg:text-[16px]"
                />
              </Box>
            </form>
          </div>
        </Modal>
    </div>
  )
}

