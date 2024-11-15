// components/MyButton.js
import { CircularProgress } from '@mui/material';
import Image from 'next/image'

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
    <CircularProgress className="text-black" size={30}/> 
  </div>
  );
}
