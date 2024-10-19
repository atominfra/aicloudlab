'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import NotebookItem from '@/components/NotebookItem';
import CustomButton from "@/components/ui/button";
import { useGlobalContext } from '@/context/GlobalContext';

export default function NotebooksPage() {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCreateClick = () => {
    router.push('/create');
  };

  useEffect(() => {
    // Fetch notebooks from the API
    const fetchNotebooks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Assuming you have an access token stored
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setNotebooks(responseData.data.notebooks); // Accessing 'data.notebooks' from the response
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

    fetchNotebooks();
  }, []);

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Navbar />

      <Box className="w-[90%] text-end px-6 flex justify-between">
        <Typography variant="h4" className="font-bold font-poppins">
          Notebook
        </Typography>
        <CustomButton text={'+ Create'} onclickhandler={handleCreateClick} />
      </Box>

      {loading ? (
        <Typography variant="body1" className="text-gray-400 mb-4 px-6">
          Loading...
        </Typography>
      ) : notebooks.length > 0 ? (
        <Box className="w-full mt-6 flex justify-center items-center flex-col px-6">
          {notebooks.map(({ notebook, status }) => (
            <NotebookItem 
              key={notebook?.id} 
              name={notebook?.name} 
              version={notebook?.python_version} 
              status={status} 
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" className="text-gray-400 mb-4 px-6">
          No notebooks yet.
        </Typography>
      )}
    </Box>
  );
}
