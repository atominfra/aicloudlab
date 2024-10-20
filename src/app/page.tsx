'use client'
import { redirect } from 'next/navigation';

export default  function Home() {
  const auth = localStorage.getItem('access_token')
  if(auth !== ''){
    // redirect('/dashboard')
    window.location.href = '/login'
  }else{
    window.location.href = '/dashboard' 
  }
  return null; // Return null since the component won't render
}
