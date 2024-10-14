'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.ok) {
        console.log('Successfully signed in')
        toast.success('Successfully signed in!')
        
        setTimeout(() => {
          router.push(result.url || '/dashboard')
        }, 1500)
      } else {
        console.log('Sign in failed. Please check your credentials')
        toast.error('Sign in failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="mb-4 p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
      <Toaster />
    </form>
    
  )
}