'use client';
import CustomButton from '@/components/ui/button';
import withAuth from '@/components/withAuth';
import { useGlobalContext } from '@/context/GlobalContext';
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";
import Navbar from '../../components/navbar';

const CreateNotebook = () => {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '3.7',
    packages: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (formData.name.includes('_') || formData.name.includes(' ')) {
      setError('Name cannot contain an underscore (_) or spaces.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      python_version: formData.pythonVersion,
      packages: formData.packages.split(',').map(pkg => pkg.trim()),
      github_url: formData.githubURL || ''
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        const newNotebook = {
          id: responseData.id,
          name: formData.name,
          version: formData.pythonVersion,
          packages: formData.packages,
          status: 'stop'
        };

        setNotebooks(prev => [...prev, newNotebook]);
        window.location.href='/dashboard'
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create notebook');
      }
    } catch (err) {
      setError('An error occurred while creating the notebook');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white p-6">
      <Navbar />
      
      <Box className="w-full max-w-md">
        <Typography variant="h4" className="text-center text-3xl mb-10 font-poppins">
          Create Notebook
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            title='Name'
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            required
            error={formData.name.includes('_') || formData.name.includes(' ')}
              helperText={(formData.name.includes('_') || formData.name.includes(' ')) ? 'Name cannot contain an underscore (_) or spaces.' : ''}

            InputProps={{
              className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
            }}
            InputLabelProps={{
              sx: {
                color: resolvedTheme === "dark" ? 'white' : 'black',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: resolvedTheme === "dark" ? 'white' : 'black' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&:hover fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' }
              }
            }}
          />

          <TextField
          disabled
            fullWidth
            label="Github URL "
            title= 'Coming Soon'
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
              title='Python Version'
              value={formData.pythonVersion}
              onChange={handleChange}
              displayEmpty
              variant="outlined"
              className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
              IconComponent={(props) => (
                <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark" ? 'white' : 'black', fontSize: '30px' }} />
              )}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' }
              }}
            >
              <MenuItem value="3.7">Python 3.7</MenuItem>
              <MenuItem value="3.8">Python 3.8</MenuItem>
              <MenuItem value="3.9">Python 3.9</MenuItem>
              <MenuItem value="3.10">Python 3.10</MenuItem>
            </Select>

          <Select
          disabled
            fullWidth
            title='Coming Soon'
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
          <CustomButton 
            text={'Create Notebook'} 
            customCss={'mt-6'} 
            onclickhandler={handleSubmit}
            type="submit" 
          />
          
        </Box>
      </Box>
    </Box>
  );
}



export default withAuth(CreateNotebook)
