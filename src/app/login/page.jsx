'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomButton from "@/components/ui/button"
import { 
  Box, 
  Typography, 
  TextField, 
  Container, 
  CircularProgress
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
  const [auth, setAuth] = useState('');
  const [isloading, setIsloading] = useState(false)

  useEffect(() => {
    const token  = localStorage.getItem('access_token');
    if (token) {
      setAuth(token);
    }
  }, []);

  useEffect(() => {
    if (auth && auth !== '') {
      window.location.href = '/dashboard';
    } 
  }, [auth]);
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
    
    setIsloading(true)
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
        localStorage.setItem('user', JSON.stringify(responseData.data.user)); 
        localStorage.setItem('access_token', responseData.data.access_token);
        document.cookie = `access_token=Bearer ${responseData.data.access_token}; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; domain=.${window.location.hostname}`;
        window.location.href = '/dashboard' 
      } else {
        console.error("Login failed", responseData);
        setLoginError(responseData.message || 'An unexpected error occurred. Please try again.');
      }
      setIsloading(false)
    } catch (error) {
      console.error("Error during login", error);
      setLoginError('An unexpected error occurred. Please try again.'); 
      setIsloading(false)
    }
  };
  

  return (
    <Box className="h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white">
      <Container>
        <div className='flex flex-col lg:flex-row font-poppins gap-4 justify-between p-4'>
          <div className='flex lg:w-[35vw] justify-center items-center'>
            <Box className='flex flex-col  justify-center items-center gap-8'>
              <div>
              <Image
                src='https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729418783/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_2_sogohi.webp'
                width={200}
                height={200}
                className='w-[74px] h-[44px] lg:w-[12rem] lg:h-auto '
                alt="AI Cloud Lab Logo" />
              </div>
              <Typography className='hidden lg:block text-center text-xl font-light font-poppins'>
                Seamless AI <span className='font-semibold'>development, </span>
                <span className='font-semibold'>deployment </span>
                and <span className='font-semibold'>monitoring </span> in Cloud all through one interface!
              </Typography>
            </Box>
          </div>
          <div className='lg:w-[30vw] '>
            <Typography className='text-center text-[20px] lg:text-3xl mb-10 font-poppins font-semibold lg:font-normal'>
              Welcome to <span className='lg:font-bold'>AI Cloud Lab!</span>
            </Typography>
            <div  className='flex flex-col justify-center items-center gap-4'>
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
                <CustomButton 
                text={isloading=== true ? <>
                                <CircularProgress className="text-white" size={30}/> 
                                </>:
                                <>Login</>}  
                customCss={`w-full text-white text-[15px] lg:text-[16px] ${isloading===true ? 'bg-[rgba(17,24,39,0.32)]':'bg-[#1976D2]'}`} onclickhandler={handleLogin}/>
                <div className='text-[#111827] w-full flex items-center'>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                  <Typography className='font-poppins mx-1'>OR</Typography>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                </div>
                <CustomButton text={'Sign up for new account'} onclickhandler={() => window.location.href='/signup'} customCss='w-full text-white text-[15px] lg:text-[16px]'/>
              </Box>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  )
}
