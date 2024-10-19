'use client';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
} from '@mui/material';
import { RiPencilFill } from "react-icons/ri";
import Navbar from '@/components/navbar';
import { PiUserCircleFill } from "react-icons/pi";
import { useTheme } from 'next-themes';

export default function ProfilePage() {
  const { resolvedTheme } = useTheme();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
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
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
            }}
            InputLabelProps={{
              sx: {
                color: resolvedTheme === "dark"?'white':'black',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
              }
            }}
          />
          <TextField
            fullWidth
            label="E-mail Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
            }}
            InputLabelProps={{
              sx: {
                color: resolvedTheme === "dark"?'white':'black',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
              }
            }}
          />
          <TextField
            fullWidth
            label="Phone number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
            }}
            InputLabelProps={{
              sx: {
                color: resolvedTheme === "dark"?'white':'black',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
              }
            }}
          />
          <Box className="flex items-center gap-2">
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
              }}
              InputLabelProps={{
                sx: {
                  color: resolvedTheme === "dark"?'white':'black',
                  fontFamily: 'poppins',
                  '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                  '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                  '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
                }
              }}
            />
          </Box>
          {/* <Button
            endIcon={<RiPencilFill className='dark:hover:text-yellow-500 text-xl ' />}
            className=" dark:hover:text-yellow-500 font-poppins text-[#111827] dark:text-white  capitalize border-2 border-black"
            onClick={handleSubmit}
          >
            Reset Password
        </Button> */}
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
