'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserCircle2 } from 'lucide-react'
import withAuth from '@/components/withAuth'
import { useGlobalContext } from '@/context/GlobalContext'
import Loader from '@/components/loader'
import logoutIcon from "@/assets/logoutIcon.svg"
// Keep your existing imports for the icons
import github from "@/assets/github.png"
import gdrive from "@/assets/googledrive.png"
import huggingface from "@/assets/huggingface.png"

import profileIcon from "@/assets/profileIcon.svg"
import AccountButton from '@/components/accountButton'

function ProfilePage() {
  const { fetchUserDetails, isloading, user } = useGlobalContext()

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = `access_token=; path=/; domain=.${window.location.hostname}`
    window.location.href = "/"
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  if (isloading) return <Loader />

  return (
    <div className="min-h-screen bg-background p-4  bg-neutral-100">
      <Card className="mx-auto max-w-2xl border-none shadow-none bg-neutral-100">
        <CardHeader className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                <Image alt='profileIcon' src={profileIcon} width={96} height={96}  />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>Manage your account settings and connected services</CardDescription>
            </div>
          </div>
          <Separator />

        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="space-y-4">
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Full Name</span>
                <div className="col-span-2 text-[14px]  py-2">
                  {user?.full_name}
                </div>
              </div>
              <Separator />
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Email Address</span>
                <div className="col-span-2 text-[14px]  py-2">
                  {user?.email}
                </div>
              </div>
              <Separator />
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Phone Number</span>
                <div className="col-span-2 text-[14px]  py-2">
                  {user?.phone}
                </div>
              </div>
              <Separator />
            </div>
          </div>


          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#111827]">Connected Accounts</h3>
            <div className=" py-4">
            <AccountButton  account={ {id: 1, name: "Github", icon: github} } userName={user?.gh_username} api={'gh'} />
            <AccountButton  account={ {id: 1, name: "Google Drive", icon: gdrive} } userName={user?.google_username} api={'google'} />
            <AccountButton  account={ {id: 1, name: "Hugging Face", icon: huggingface} } userName={user?.hf_username} api={'hf'} /> 

            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button className='bg-[#FF0000]' onClick={handleLogout}>
              <Image
              src={logoutIcon}
              alt='logoutIcon'/>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(ProfilePage)

