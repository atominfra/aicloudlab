'use client'
import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Container,
} from '@mui/material';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import CustomButton from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    reEnterPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.reEnterPassword) {
      newErrors.reEnterPassword = 'Please confirm your password';
    } else if (formData.reEnterPassword !== formData.password) {
      newErrors.reEnterPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    const { reEnterPassword, ...data } = formData;
console.log("data",reEnterPassword,data)
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(responseData.data.user)); 
        localStorage.setItem('access_token', responseData.data.access_token);
        window.location.href = '/dashboard' 
      } else {
        toast.error(responseData.message || 'Signup failed');
        setLoginError(responseData.message || 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error("Signup failed", responseData);
      setLoginError(responseData.message || 'An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    console.log("resolvedTheme", resolvedTheme);
  }, [resolvedTheme]);

  return (
    <Box className="h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Container>
        <div className='flex font-poppins gap-4 justify-between'>
          <div className='flex w-[35vw]'>
            <Box className='flex flex-col justify-center items-center gap-8'>
              <Image 
                src='https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729418783/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_2_sogohi.webp'
                width={1000}
                height={1000}
                className='w-[10rem]'
                alt="AI Cloud Lab Logo" 
              />
              <Typography className='text-center text-xl font-light font-poppins'>
                Seamless AI <span className='font-semibold'>development, </span> 
                <span className='font-semibold'>deployment </span>
                and  
                <span className='font-semibold font-poppins'> monitoring </span>
                in Cloud all through one interface!
              </Typography>
            </Box>
          </div>
          <div className='w-[30vw]'>
            <Typography className='text-center text-3xl mb-10 font-poppins'>
              Welcome to <span className='font-bold'>AI Cloud Lab!</span>
            </Typography>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
              <TextField
                name="full_name"
                fullWidth
                label="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
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
                name="email"
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
                name="phone"
                fullWidth
                label="Phone number"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
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
                name="password"
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
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
                name="reEnterPassword"
                fullWidth
                type="password"
                label="Re-Enter Password"
                value={formData.reEnterPassword}
                onChange={handleChange}
                error={!!errors.reEnterPassword}
                helperText={errors.reEnterPassword}
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
               {loginError && <Typography className="text-red-600">{loginError}</Typography>} 
              <Box className="w-full flex flex-col gap-4 mt-6">
              <CustomButton text={'Sign up'} onclickhandler={handleSubmit} customCss='w-full '/>
                <div className='text-[#111827] w-full flex items-center'>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                  <Typography className='font-poppins mx-1'>OR</Typography>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                </div>
                <CustomButton text={'Log in'} onclickhandler={() => window.location.href='/login'} customCss='w-full'/>
              </Box>
            </form>
          </div>
        </div>
      </Container>
      <Toaster position="top-center" reverseOrder={false} />
    </Box>
  );
}
