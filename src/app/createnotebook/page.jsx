'use client';
import React, { useState } from 'react';
import { Button, Typography, Box, TextField, Select, MenuItem } from '@mui/material';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RiArrowDropDownLine } from "react-icons/ri";

export default function CreateNotebook() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '',
    packages: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleCreateClick = () => {
    router.push('/dashboard');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace with the actual API endpoint
      const response = await axios.post('/api/notebooks', formData);
      console.log('Notebook created:', response.data);
      // Add success handling, such as showing a message or redirecting
    } catch (error) {
      console.error('Error creating notebook:', error);
      // Add error handling, such as showing an error message
    }
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
        <Typography variant="h6" className="font-semibold bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center ">
          K
        </Typography>
      </Box></Box>
      
      <Box className="w-full max-w-md">
        <Typography variant="h4" className="text-white mb-6 text-center font-poppins">
          Creating a new notebook
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
              className: 'bg-gray-800 text-white '
            }}
            InputLabelProps={{
              sx: {
                color: 'white',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: 'white' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
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
              className: 'bg-gray-800 text-white'
            }}
            InputLabelProps={{
              sx: {
                fontFamily: 'poppins',
                color: 'white',
                '&.Mui-focused': { color: 'white' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
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
            className="bg-gray-800 text-white font-poppins"
            IconComponent={(props) => (
              <RiArrowDropDownLine {...props} style={{ color: 'white', fontSize: '30px' }} />
            )}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            }}
          >
            <MenuItem disabled value="">Select Python Version</MenuItem>
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
            className="bg-gray-800 text-white font-poppins"
            IconComponent={(props) => (
              <RiArrowDropDownLine {...props} style={{ color: 'white', fontSize: '30px' }} />
            )}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            }}
          >
            <MenuItem disabled value="">Select Packages</MenuItem>
            <MenuItem value="numpy">Numpy</MenuItem>
            <MenuItem value="pandas">Pandas</MenuItem>
            <MenuItem value="scikit-learn">Scikit-Learn</MenuItem>
            <MenuItem value="matplotlib">Matplotlib</MenuItem>
          </Select>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-[#1976D2] text-white text-base w-full font-semibold font-poppins rounded-lg p-3 mt-4"
            onClick={handleCreateClick}
          >
            Create Notebook
          </Button>
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
