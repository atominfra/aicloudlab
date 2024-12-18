'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGlobalContext } from '@/context/GlobalContext'
import withAuth from '@/components/withAuth'
import { Separator } from '@/components/ui/separator'

const CheckoutPage = () => {
  const router = useRouter()
  const { fetchUserDetails } = useGlobalContext()
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const searchParams = useSearchParams()
  const value = searchParams.get('value')

  const calculateGST = (amount: number) => (18 / 100) * amount
  const totalAmount = Number(value) + calculateGST(Number(value))

  useEffect(() => {
    if (!value) {
      toast.error('Payment amount not specified')
      router.push('/credits')
    }
  }, [value, router])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    try {
      setIsPaymentLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/credits`,
        {
          amount: value,
          currency: 'INR',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )

      const { data } = await axios.get('/api/getRazorpayKey')
      const razorpayKey = data.key

      const { order_id } = response.data.data
      const options = {
        key: razorpayKey,
        amount: totalAmount * 100,
        order_id,
        handler: async function (paymentResponse) {
          toast.success('Transaction successful!')
          console.log("paymentResponse", paymentResponse)
          await fetchUserDetails()
          router.push('/dashboard')
        },
      }
      // @ts-expect-error build
      const razorpay = new (window).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Error during payment:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 flex justify-center items-center">
      <Card className="w-full max-w-3xl shadow-none border-none bg-neutral-100">
        <CardHeader>
          <CardTitle className='text-[24px] font-semibold '>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-neutral-100 = rounded-[8px]">
          <div className="space-y-6 bg-white p-6 rounded-[8px]">
          <div className="space-y-4">
            <div className="flex justify-between pb-2 ">
              <span className="text-lg font-medium">Purchase Summary</span>
              {/* <span className="text-sm font-medium">Quantity</span> */}
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cloud Credits</span>
              <span className="text-sm">{value}</span>
            </div>
          </div>
            <Separator/>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-sans">₹{value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">GST (18%)</span>
              <span className="text-sm font-sans">₹{calculateGST(Number(value))}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total</span>
              <span className="font-medium font-sans">₹{totalAmount}</span>
            </div>
          </div>
          </div>

          <div className="flex items-center justify-between  px-6">
            <p className="text-xs text-muted-foreground">
              By confirming, you agree to our payment policies.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/credits')}
              >
                Cancel Order
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isPaymentLoading}
                className='bg-[#1976D2]'
              >
                {isPaymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>

    </div>
  )
}

export default withAuth(CheckoutPage)

