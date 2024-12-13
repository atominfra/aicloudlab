'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  const router = useRouter()
  router.push('/dashboard/notebooks')
  return (
    <div></div>
  )
}