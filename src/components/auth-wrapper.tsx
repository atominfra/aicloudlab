"use client"

import { useAuth } from "@/context/AuthContext"
import { CircularProgress } from "@mui/material"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <CircularProgress className="text-black" size={30}/>  
      </div>
    )
  }

  return <>{children}</>
}

