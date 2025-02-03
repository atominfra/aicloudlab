'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = Record<string, never>;

export default function Page(props: Props) {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/connect/node');
  }, [router]);

  return <div></div>;
}
