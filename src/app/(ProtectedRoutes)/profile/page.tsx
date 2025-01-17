'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import withAuth from '@/components/withAuth'
import { useApp } from '@/context/AppContext'
import Loader from '@/components/loader'
import logoutIcon from "@/assets/logoutIcon.svg"
import github from "@/assets/github.png"
import gdrive from "@/assets/googledrive.png"
import huggingface from "@/assets/huggingface.png"
import profileIcon from "@/assets/profileIcon.svg"
import AccountButton from '@/components/accountButton'
import { useAuth } from '@/context/AuthContext'
import { DeleteModal } from '@/components/delete-modal'
import { toast } from 'react-hot-toast'
import { Box, CircularProgress, Modal } from '@mui/material'
import trianlgeAlert from "@/assets/trianlge-alert.svg" 
import { Input } from '@/components/ui/input'

function ProfilePage() {
  const { fetchUserDetails, isloading, setUser } = useApp()
  const { logout, user } = useAuth()
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Add your account deletion logic here
      // For example: await deleteAccount(user.id)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
      closeDeleteModal()
      logout()
      router.push('/') // Redirect to home page after successful deletion
      toast.success('Account deleted successfully')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }
  


  if (isloading) return <Loader />

  return (
    <div className="h-screen min-h-[92dvh] bg-background lg:p-4 bg-neutral-100">
      <Card className="mx-auto max-w-2xl border-none shadow-none bg-neutral-100">
        <CardHeader className="space-y-6">
          <div className="items-center gap-4 lg:flex">
            <Avatar className="h-20 w-20 hidden lg:block">
              <AvatarFallback>
                <Image alt='profileIcon' src={profileIcon || "/placeholder.svg"} width={96} height={96} />
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
              <div className="border-b pb-1">
                <span className="text-sm font-medium text-[#6B7280]">Full Name</span>
                <div className="col-span-2 text-[14px] border lg:border-none rounded-[8px] bg-white lg:bg-neutral-100 px-2 lg:px-0 py-2">
                  {user?.full_name}
                </div>
              </div>
              <div className="border-b pb-1">
                <span className="text-sm font-medium text-[#6B7280]">Email Address</span>
                <div className="col-span-2 text-[14px] border lg:border-none rounded-[8px] bg-white lg:bg-neutral-100 px-2 lg:px-0 py-2">
                  {user?.email}
                </div>
              </div>
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
              <AccountButton account={{ id: 1, name: "Github", icon: github }} userName={user?.gh_username} api={'gh'} />
              <AccountButton account={{ id: 1, name: "Google Drive", icon: gdrive }} userName={user?.google_username} api={'google'} />
              <AccountButton account={{ id: 1, name: "Hugging Face", icon: huggingface }} userName={user?.hf_username} api={'hf'} />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {/* <Button className='bg-[#EF4444] w-full lg:w-auto' onClick={handleLogout}>
              <Image
                src={logoutIcon || "/placeholder.svg"}
                alt='logoutIcon'
              />
              Log Out
            </Button> */}
            <Button className='bg-[#EF4444] w-full lg:w-auto' onClick={openDeleteModal}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>

    <Modal
     open={isDeleteModalOpen}
     onClose={closeDeleteModal}
     aria-labelledby="modal-modal-title"
     aria-describedby="modal-modal-description"
     className="w-full h-full justify-items-center content-center"
   >
     <div className="p-6 bg-white shadow-xl rounded-[10px] item-center lg:w-[588px] m-4">
       <p className=" flex  gap-2 items-center pr-10 pb-4 text-[18px] lg:text-[20px] font-semibold text-[#111827]">
        <Image
        alt="triangle-alert" 
        src={trianlgeAlert}
        className=""/>
         <span className='pt-1 capitalize'>Log Out</span>
       </p>
       <p className="pb-4 text-[#374151] text-[15px] lg:text-base">
       This action cannot be undone. Please type the User&apos;s name to confirm deletion:
       </p>
       <form onSubmit={handleDeleteAccount}>
         <Box className="flex w-full justify-end gap-4 pt-4">
           <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={closeDeleteModal}>Cancel</Button>
           <Button 
             variant="outline" 
             className='bg-[#EF4444] text-neutral-100 capitalize' 
             onClick={handleDeleteAccount}
             disabled={isDeleting}
           >
             {isDeleting ? (
               <>
                 <CircularProgress size={16} color="inherit" className="mr-2" />
                 logging out...
               </>
             ) : (
               `Log Out`
             )}
           </Button>
         </Box>
       </form>
     </div>
   </Modal>
    </div>
  )
}

export default withAuth(ProfilePage)

