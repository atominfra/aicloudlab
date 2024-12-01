'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Box, Modal, Button, TextField } from '@mui/material';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/navbar';
import NotebookItem from '@/components/NotebookItem';
import { useGlobalContext } from '@/context/GlobalContext';
import Image from 'next/image'
import notebook from '@/assets/notebook.svg'
import CircularProgress from '@mui/material/CircularProgress';
import withAuth from '@/components/withAuth';
import CreditsModal from '@/components/creditsModal';
import CustomButton from '@/components/ui/button';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const router = useRouter();
  const {notebooks, setNotebooks, credits, fetchCredits} = useGlobalContext();
  const [formData, setFormData] = useState({
    credits: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
  <>
  <Navbar />
    <Box className="flex flex-col items-center justify-center gap-8 h-[90vh] bg-transparent  text-[#111827]">
        <Box className=' lg:w-[626px] border-2 rounded-[20px] p-8'>
          <Box className='flex flex-col'>
            <span className='pb-5 font-bold text-[20px]'>Checkout</span>
            <div className=' w-full'>
              <div className='flex justify-between border-b px-1'>
                <span>Items</span>
                <span>Quantity</span>
              </div>
              <div className='flex justify-between text-[16px] px-1 pt-4'>
                <span>Credits</span>
                <span>500</span>
              </div>
              <div className='flex justify-between text-[16px] px-1 pt-14'>
                <span>Subtotal</span>
                <span>               
                  <span className='font-serif'>₹</span>
                  500</span>
              </div>
              <div className='flex justify-between text-[16px] px-1 pt-4'>
                <span>GST(18%)</span>
                <span>
                  <span className='font-serif'>₹</span>
                  90</span>
              </div>
              <div className='flex justify-between font-bold border-t text-[16px] px-1 pt-1 mt-4'>
                <span>Total</span>
                <span>
                  <span className='font-serif'>₹</span>
                  90</span>
              </div>
            </div>
          </Box>
          <Box className='flex w-full  gap-4 justify-between pt-8 items-center'>
            <Typography className='font-normal text-[10px] font-poppins text-[rgba(0,0,0,0.38)]'>By confirming, you agree to our payment policies.</Typography>
          <Box className="flex gap-4">
          <CustomButton text={'Back'} onclickhandler={() => router.push('/credits')} customCss='lg:w-[100px] w-full text-[15px] lg:text-[16px] text-black bg-[rgba(0,0,0,0.1)]'/>
          <CustomButton text={'Confirm'} onclickhandler={() => toast.success("transaction successfull",{position:"bottom-right"})} customCss='lg:w-[100px] w-full text-white text-[15px] lg:text-[16px]'/>
          </Box>
          </Box>
        </Box> 
    </Box>
    </>
  )
}


export default withAuth(CheckoutPage)
