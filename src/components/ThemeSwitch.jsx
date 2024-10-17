// 'use client'
// import { FaMoon } from "react-icons/fa"
// import { BsSunFill } from "react-icons/bs"
// import { useState, useEffect } from 'react'
// import { dark } from "@mui/material/styles/createPalette"


// export default function ThemeSwitch() {
//   const [darkmode, setrDarkMode] = useState(true)

//   useEffect(() => {
//     const theme = localStorage.getItem("theme") 
//     if(theme === 'dark'){
//       setrDarkMode(true)
//     }
//   },[])

//   useEffect(() => {
//     if(darkmode){
//       document.documentElement.classList.add('dark')
//       localStorage.setItem("theme","dark")
//     } else{
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem("theme","light")
//     }
//   },[darkmode])

//   return <div className="relative w-16 h-8 flex items-center bg-white dark:bg-gray-900  cursor-pointer rounded-full p-1"
//   onClick={()=>setrDarkMode(!darkmode)}>
//     <FaMoon className="text-[#111827] dark:text-white" size={18}/>
//   </div>

// }

'use client'

import { FaMoon } from "react-icons/fa"
import { BsSunFill } from "react-icons/bs"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() =>  setMounted(true), [])

  if (!mounted) return (
    <Image
      src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
      width={36}
      height={36}
      sizes="36x36"
      alt="Loading Light/Dark Toggle"
      priority={false}
      title="Loading Light/Dark Toggle"
    />
  )

  if (resolvedTheme === 'dark') {
    return <BsSunFill onClick={() => setTheme('light')} className=""/>
  }

  if (resolvedTheme === 'light') {
    return <FaMoon onClick={() => setTheme('dark')} />
  }

}