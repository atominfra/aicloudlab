'use client'
import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Container, 
} from '@mui/material';
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Button from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const router = useRouter()
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    console.log("isClient",isClient)
    setIsClient(true);
  }, []);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleclickSignup = async () => {
    router.push('/dashboard')
  }
useEffect(()=>{
  console.log("resolvedTheme",resolvedTheme)
},[resolvedTheme])
  return (
      // <Box className='bg-white dark:bg-gray-900 text-[#111827] dark:text-white'>
      // <Navbar/>
    <Box className=" h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
      <Container>
        <div className='flex font-poppins gap-4 justify-between '>
        <div   className='flex w-[35vw]'>
            <Box className='flex flex-col justify-center items-center gap-8'>
              <Image 
        src={resolvedTheme === 'dark' ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png' : 'https://res.cloudinary.com/dsfu8suwl/image/upload/v1729192530/cloud-lab-high-resolution-logo-grayscale-transparent_1_-_Edited_a4pbfi.webp'}
        width={1000}
              height={1000}
              className='w-[10rem]'
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
          <div className='w-[30vw]'>
            <Typography className='text-center text-3xl mb-10 font-poppins'>
              Welcome to <span className='font-bold'>AI Cloud Lab!</span>
            </Typography>
            <form className='flex flex-col justify-center items-center gap-4'>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                id="email"
                label="Email"
                name="email"
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
                id="phoneNumber"
                label="Phone number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
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
              <TextField
                required
                fullWidth
                name="reEnterPassword"
                label="Re-Enter Password"
                type="password"
                id="reEnterPassword"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
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
<<<<<<< HEAD
              <Button text={'Sign up'} onclickhandler={handleclickSignup} customCss='w-full'/>
=======
              <Button text={'Sign up'} onclickhandler={handleclickSignup} customCss='w-full mt-6'/>
>>>>>>> fix/tailwind

            </form>
          </div>
        </div>
      </Container>
    </Box>
      // </Box>
  )
}
