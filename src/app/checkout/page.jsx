'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { useGlobalContext } from '@/context/GlobalContext';
import CustomButton from '@/components/ui/button';
import toast from 'react-hot-toast';
import withAuth from '@/components/withAuth';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
const CheckoutPage = () => {
  const router = useRouter();
  const { fetchUserDetails, user } = useGlobalContext();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const searchParams = useSearchParams()
  const value = searchParams.get('value')
  const calculateGST = (amount) => (18 / 100) * amount;
  const totalAmount = Number(value) + calculateGST(Number(value));

  useEffect(() => {
    if (!value) {
      toast.error('Payment amount not specified. Redirecting...', { position: 'bottom-right' });
      router.push('/credits');
    }
  }, []);
  

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsPaymentLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/credits`, 
        {
          amount: value,
          currency: 'INR', 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
          },
        }
      );

      const { data } = await axios.get('/api/getRazorpayKey');
      const razorpayKey = data.key;

      const { order_id } = response.data.data;
      const options = {
        key: razorpayKey, 
        amount: totalAmount * 100, 
        order_id,
        handler: async function (paymentResponse) {
          toast.success('Transaction successful!', { position: 'bottom-right' });
          console.log("paymentResponse",paymentResponse)
          await fetchUserDetails(); 
          router.push('/dashboard')
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Payment failed. Please try again.', { position: 'bottom-right' });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box className="flex flex-col items-center justify-center gap-8 h-[90vh] bg-transparent text-[#111827]">
        <Box className="lg:w-[626px] border-2 rounded-[20px] p-8">
          <Box className="flex flex-col">
            <span className="pb-5 font-bold text-[20px]">Checkout</span>
            <div className="w-full">
              <div className="flex justify-between border-b px-1">
                <span>Items</span>
                <span>Quantity</span>
              </div>
              <div className="flex justify-between text-[16px] px-1 pt-4">
                <span>Credits</span>
                <span>{value}</span>
              </div>
              <div className="flex justify-between text-[16px] px-1 pt-14">
                <span>Subtotal</span>
                <span>
                  <span className="font-serif">₹</span>
                  {value}
                </span>
              </div>
              <div className="flex justify-between text-[16px] px-1 pt-4">
                <span>GST(18%)</span>
                <span>
                  <span className="font-serif">₹</span>
                  {calculateGST(Number(value))}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t text-[16px] px-1 pt-1 mt-4">
                <span>Total</span>
                <span>
                  <span className="font-serif">₹</span>
                  {totalAmount}
                </span>
              </div>
            </div>
          </Box>
          <Box className="flex w-full gap-4 justify-between pt-8 items-center">
            <Typography className="font-normal text-[10px] font-poppins text-[rgba(0,0,0,0.38)]">
              By confirming, you agree to our payment policies.
            </Typography>
            <Box className="flex gap-4">
              <CustomButton
                text={'Back'}
                onclickhandler={() => router.push('/credits')}
                customCss="lg:w-[100px] w-full text-[15px] lg:text-[16px] text-black bg-[rgba(0,0,0,0.1)]"
              />
              <CustomButton
                text={isPaymentLoading=== true ? <>
                  <CircularProgress className="text-white" size={16}/> 
                  </>:
                  <>Confirm</>}  
                onclickhandler={handlePayment}
                customCss={`lg:w-[100px] w-full text-white ${isPaymentLoading === true ? 'bg-[rgba(17,24,39,0.32)]':'bg-[#1976D2]'} text-[15px] lg:text-[16px]`}
                disabled={isPaymentLoading}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default withAuth(CheckoutPage);
