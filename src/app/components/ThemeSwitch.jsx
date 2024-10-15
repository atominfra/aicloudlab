'use client'
import { FaMoon } from "react-icons/fa"
import { BsSunFill } from "react-icons/bs"
import { useState, useEffect } from 'react'
import { dark } from "@mui/material/styles/createPalette"


export default function ThemeSwitch() {
  const [darkmode, setrDarkMode] = useState(true)

  useEffect(() => {
    const theme = localStorage.getItem("theme") 
    if(theme === 'dark'){
      setrDarkMode(true)
    }
  },[])

  useEffect(() => {
    if(darkmode){
      document.documentElement.classList.add('dark')
      localStorage.setItem("theme","dark")
    } else{
      document.documentElement.classList.remove('dark')
      localStorage.setItem("theme","light")
    }
  },[darkmode])

  return <div className="relative w-16 h-8 flex items-center bg-white dark:bg-gray-900  cursor-pointer rounded-full p-1"
  onClick={()=>setrDarkMode(!darkmode)}>
    <FaMoon className="text-black dark:text-white" size={18}/>
  </div>

}