'use client';
import React from 'react';
import {  Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import NotebookItem from '@/components/NotebookItem';
import { useGlobalContext } from '@/context/GlobalContext';
import Button from "@/components/ui/button"

export default function NotebooksPage() {
  const router = useRouter();
  const { notebooks } = useGlobalContext();

  const handleCreateClick = () => {
    router.push('/create',);
  };

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white p-6">
      <Navbar />
      <Box className="w-[90%] text-end">
        <Button text={'+ Create'} onclickhandler={handleCreateClick}/>
      </Box>
      {notebooks.length > 0 ? (
        <Box className="w-full mt-6 flex justify-center items-center flex-col">
          {notebooks.map((notebook) => (
            <NotebookItem key={notebook.id} name={notebook.name} version={notebook.version} status={notebook.status} />
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
