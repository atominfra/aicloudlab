'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import withAuth from '@/components/withAuth';


const Page = (props) => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard/');
  }, [router]);

  return <div></div>;
}

export default withAuth(Page)
