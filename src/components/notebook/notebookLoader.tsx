import { Box, Typography } from "@mui/material";

export default function NoteBookLoader (){

  return <>
    <Box className='w-screen h-full flex flex-col justify-center items-center '>
       <Box>
        <div className="border  shadow-lg rounded-[26px] p-4 h-[159px] w-[134px] mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex flex-col gap-4 py-1 w-full items-end ">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-[30%]"></div>
          </div>
        </div>
      </div>
    <Typography className="text-[rgba(0,0,0,0.34)] font-bold text-[20px] pt-8 select-none">Loading Notebook</Typography>
       </Box>
    </Box>
  </>
}