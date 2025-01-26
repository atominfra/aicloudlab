'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import withAuth from '@/components/withAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const CreditsPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [addCredits, setAddCredits] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setAddCredits(value)
  }
  
  const handleClick = async () => {
    setIsLoading(true)
    try {
      await router.push(`/checkout?value=${addCredits}`)
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAdd = (amount: string) => {
    setAddCredits(amount)
  }

  return (
    <div className="lg:min-h-screen min-h-[92dvh]  bg-neutral-100 lg:p-4 flex justify-center items-center  ">
      <Card className="w-full max-w-3xl bg-neutral-100 shadow-none border-none">
        <CardHeader>
          <CardTitle className='text-lg lg:text-[24px] font-semibold'>Credits</CardTitle>
          <CardDescription className='hidden lg:block'>Manage and add credits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 bg-white p-6 rounded-[8px]">
            <Label className='text-[#6B7280] text-[14px] lg:text-base'>Available Credits</Label>
            <div className="text-3xl font-bold text-blue-600 font-sans">
            ₹{user?.credits?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className='bg-white p-6 rounded-[8px]'>
          <div className="space-y-4 ">
            <Label htmlFor="add-credits" className='text-[18px] font-medium'>Add Credits</Label>
            <div className='text-[14px] text-[#374151] font-medium'>Amount</div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-sans">₹</span>
              <Input
                id="add-credits"
                type="text"
                value={addCredits}
                onChange={handleChange}
                className="pl-7"
                placeholder="Enter amount"
              />
            </div>
            {errors.credits && <p className="text-sm text-red-500">{errors.credits}</p>}
          </div>
          <div className="py-4">
          <div className='text-[14px] text-[#374151] font-medium pb-4'>Quick Add</div>
          <div className="grid grid-cols-2 gap-2">
              {['50', '100', '200', '500'].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickAdd(amount)}
                  className='font-sans'
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>
          <Button 
            className="w-full bg-[#2563EB]" 
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Credits...
              </>
            ) : (
              'Add Credits'
            )}
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(CreditsPage)

