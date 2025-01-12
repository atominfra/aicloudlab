'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { createCloudAccount } from '@/app/api/cloud/api'
import { useApp } from '@/context/AppContext'
type CloudProvider = 'aws' | 'gcp' | 'azure'

interface CloudProviderFormProps {
  provider: CloudProvider
}

export default function CloudProviderForm({ provider }: CloudProviderFormProps) {
  const { auth } = useApp()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    name:'',
    api_key: '',
    jwt_token: '',
  })

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      const apiData = {
        name: data.name,
        provider: 'e2e',
        credentials: {
          api_key: data.api_key,
          jwt_token: data.jwt_token,
        },
      }

      const res = await createCloudAccount(auth, apiData)

      console.log('Azure account connected:', res)
      router.push('/dashboard/accounts')
    } catch (error) {
      console.error(error)
      console.log(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center  h-[92dvh]  '>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full ">
      <div className="text-center mb-8 relative">
        <h1 className="lg:text-2xl text-lg font-semibold mb-2">E2E Networks</h1>
      </div>

      <Card className="border-none shadow-none">
      <CardContent>
        <div className="pt-4">
          <form onSubmit={handelSubmit} className="space-y-4">
            {Object.keys(data).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field
                    .replace('_', ' ')
                    .toLowerCase()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Label>                
                <Input
                  id={field}
                  name={field}
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                  type={field === 'client_secret' ? 'password' : 'text'}
                  value={data[field as keyof typeof data]}
                  onChange={handleDataChange}
                  required
                />
              </div>
            ))}
            <div className='w-full text-end'>
            <Button type="submit" className=" bg-[#2563EB] " disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
    </div>
    </div>
    
  )
}
