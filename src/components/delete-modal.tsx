'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Box, CircularProgress, Modal } from '@mui/material'
import trianlgeAlert from "@/assets/trianlge-alert.svg" 

interface DeleteNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  name: string
  isLoading: boolean
  type:string
}

export function DeleteModal({ isOpen, onClose, onDelete, name, isLoading, type }: DeleteNodeModalProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("inputValue", inputValue,name)
    if (String(inputValue) === String(name)) {
      onDelete()
    }{
      console.log("name does not match")
    }
  }

  return (
   <>
     <Modal
     open={isOpen}
     onClose={onClose}
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
         <span className='pt-1 capitalize'>Delete {type}</span>
       </p>
       <p className="pb-4 text-[#374151] text-[15px] lg:text-base">
       This action cannot be undone. Please type the {type}&apos;s name to confirm deletion:
       </p>
       <div className='mb-4 h-[74px] p-4 lg:w-[535px] border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
         <div className='text-[#4B5563] text-sm'>{type} name:</div>
         <div className='font-medium text-[#111827] text-base'>{name}</div>
       </div>
       <form onSubmit={handleSubmit}>
         <Input 
             id="Confirm Name" 
             placeholder={`Type ${type} name to confirm`} 
             required 
             value={inputValue}
             onChange={handleInputChange}
             className="max-w-full placeholder:text-[#9CA3AF] text-sm "
           />
         <Box className="flex w-full justify-end gap-4 pt-4">
           <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={onClose}>Cancel</Button>
           <Button 
             variant="outline" 
             className='bg-[#EF4444] text-neutral-100 capitalize' 
             onClick={handleSubmit}
             disabled={isLoading}
           >
             {isLoading ? (
               <>
                 <CircularProgress size={16} color="inherit" className="mr-2" />
                 Deleting...
               </>
             ) : (
               `Delete ${type}`
             )}
           </Button>
         </Box>
       </form>
     </div>
   </Modal>
   </>
  )
}

