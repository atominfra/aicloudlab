'use client'
import { useRouter } from 'next/navigation'
import React from 'react'


export default function Page(props) {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard/notebooks');
  }, [router]);

  return <div></div>;
}
