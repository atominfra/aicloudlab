import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import { FaExternalLinkAlt } from "react-icons/fa";

export default function page() {
  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center p-6 text-white">
        {/* <Navbar/> */}
      <Box className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-6 border-b border-[#111827]">
          <div className="flex items-center gap-2">
            <Image
              src="https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png"
              width={50}
              height={50}
              alt="AI Cloud Lab Logo"
            />
            
          </div>
          <div className="rounded-full bg-gray-700 p-2">
            <i className="material-icons text-2xl">account_circle</i>
          </div>
        </div>

        {/* Notebook Info */}
        <div className="mt-6 flex flex-wrap justify-between">
          <div className="w-full md:w-1/2">
          <Typography variant="h4" className="font-semibold font-poppins">
              Notebook 1
            </Typography>
            <Typography variant="subtitle1" className="mb-1 font-poppins">
              Python version 2.2.0
            </Typography>
            <Link href="/notebook">
              <span className="text-gray-200  font-light underline flex items-center gap-1 font-poppins">Go to notebook <FaExternalLinkAlt /></span>
            </Link>

            {/* Packages Section */}
            <Typography variant="h5" className="mt-8 font-medium font-poppins">
              Packages
            </Typography>
            <Box className="border -[#111827] rounded-md p-4 mt-2 space-y-2">
              <li className="w-full bg-transparent border -[#111827] rounded-md px-3 py-2 text-white font-poppins">
                Package 1 package 1 name...
              </li>
              <li className="w-full bg-transparent border -[#111827] rounded-md px-3 py-2 text-white font-poppins">
                Package 2 package 2 name...
              </li>
              {/* Add more list items as needed */}
            </Box>
          </div>

          {/* Resource Usage */}
          <div className="w-full md:w-1/3 mt-6 md:mt-0">
            <Box className="border -[#111827] rounded-md p-4 space-y-4">
              <Box className="flex justify-between">
                <Typography variant="body2">STORAGE</Typography>
                <Typography variant="body2">7.8 GB/10 GB</Typography>
              </Box>
              <Box className="bg-gray-700 rounded-full h-2 w-full">
                <Box className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></Box>
              </Box>

              <Box className="flex justify-between">
                <Typography variant="body2">RAM</Typography>
                <Typography variant="body2">6 GB/10 GB</Typography>
              </Box>
              <Box className="bg-gray-700 rounded-full h-2 w-full">
                <Box className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></Box>
              </Box>

              <Box className="flex justify-between">
                <Typography variant="body2">CPU</Typography>
                <Typography variant="body2">1 GB/10 GB</Typography>
              </Box>
              <Box className="bg-gray-700 rounded-full h-2 w-full">
                <Box className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></Box>
              </Box>
            </Box>
          </div>
        </div>

        {/* Delete Notebook Button */}
        <div className="mt-6">
          
          <Button
            variant="contained"
            color="error"
            className="font-poppins rounded-[10px]"
          >
            Delete Notebook
          </Button>
        </div>
      </Box>
    </div>
  );
}
