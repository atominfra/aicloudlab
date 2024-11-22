import { Button } from '@mui/material'
import React from 'react'

export default function CustomButton({text,onclickhandler,customCss, disabled=false}) {
  return (
    <Button
      disabled={disabled}
      color='white'
      className={`  bg-[#1976D2] text-base  font-semibold font-poppins p-3 rounded-[15px] ${customCss}`}
      onClick={onclickhandler}
      style={{ textTransform: 'none' }}
    >
      {text}
    </Button>
  )
}
