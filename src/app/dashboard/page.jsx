'use client';
import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import NotebookItem from '@/components/NotebookItem';
import { useGlobalContext } from '@/context/GlobalContext';


export default function NotebooksPage() {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();

  const handleCreateClick = () => {
    router.push('/createnotebook',);
  };

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <Navbar />
      <Box className="w-[90%] text-end">
        <Button
          variant="contained"
          className="bg-[#1976D2] text-white text-base font-semibold font-poppins shadow-md hover:shadow-md dark:hover:shadow-black dark:shadow-black rounded-lg"
          onClick={handleCreateClick}
        >
          + Create
        </Button>
      </Box>
      {notebooks.length > 0 ? (
        <Box className="w-full mt-6 flex justify-center items-center flex-col">
          {notebooks.map((notebook) => (
            <NotebookItem key={notebook.id} name={notebook.name} version={notebook.version} isActive={notebook.isActive} />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" className="text-gray-400 mb-4">
          No notebooks yet.
        </Typography>
      )}
    </Box>
  );
}
