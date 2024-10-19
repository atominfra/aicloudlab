'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { PiUserCircleFill } from "react-icons/pi";
import Navbar from '@/components/navbar';
import { useTheme } from 'next-themes';

interface User {
  full_name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const { resolvedTheme } = useTheme();
  
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('User details updated successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while updating user details');
    }
  };

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Navbar />
      <Box className="flex justify-center items-center gap-8 w-[90vw] h-[70vh]">
        <Box className='w-[25vw] flex justify-center items-center'>
          <PiUserCircleFill size={200} />
        </Box>
        <Box className="flex flex-col space-y-4 border-l-2 border-[#666666] p-10 pl-16 w-[40vw]">
          {user && (
            <>
              <Typography className=' p-4 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-black rounded-[10px]'>{user.full_name}</Typography>
              <Typography className=' p-4 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-black rounded-[10px]'>{user.email}</Typography>
              <Typography className=' p-4 bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-black rounded-[10px]'>{user.phone}</Typography>
            </>
          )}
          <Box className="pt-4">
            <Button
              variant="contained"
              color="error"
              fullWidth
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
