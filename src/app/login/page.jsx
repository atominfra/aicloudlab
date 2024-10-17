'use client'
import { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'

import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
} from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image'
import Link from 'next/link'
import ThemeSwitch from '@/components/ThemeSwitch'
import { useTheme } from 'next-themes'
const BackgroundImage = styled(Box)({
  backgroundColor:'#111827',
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  backgroundRepeat: 'no-repeat', 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e) => {
    redirect('/dashboard')
    // e.preventDefault()
    // try {
    //   const result = await signIn('credentials', {
    //     email,
    //     password,
    //     redirect: false,
    //     callbackUrl: '/dashboard'
    //   })

    //   if (result?.ok) {
    //     console.log('Successfully signed in')
    //     toast.success('Successfully signed in!')
        
    //     setTimeout(() => {
    //       router.push(result.url || '/dashboard')
    //     }, 1500)
    //   } else {
    //     console.log('Sign in failed. Please check your credentials')
    //     toast.error('Sign in failed. Please check your credentials.')
    //   }
    // } catch (error) {
    //   console.error('Authentication error:', error)
    //   toast.error('An unexpected error occurred. Please try again.')
    // }
  }
  
  function handleclicklogin(){
    console.log("login clicked")
    router.push('/dashboard');
    // redirect('/dashboard')
  }
  function handleclickSignup(){
    router.push('/signup');
    // redirect('/signup')
  }
  return (
    <Box className=" h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-black dark:text-white ">
      <Container>
        <div className='flex font-poppins gap-4 justify-between '>
          <div   className='flex w-[40vw]'>
            <Box className='flex flex-col justify-center items-center gap-4'>
              <Image 
              src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png" 
              width={1000}
              height={1000}
              className='w-[14rem]'
              alt="AI Cloud Lab Logo" />
              <Typography  className='text-center text-2xl font-light font-poppins '>
                Seamless AI <span className='font-semibold'>development, </span> 
                <span className='font-semibold'>deployment </span>
                 and  
                 <span className='font-semibold font-poppins'> monitoring </span>
                  in Cloud all through one interface!
              </Typography>
            </Box>
          </div>
          <div   className='  w-[30vw] '>
          <Typography  className='text-center text-3xl mb-10 font-poppins'>
                Welcome to <span className='font-bold '>AI Cloud Lab!</span>
              </Typography>
            <div component="form" 
            // onSubmit={handleSubmit}
             className='flex flex-col justify-center items-center gap-4'>
              
              <TextField
                required
                fullWidth
                id="email"
                label="Email or Phone number"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                InputProps={{
                  className: 'bg-white dark:bg-gray-800 text-black dark:text-white rounded-[10px]'
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
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  className: 'bg-white dark:bg-gray-800 text-black dark:text-white rounded-[10px]'
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className=' bg-[#1976D2] text-white w-full text-base  font-semibold font-poppins p-3 mt-6 rounded-[10px]'
                onClick={handleclicklogin}
              >
                Login
              </Button>
              <Typography className='font-poppins'>OR</Typography>
              <Button
              onClick={handleclickSignup}
                fullWidth
                variant="contained"
                className=' bg-[#1976D2] text-white text-base w-full font-semibold font-poppins rounded-[10px]  p-3'
              >
                Sign up for new account
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  )
}