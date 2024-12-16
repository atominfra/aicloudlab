'use client';
import React, { useState,useEffect } from 'react';
import { Typography, Box, TextField, Select, MenuItem, ButtonBase, CircularProgress, Popover } from '@mui/material';
import { useRouter } from 'next/navigation';
import { RiArrowDropDownLine } from "react-icons/ri";
import Navbar from '@/components/navbar/navbar';
import { useTheme } from 'next-themes';
import CustomButton from '@/components/button';
import CreditsModal from '@/components/modals/creditsModal';
import { useGlobalContext } from '@/context/GlobalContext';
import { createNoteboook } from '@/app/api/notebooks/api';
const CreateNotebook = () => {
  const router = useRouter();
  const { fetchUserDetails, setNotebooks, user, auth } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '3.7',
    packages: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [isNameTouched,setIsNameTouched] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'name' && value.trim() !== '') {
      setIsNameTouched(true); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsNameTouched(true); 
    // if (user?.credits < 1) {
    //   setShowModal(true);
    // } else {
    setError(null);
    setIsLoading(true);

    if (formData.name.includes('_') || formData.name.includes(' ')) {
      setError('Name cannot contain an underscore (_) or spaces.');
      setIsLoading(false);
      return;
    }

    if (formData.name === '') {
      setError('Please enter name');
      setIsLoading(false);
      return;
    }

    let payload = {
      name: formData.name || '',
      python_version: formData.pythonVersion || '',
      packages: formData.packages.split(',').map(pkg => pkg.trim()) || '',
      
    };

    if(formData.githubURL && formData.githubURL !== '') {
      // @ts-expect-error build
      payload = {...payload, github_url: formData.githubURL}
    }

    try {
      const response = await createNoteboook(auth,payload);
      console.log("rsponse",response)
      if (response) {
        router.push('/dashboard/notebooks')
      } else {
        setError('Failed to create notebook');
      }
    } catch (err) {
      setError('An error occurred while creating the notebook');
    } finally {
      setIsLoading(false);
    }
  // }
  };

  useEffect(()=>{
    fetchUserDetails()
  },[])
  return (
    <Box className="h-full w-full flex justify-center items-center ">
      {/* <Navbar /> */}
      
      <Box className="w-full max-w-lg p-6">
        <Typography variant="h4" className="text-center text-3xl mb-10 font-poppins ">
          Create Notebook
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            fullWidth
            title="Name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            error={isNameTouched && (formData.name === '' || formData.name.includes('_') || formData.name.includes(' '))}
            helperText={
              isNameTouched && formData.name === ''
                ? 'Name cannot be empty.'
                : isNameTouched && (formData.name.includes('_') || formData.name.includes(' '))
                ? 'Name cannot contain an underscore (_) or spaces.'
                : ''
            }          
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
            fullWidth
            label="Github URL (Optional)"
            title="Github URL"
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
              title="Python Version"
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
            name="packages"
            title='Select packages (Coming Soon)'
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
            <MenuItem disabled value="">Select Packages (Coming Soon) </MenuItem>
            <MenuItem value="numpy">Numpy</MenuItem>
            <MenuItem value="pandas">Pandas</MenuItem>
            <MenuItem value="scikit-learn">Scikit-Learn</MenuItem>
            <MenuItem value="matplotlib">Matplotlib</MenuItem>
          </Select>
          <CustomButton 
            disabled={isLoading}
            text={isLoading=== true ? <>
            <CircularProgress className="text-white" size={30}/> 
            </>:
            <>Create Notebook</>} 
            customCss={`mt-6 ${isLoading===true ? 'bg-[rgba(17,24,39,0.32)]':'bg-[#1976D2]'} text-white text-[15px] lg:text-[16px]`} 
            onclickhandler={handleSubmit}
          />

          
        </Box>
      </Box>
      <CreditsModal showModal={showModal} onClose={() => setShowModal(false)}/>

    </Box>
  );
}



export default (CreateNotebook)
