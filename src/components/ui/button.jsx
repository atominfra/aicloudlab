import { Button } from '@mui/material'
import React from 'react'

export default function CustomButton({text,onclickhandler,customCss,}) {
  return (
    <Button
      variant="contained"
      className={` bg-[#1976D2]  text-base  font-semibold font-poppins p-3 rounded-[15px] shadow-none ${customCss}`}
      onClick={onclickhandler}
      style={{ textTransform: 'none' }}
    >
      {text}
    </Button>
  )
}
