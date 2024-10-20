'use client'
import { Box, Typography,  } from '@mui/material';
import Link from 'next/link';
import { FaExternalLinkAlt } from "react-icons/fa";
import Navbar from '@/components/navbar';
import CustomButton from '@/components/ui/button';
import withAuth from '@/components/withAuth';

const Notebook =() => {
  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white ">
        <Navbar/>
        {/* Header Section */}
        <Box className="w-[90%] text-start flex flex-col justify-center gap-2 p-6">
        <Typography variant="h4" className="font-bold font-poppins">
              Notebook 1
            </Typography>
            <Typography variant="subtitle1" className=" font-semibold font-poppins">
              Python version 2.2.0
            </Typography>
            <Link href="/notebook">
              <span className="text-[#111827]  font-light underline flex items-center gap-1 font-poppins">Go to notebook <FaExternalLinkAlt /></span>
            </Link>
      </Box>
      <Box className=" w-[90%]  flex flex-col justify-between  p-6">

        {/* Notebook Info */}
        <Typography variant="h5" className=" font-medium font-poppins">
              Packages
            </Typography>
        <div className=" flex flex-wrap justify-between items-center">
          <Box className="w-full md:w-1/2">
          

            {/* Packages Section */}
            
            <Box className="border-2 border-[#666666] rounded-[10px] p-4 mt-2 space-y-2">
              <li className="w-full bg-transparent border border-[#666666] rounded-[10px] px-3 py-2 text-white font-poppins ">
                Package 1 package 1 name...
              </li>
              <li className="w-full bg-transparent border border-[#666666] rounded-[10px] px-3 py-2 text-white font-poppins">
                Package 2 package 2 name...
              </li><li className="w-full bg-transparent border border-[#666666] rounded-[10px] px-3 py-2 text-white font-poppins">
                Package 2 package 2 name...
              </li><li className="w-full bg-transparent border border-[#666666] rounded-[10px] px-3 py-2 text-white font-poppins">
                Package 2 package 2 name...
              </li>
              {/* Add more list items as needed */}
            </Box>
          </Box>

          {/* Resource Usage */}
          <Box className="w-full md:w-1/3 mt-6 md:mt-0">
            <Box className="border-2 border-[#111827] rounded-md p-4 space-y-4">
              <Box className=''>
              <Box className="flex justify-between  ">
                  <Typography variant="body2">STORAGE</Typography>
                  <Typography variant="body2">7.8 GB/10 GB</Typography>
                </Box>
                <Box className='flex items-center gap-2'>
                    <Box className="bg-slate-200 rounded-full h-2 w-full">
                    <Box className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></Box>
                  </Box>
                  <Box className="font-poppins font-semibold text-sm" >78%</Box>
                </Box>
            </Box>

              <Box className=''>
              <Box className="flex justify-between  ">
                  <Typography variant="body2">RAM</Typography>
                  <Typography variant="body2">6 GB/10 GB</Typography>
                </Box>
                <Box className='flex items-center gap-2'>
                    <Box className="bg-slate-200 rounded-full h-2 w-full">
                    <Box className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></Box>
                  </Box>
                  <Box className="font-poppins font-semibold text-sm" >60%</Box>
                </Box>
             </Box>

             <Box className=''>
              <Box className="flex justify-between  ">
                  <Typography variant="body2">CPU</Typography>
                  <Typography variant="body2">1 GB/10 GB</Typography>
                </Box>
                <Box className='flex items-center gap-2'>
                    <Box className="bg-slate-200 rounded-full h-2 w-full">
                    <Box className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></Box>
                  </Box>
                  <Box className="font-poppins font-semibold text-sm" >10%</Box>
                </Box>
             </Box>
            </Box>
            
          </Box>
        </div>

        {/* Delete Notebook Button */}
        <div className="mt-6 bg-">
          <CustomButton text={'Delete Notebook'} onclickhandler={null} customCss={'bg-[#FF0000]'}></CustomButton>
        </div>
      </Box>
    </Box>
  );
}


export default withAuth(Notebook)