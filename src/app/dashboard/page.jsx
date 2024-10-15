"use client";
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import book from "../../assets/book.png";
import NotebookItem from "../../app/components/NotebookItem";
import { useRouter } from 'next/navigation';

const sampleNotebooks = [
  { id: 1, name: 'Machine Learning Basics', version: '1.1.2', isActive:'true' },
  { id: 2, name: 'Deep Learning', version: '1.1.8', isActive:'true' },
  { id: 3, name: 'Data Science', version: '1.1.3', isActive:'false' }
];

async function fetchNotebooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleNotebooks);
    }, 1000);
  });
}

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    console.log(notebooks)
  },[notebooks])

  useEffect(() => {
    fetchNotebooks()
      .then((data) => {
        setNotebooks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleCreateClick = () => {
    router.push('/createnotebook');
  };
  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-gray-900 text-white p-6">
      <Box className=" w-full p-4 flex justify-between">
        <Box className=" flex items-center">
        <Image 
        src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png" 
        width={1000}
        height={1000}
        className=' w-20 h-16'
        alt="AI Cloud Lab Logo" />
      </Box>

      <Box className="">
        <Typography variant="h6" className="font-semibold bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
          K
        </Typography>
      </Box></Box>
      <Box className=" w-full text-end">
        <Button
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreateClick}
        >
          + Create
        </Button>
      </Box>
      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : notebooks.length > 0 ? (
        <Box className="w-full mt-6">
          {notebooks.map((notebook) => (
            <NotebookItem key={notebook.id} name={notebook.name} version={notebook.version} isActive={notebook.isActive}/>
          ))}
        </Box>
      ) : (
        <Box className="flex flex-col items-center">
      <Image 
        src={book} 
        width={1000}
        height={1000}
        className='w-16 h-20 bg-gray-900'
        alt="AI Cloud Lab Logo" />
      <Typography variant="body1" className="text-gray-400 mb-4">
        No notebooks yet.
      </Typography>
      <Button
        variant="contained"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={handleCreateClick}
      >
        + Create
      </Button>
    </Box>
      )}

      {/* <Box className="absolute bottom-8 right-8">
        <Image 
          src={book}
          width={80}
          height={80}
          alt="Book Icon"
        />
      </Box> */}
    </Box>
  );
}
