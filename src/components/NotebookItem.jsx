import {
  Button,
  Typography,
  Box,
  ButtonBase,
  dialogActionsClasses,
  TextField,
  Modal
} from "@mui/material";
import { useEffect, useState } from 'react';
import { GoLinkExternal } from "react-icons/go";
import { IoIosArrowForward, IoMdPause } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import Link from 'next/link';
import { FaPlay } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CircularProgress from '@mui/material/CircularProgress';
import CustomButton from "./ui/button";
import { useRouter } from "next/navigation";
import Popper from '@mui/material/Popper';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
export default function NotebookItem({ id, name, version, status, notebook_url, onOperation }) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRunning,setIsRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);
  const router= useRouter()
  const [popperOpen, setPopperOpen] = useState(false);
  const [popperAnchorEl, setPopperAnchorEl] = useState(null);
  const popperId = open ? 'simple-popper' : undefined;
  const handleClick = (event) => {
    setPopperAnchorEl(event.currentTarget);
    setPopperOpen((previousOpen) => !previousOpen);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsError(value !== name); // Set error if input doesn't match the name
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If inputValue matches name, proceed with deletion
    if (inputValue === name) {
      onOperation(id, "delete");
      handleClose();
    } else {
      setIsError(true); // Set error if input doesn't match the name
    }
  };

  // isRunning = 
  useEffect(()=>{
    if(status === 'running')
    setIsRunning(true)
  else
    setIsRunning(false)
  },[])
  
  const handleToggle = async () => {
  const operationName = isRunning ? 'stop' : 'start'

    setLoading(true);

    try {
      console.log("operationName in notebook",operationName)
      await onOperation(id, operationName); 
    } catch (error) {
      console.error("Operation failed:", error);
    } finally {
      setLoading(false);
      setIsRunning(!isRunning)
    }
  };

  return (
    <Box className="flex items-center justify-between bg-white dark:bg-gray-800 text-[#111827] dark:text-white p-4 h-[60px]  mb-2 w-full lg:w-[90%] border rounded-[10px] lg:rounded-[20px] border-gray-300 ">
      <Box className=" w-full lg:w-[60%]  flex flex-col lg:flex-row ">
      <Box className='w-[33%] lg:px-4'>
        <Typography  className="font-poppins text-[15px] lg:text-[16px] pt-2 lg:pt-0">
          {name}
        </Typography>
      </Box>
      <Box className='lg:w-[66%] flex '>
      <Typography 
        className={`flex items-center  text-[rgba(17,24,39,0.6)] lg:text-[#111827] font-poppins capitalize font-semibold text-[11px]  lg:text-[16px] lg:w-[50%]`}
      >
        {status}
      </Typography>
      <span className="flex items-center px-1 text-[rgba(17,24,39,0.6)] lg:hidden">•</span>
      <Typography className=" flex items-center text-[rgba(17,24,39,0.6)] lg:text-[#111827] dark:text-white font-poppins text-[11px] lg:text-[16px] lg:w-[50%]">
        Python {version}
      </Typography>
      </Box>
      </Box>
      <Box className="hidden lg:flex items-center justify-evenly font-poppins gap-10 w-[40%]">
      <div
            title={isRunning ? 'Pause' : 'Start'}
            className={`text-gray-400 min-w-0 hover:cursor-pointer dark:hover:text-yellow-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress className="text-black" size={24}/> 
            ) : isRunning ? (
              <IoMdPause className='dark:hover:text-yellow-500 h-[20px] w-[20px] text-[#111827] dark:text-white' />
            ) : (
              <FaPlay className='dark:hover:text-yellow-500 h-[20px] w-[20px] text-[#111827] dark:text-white' />
            )}
          </div>
  
          <div
            title="Delete"
            className="text-red-600 hover:text-white hover:ease-in duration-100  h-[38px] w-[88px] text-[16px] font-semibold border-[1px] border-red-600 rounded-[200px] hover:bg-red-600 flex justify-center items-center hover:cursor-pointer"
            onClick={handleOpen}
          >
            Delete
          </div>
          
            <div
              disabled={status !== 'running'}
              className={`font-poppins   capitalize flex items-center justify-center hover:cursor-pointer ${status !== 'running' ? "text-[#b0b0b0]":"text-[#111827] hover:text-gray-600"}`}
              onClick={()=>{
                if(status === 'running'){
                  router.push(`/notebook/${id}`)
                }else{
                  toast.error('Notebook is not running')
                }
              }}
            >
              Go to notebook
              <IoIosArrowForward className=' text-lg  m-0' />
            </div>
      </Box>
      <span
          variant="text"
          className={`text-xl text-black hover:text-black lg:hidden hover:cursor-pointer p-3 ${popperOpen ? 'rounded-full bg-gray-100 ':''}`}
          ripple={false}
          onClick={handleClick}
        >
          <PiDotsThreeOutlineVerticalFill />
        </span>
        <Popper id={popperId} open={popperOpen} anchorEl={popperAnchorEl} placement='bottom-end'>
        <Box className='border p-4 flex flex-col gap-6 bg-white text-black mt-6 rounded-[10px]'>
        <div
            title={isRunning ? 'Pause' : 'Start'}
            className={`text-gray-400 min-w-0 flex items-center  hover:cursor-pointer dark:hover:text-yellow-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <CircularProgress className="text-black " size={24}/> 
              </div>
            ) : isRunning ? (
              <span className="text-black">
              Pause
              </span>
            ) : (
              <span className="text-black">
              Play
              </span>
            )}
          </div>
  
          <div
              className=" font-poppins text-[#111827] hover:text-gray-600 capitalize flex items-center  hover:cursor-pointer"
              onClick={handleOpen}            >
              Delete
            </div>
        </Box>
      </Popper>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="w-full h-full justify-items-center content-center"
        >
          <div
            class="block"
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
        <Toaster  position="bottom-right"/>
    </Box>
  );
}


