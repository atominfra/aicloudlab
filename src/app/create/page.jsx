'use client';
import React, { useState,useEffect } from 'react';
import { Typography, Box, TextField, Select, MenuItem, ButtonBase, CircularProgress, Popover } from '@mui/material';
import { useRouter } from 'next/navigation';
import { RiArrowDropDownLine } from "react-icons/ri";
import Navbar from '../../components/navbar';
import { useTheme } from 'next-themes';
import { useGlobalContext } from '@/context/GlobalContext';
import CustomButton from '@/components/ui/button';
import withAuth from '@/components/withAuth';
import CreditsModal from '@/components/creditsModal';

const CreateNotebook = () => {
  const router = useRouter();
  const { notebooks, setNotebooks, credits, fetchCredits  } = useGlobalContext();
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
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    if (credits < 1) {
      setShowModal(true);
    } else {
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
      name: formData.name,
      python_version: formData.pythonVersion,
      packages: formData.packages.split(',').map(pkg => pkg.trim())
    };

    if(formData.githubURL && formData.githubURL !== '') {
      payload = {...payload, github_url: formData.githubURL}
    }

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
      setIsLoading(false);
    }
  }
  };

  useEffect(()=>{
    fetchCredits()
  },[])
  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <Navbar />
      
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
            <Popover
              id="mouse-over-popover"
              sx={{ pointerEvents: 'none', m: 1 }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography sx={{ p: 1 }}>Feature coming soon</Typography>
            </Popover>
          <Select
          disabled
            fullWidth
            name="packages"
            title='Select packages (Coming Soon)'
            value={formData.packages}
            onChange={handleChange}
            displayEmpty
            variant="outlined"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
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
            customCss={`mt-6 ${isLoading===true ? 'bg-[#e3e3e3]':'bg-[#1976D2]'} text-white text-[15px] lg:text-[16px]`} 
            onclickhandler={handleSubmit}
            type="submit" 
          />

          
        </Box>
      </Box>
      <CreditsModal showModal={showModal} onClose={() => setShowModal(false)}/>

    </Box>
  );
}



export default withAuth(CreateNotebook)
