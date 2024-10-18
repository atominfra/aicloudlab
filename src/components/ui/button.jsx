import { Button } from '@mui/material'
import React from 'react'

export default function button({text,onclickhandler,customCss}) {
  return (
    <Button
      variant="contained"
      className={` bg-[#1976D2] text-white  text-base  font-semibold font-poppins p-3 rounded-[10px] ${customCss}`}
      onClick={onclickhandler}
      style={{ textTransform: 'none' }}
    >
      {text}
    </Button>
  )
}
