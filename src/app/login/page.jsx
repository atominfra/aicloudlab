'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomButton from "@/components/ui/button"
import { 
  Box, 
  Typography, 
  TextField, 
  Container 
} from '@mui/material';
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useGlobalContext } from '@/context/GlobalContext';

export default function Login() {

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const router = useRouter()
  const { resolvedTheme } = useTheme();
  const {  setUser } = useGlobalContext();

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.identifier)) {
      newErrors.identifier = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json(); 
  
      if (response.ok) {
        console.log("Login successful", responseData);
        setUser(responseData.data.user);
        localStorage.setItem('access_token', responseData.data.access_token);
        router.push('/dashboard');
      } else {
        console.error("Login failed", responseData);
        setLoginError(responseData.message || 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error("Error during login", error);
      setLoginError('An unexpected error occurred. Please try again.'); // Set error message for catch block
    }
  };
  

  return (
    <Box className="h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Container>
        <div className='flex font-poppins gap-4 justify-between'>
          <div className='flex w-[35vw]'>
            <Box className='flex flex-col justify-center items-center gap-8'>
              <Image
                src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'}
                width={1000}
                height={1000}
                className='w-[12rem]'
                alt="AI Cloud Lab Logo" />
              <Typography className='text-center text-xl font-light font-poppins'>
                Seamless AI <span className='font-semibold'>development, </span>
                <span className='font-semibold'>deployment </span>
                and <span className='font-semibold'>monitoring </span> in Cloud all through one interface!
              </Typography>
            </Box>
          </div>
          <div className='w-[30vw]'>
            <Typography className='text-center text-3xl mb-10 font-poppins'>
              Welcome to <span className='font-bold'>AI Cloud Lab!</span>
            </Typography>
            <form onSubmit={handleLogin} className='flex flex-col justify-center items-center gap-4'>
              <TextField
                required
                fullWidth
                id="identifier"
                label="Email or Phone number"
                name="identifier"
                autoComplete="identifier"
                autoFocus
                value={formData.identifier}
                onChange={handleChange}
                error={!!errors.identifier}
                helperText={errors.identifier}
                variant="outlined"
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
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
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
                {loginError && <Typography className="text-red-600">{loginError}</Typography>} 
              <Box className="w-full flex flex-col gap-4 mt-6">
                <CustomButton text={'Login'} customCss='w-full' onclickhandler={handleLogin}/>
                <div className='text-[#111827] w-full flex items-center'>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                  <Typography className='font-poppins mx-1'>OR</Typography>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                </div>
                <CustomButton text={'Sign up for new account'} onclickhandler={() => router.push('/signup')} customCss='w-full'/>
              </Box>
            </form>
          </div>
        </div>
      </Container>
    </Box>
  )
}
