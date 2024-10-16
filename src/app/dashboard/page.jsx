'use client';
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ThemeSwitch from '../../components/ThemeSwitch';
import Navbar from '../../components/navbar';
import NotebookItem from '../../components/NotebookItem';

const sampleNotebooks = [
  { id: 1, name: 'Machine Learning Basics', version: 'Python 1.1.2', isActive: 'true' },
  { id: 2, name: 'Deep Learning', version: 'Python 1.1.8', isActive: 'true' },
  { id: 3, name: 'Data Science', version: 'Python 1.1.3', isActive: 'false' }
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
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <Navbar />
      {/* <Box className="w-full text-center">
        <Image
          src={resolvedTheme === 'dark' ? '/path-to-dark-logo.png' : '/path-to-light-logo.png'}
          alt="Logo"
          width={200}
          height={100}
        />
      </Box> */}
      {/* <ThemeSwitch /> */}
      <Box className="w-full text-end">
        <Button
          variant="contained"
          className="bg-[#1976D2] text-white text-base font-semibold font-poppins shadow-md hover:shadow-md dark:hover:shadow-black dark:shadow-black rounded-lg"
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
            <NotebookItem key={notebook.id} name={notebook.name} version={notebook.version} isActive={notebook.isActive} />
          ))}
        </Box>
      ) : (
        <Box className="flex flex-col items-center">
          <Image
            src="/path-to-no-notebooks-image.png"
            alt="No Notebooks"
            width={100}
            height={100}
            className="w-16 h-20 bg-gray-900"
          />
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
    </Box>
  );
}
