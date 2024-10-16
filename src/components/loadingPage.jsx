import { CircularProgress } from '@mui/material'
import React from 'react'

export default function loadingPage() {
  return (
    <div className="w-screen h-screen bg-white dark:bg-gray-900 text-black dark:text-white bg-cover bg-center flex justify-center items-center ">
    <CircularProgress color="inherit" />
  </div>
  )
}
