import { Button, Typography, Box, ButtonBase } from '@mui/material';
import { useEffect, useState } from 'react';
import { GoLinkExternal } from "react-icons/go";
import { IoMdPause } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import Link from 'next/link';
import { FaPlay } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function NotebookItem({ id, name, version, status, notebook_url, onOperation }) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRunning,setIsRunning] = useState(false) 
  // isRunning = 
  useEffect(()=>{
    setIsRunning(status)
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
    <Box className="flex items-center justify-between bg-white dark:bg-gray-800 text-[#111827] dark:text-white p-4 rounded-lg mb-2 w-[90%] border-2 border-[#111827] dark:border-0">
      <Box className='w-[16%]'>
        <Typography variant="body1" className="font-poppins">
          {name}
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        className={`text-[#111827] font-poppins capitalize font-bold`}
      >
        {status}
      </Typography>
      <Typography variant="body2" className="text-[#111827] dark:text-white font-poppins">
        Python {version}
      </Typography>
      <Box className="flex items-center justify-evenly font-poppins gap-10 w-[34%]">
        <ButtonBase
          title={isRunning ? 'Pause' : 'Start'}
          className={`text-gray-400 min-w-0 dark:hover:text-yellow-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span> 
          ) : isRunning ? (
            <IoMdPause className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' />
          ) : (
            <FaPlay className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' />
          )}
        </ButtonBase>
        
        <ButtonBase title='Delete' className="text-gray-400 min-w-0 dark:hover:text-yellow-500" onClick={() => onOperation(id, 'delete')}>
          <MdDelete className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' />
        </ButtonBase>

        <ButtonBase title='Coming Soon' className="text-gray-400 min-w-0 dark:hover:text-yellow-500" >
          <MdSettings className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' />
        </ButtonBase>

        <Link href={notebook_url} target='_blank'>
          <Button
            endIcon={<GoLinkExternal className='dark:hover:text-yellow-500 text-xl' />}
            className="dark:hover:text-yellow-500 font-poppins text-[#111827] dark:text-white underline capitalize"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Go to notebook
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
