'use server'
import { redirect } from 'next/navigation';

export default async function Home() {
  redirect('/login'); // Server-side redirect happens here
  return null; // Return null since the component won't render
}
