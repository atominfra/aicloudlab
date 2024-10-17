'use client';
import React, { useState } from 'react';
import { Typography, Box, TextField, Select, MenuItem } from '@mui/material';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RiArrowDropDownLine } from "react-icons/ri";
import Navbar from '../../components/navbar';
import { useTheme } from 'next-themes';
import { useGlobalContext } from '@/context/GlobalContext';
import Button from '@/components/ui/button';
export default function CreateNotebook() {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();

  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '3.7',
    packages: 'numpy'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



  const handleSubmit = (event) => {
    event.preventDefault();

    const newNotebook = {
      id: Date.now(),
      name: formData.name,
      version: formData.pythonVersion,
      packages:formData.packages,
      isActive: 'true'
    };

    setNotebooks(notebooks=>[...notebooks,newNotebook])

    notebooks.push(newNotebook);
    router.push({
      pathname: '/dashboard',
    });
  };

  const handleCreateClick = () => {
    router.push('/dashboard');
  };

  const { resolvedTheme } = useTheme();

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white p-6">
      <Navbar/>
      
      <Box className="w-full max-w-md">
        <Typography variant="h4" className=" text-center text-3xl mb-10 font-poppins">
          Create Notebook
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} className="flex flex-col  gap-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
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
            label="Github URL"
            name="githubURL"
            value={formData.githubURL}
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
          <Select
            fullWidth
            name="pythonVersion"
            value={formData.pythonVersion}
            onChange={handleChange}
            displayEmpty
            variant="outlined"
            className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
            IconComponent={(props) => (
              <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark"?'white':'black', fontSize: '30px' }} />
            )}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' }
            }}
          >
            <MenuItem value="3.7">Python 3.7</MenuItem>
            <MenuItem value="3.8">Python 3.8</MenuItem>
            <MenuItem value="3.9">Python 3.9</MenuItem>
            <MenuItem value="3.10">Python 3.10</MenuItem>
          </Select>
          <Select
            fullWidth
            name="packages"
            value={formData.packages}
            onChange={handleChange}
            displayEmpty
            variant="outlined"
            className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
            IconComponent={(props) => (
              <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark"?'white':'black', fontSize: '30px' }} />
            )}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' }
            }}
          >
            <MenuItem disabled value="">Select Packages</MenuItem>
            <MenuItem value="numpy">Numpy</MenuItem>
            <MenuItem value="pandas">Pandas</MenuItem>
            <MenuItem value="scikit-learn">Scikit-Learn</MenuItem>
            <MenuItem value="matplotlib">Matplotlib</MenuItem>
          </Select>
        <Button text={'Create Notebook'} onclickhandler={handleCreateClick} customCss={'mt-6'}/>
        </Box>
      </Box>
      
      {/* <Box className="absolute bottom-8 right-8">
        <Image 
          src="/wrench-icon.png"
          width={80}
          height={80}
          alt="Wrench Icon"
        />
      </Box> */}
    </Box>
  );
}
