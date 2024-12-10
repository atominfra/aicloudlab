'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Box, Modal, Button, TextField } from '@mui/material';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import NotebookItem from '@/components/notebook/NotebookItem';
import { useGlobalContext } from '@/context/GlobalContext';
import Image from 'next/image'
import notebook from '@/assets/notebook.svg'
import CircularProgress from '@mui/material/CircularProgress';
import withAuth from '@/components/withAuth';
import CreditsModal from '@/components/modals/creditsModal';
import CustomButton from '@/components/ui/button';

const CreditsPage = () => {
  const router = useRouter();
  const {user} = useGlobalContext();
  const [addCredits, setAddCredits] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { value } = e.target;
    console.log("credits",value)
    setAddCredits(value)
  };
  
  const handleClick = () => {
    console.log("credits", addCredits)
    router.push(`/checkout?value=${addCredits}`);
  };

  return (
  <>
  <Navbar />
    <Box className="flex flex-col items-center justify-center gap-8 h-[90vh] bg-transparent  text-[#111827]">
        <Box className=' lg:w-[626px] border-2 rounded-[20px] p-8'>
          <Box className='flex flex-col  '>
            <span className='pb-5 font-semibold text-[20px]'>Credit Balance</span>
            <span className='h-[50px] border border-[#1115275a] rounded-[5px] text-black w-full flex  items-center px-4 '>
              <span className='font-serif'>₹</span>
              {user?.credits}
              </span>
          </Box>
          <Box className='flex flex-col  pt-8'>
            <span className='pb-5 font-semibold text-[20px] '>Add Credits</span>
            <TextField
                fullWidth
                name="credits"
                type="text"
                id="credits"
                value={addCredits}
                onChange={handleChange}
                error={!!errors.user?.credits}
                helperText={errors.user?.credits}
                slotProps={{
                  input: {
                    startAdornment: (
                      <span className='font-serif pr-1'>₹</span>
                    ),
                  },
                }}
        
                InputProps={{
                  className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
                }}
                InputLabelProps={{
                  sx: {
                    color:  'black',
                    fontFamily: 'serif',
                    '&.Mui-focused': 'black' 
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': 'black',
                    '&:hover fieldset': 'black',
                    '&.Mui-focused fieldset': 'black'
                  }
                }}
              />
          </Box>
          <Box className='flex w-full justify-end pt-8'>
          <CustomButton text={'Proceed to Checkout'} onclickhandler={handleClick} customCss='lg:w-[229px] w-full text-white text-[15px] lg:text-[16px]'/>

          </Box>
        </Box> 
    </Box>
    </>
  )
}


export default withAuth(CreditsPage)
