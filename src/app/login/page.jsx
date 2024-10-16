'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from "@/components/ui/button"
import { 
  Box, 
  Typography, 
  TextField, 
  Container, 
} from '@mui/material';
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  const { resolvedTheme } = useTheme();

  
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
    <Box className=" h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <Container>
        <div className='flex font-poppins gap-4 justify-between '>
          <div   className='flex w-[35vw]'>
            <Box className='flex flex-col justify-center items-center gap-8'>
              <Image 
        src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'}
        width={1000}
              height={1000}
              className='w-[12rem]'
              alt="AI Cloud Lab Logo" />
              <Typography  className='text-center text-xl font-light font-poppins '>
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

              <Box className="w-full flex flex-col gap-4 mt-6"> 
                <Button text={'Login'} onclickhandler={handleclicklogin} customCss='w-full'/>
                {/* <Typography className='font-poppins'>OR</Typography> */}
                <div  className='text-[#111827] w-full flex items-center'>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                    <Typography className='font-poppins mx-1' >OR</Typography>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid black' }} />
                </div>
                <Button text={'Sign up for new account'} onclickhandler={handleclickSignup} customCss='w-full'/>
              </Box>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  )
}