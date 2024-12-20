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
    <div className="lg:min-h-screen min-h-[84vh] bg-background  lg:p-4  bg-neutral-100">
      <Card className="mx-auto max-w-2xl border-none shadow-none bg-neutral-100">
        <CardHeader className="space-y-6">
          <div className=" items-center gap-4 lg:flex">
            <Avatar className="h-20 w-20 hidden lg:block">
              <AvatarFallback>
                <Image alt='profileIcon' src={profileIcon} width={96} height={96}  />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 ">
              <CardTitle className="lg:text-2xl text-xl">Profile Settings</CardTitle>
              <CardDescription className='hidden lg:block'>Manage your account settings and connected services</CardDescription>
            </div>
          </div>
          <Separator className='hidden lg:block' />

        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h3 className="lg:text-xl text-base font-semibold">Personal Information</h3>
            <div className="space-y-1">
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Full Name</span>
                <div className="col-span-2 text-[14px] border lg:border-none rounded-[8px] bg-white lg:bg-neutral-100 px-2 lg:px-0 py-2">
                  {user?.full_name}
                </div>
              </div>
              {/* <Separator /> */}
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Email Address</span>
                <div className="col-span-2 text-[14px] border lg:border-none rounded-[8px] bg-white lg:bg-neutral-100 px-2 lg:px-0 py-2">
                  {user?.email}
                </div>
              </div>
              {/* <Separator /> */}
              <div className="">
                <span className="text-sm font-medium text-[#6B7280]">Phone Number</span>
                <div className="col-span-2 text-[14px] border lg:border-none rounded-[8px] bg-white lg:bg-neutral-100 px-2 lg:px-0 py-2">
                  {user?.phone}
                </div>
              </div>
              <Separator className='hidden lg:block'/>
            </div>
          </div>


          <div className="space-y-4 pt-3">
            <h3 className="lg:text-xl text-base font-semibold text-[#111827]">Connected Accounts</h3>
            <div className=" ">
            <AccountButton  account={ {id: 1, name: "Github", icon: github} } userName={user?.gh_username} api={'gh'} />
            <AccountButton  account={ {id: 1, name: "Google Drive", icon: gdrive} } userName={user?.google_username} api={'google'} />
            <AccountButton  account={ {id: 1, name: "Hugging Face", icon: huggingface} } userName={user?.hf_username} api={'hf'} /> 

            </div>
          </div>

          <div className="flex justify-end ">
            <Button className='bg-[#FF0000] w-full lg:w-auto' onClick={handleLogout}>
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

