"use client"
import React, { useEffect, useState } from 'react';
import { Typography, Box, Modal, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import NotebookItem from '@/components/NotebookItem';
import CustomButton from "@/components/ui/button";
import { useGlobalContext } from '@/context/GlobalContext';
import Image from 'next/image';
import notebook from '@/assets/notebook.svg';
import CircularProgress from '@mui/material/CircularProgress';
import withAuth from '@/components/withAuth';

const NotebooksPage = () => {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();
  const [credits, setCredits] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCookieExpirationDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days); 
    return date.toUTCString(); 
  };

  const handleCreateClick = () => {
    if (credits < 1) {
      setShowModal(true);
    } else {
      router.push('/create');
    }
  };

  const fetchNotebooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setNotebooks(responseData.data.notebooks);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch notebooks');
      }
    } catch (err) {
      setError('An error occurred while fetching notebooks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch credits on page load
  const fetchCredits = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/credits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.data.credits); // Assuming `credits` is the field in response
      } else {
        setError('Failed to fetch credits');
      }
    } catch (err) {
      setError('An error occurred while fetching credits');
    }
  };

  useEffect(() => {
    fetchNotebooks();
    fetchCredits()
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token"); 
    if (access_token ) {
      document.cookie = `access_token=Bearer ${access_token}; path=/; domain=.${window.location.hostname}; expires=${getCookieExpirationDate(7)};`;
    }
  }, []);

  const handleOperationRequest = async (notebookId, operationName) => {
    try {
      console.log("operationName in dashboard",operationName)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          notebook_id: notebookId,
          operation_name: operationName,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }
      if(operationName === 'delete') {
        setLoading(true)
        fetchNotebooks()
        fetchCredits()
      }
      const result = await response.json();
      console.log('Operation successful:', result);
    } catch (error) {
      setError(error?.message);
    }
    fetchNotebooks()
    fetchCredits()
  };
  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Navbar />

      <Box className="w-[90%] text-end px-6 flex justify-between">
        <Typography variant="h4" className="font-bold font-poppins">
          Notebooks
        </Typography>
        <CustomButton text={'+ Create'} onclickhandler={handleCreateClick} />
      </Box>

      {loading ? (
        <Box className='flex justify-center items-center h-[60vh] w-full'>
          <CircularProgress color="inherit" />
        </Box>
      ) : notebooks.length > 0 ? (
        <Box className="w-full mt-6 flex justify-center items-center flex-col px-6">
          {notebooks.map((notebook) => (
            <NotebookItem 
              key={notebook?.id}
              id={notebook?.id} 
              name={notebook?.name} 
              version={notebook?.python_version} 
              notebook_url={notebook?.notebook_url}
              onOperation={handleOperationRequest}
              status={notebook?.status} 
            />
          ))}
        </Box>
      ) : (
        <Box className='flex flex-col gap-2 justify-center items-center h-[60vh] w-full'>
          <Image 
            src={notebook}
            width={1000}  
            height={1000}
            className='w-[100px] h-[100px]'
            alt="AI Cloud Lab Logo" 
          />
          <Typography variant="body1" className="text-gray-400 mb-4 px-6">
            No notebooks yet.
          </Typography>
        </Box>
      )}

      <Modal
          open={showModal} onClose={() => setShowModal(false)}
          className="w-full h-full justify-items-center content-center"
        >
          <Box className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-start justify-start w-[35vw] gap-4">
          <Typography className="text-black font-poppins font-semibold text-2xl">
          You are on free plan
          </Typography>
          <Typography className="text-gray-600 font-poppins text-lg ">
          Upgrade to Pro to create more notebooks         
          </Typography>
        <Box className="flex w-full justify-between gap-4">          
          <CustomButton text={'Maybe later'} onclickhandler={() => setShowModal(false)} customCss={' w-[50%] bg-[#e3e3e3]  text-black shadow-none'}/>
        <CustomButton text={'Upgrade '} onclickhandler={()=>{}} customCss={'w-[50%] bg-[#1976D2] '}/></Box>
        </Box>
        </Modal>  

    </Box>
  );
};

export default withAuth(NotebooksPage);
