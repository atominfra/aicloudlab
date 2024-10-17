'use client';

import { useEffect, useState } from 'react';
import NotSupported from '../components/notSupported';
import LoadingPage from '../components/loadingPage';
import { GlobalProvider } from '@/context/GlobalContext';

export default function RootLayoutClient({ children }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  return <>
        <GlobalProvider>
          {children}
        </GlobalProvider>
  </>;
}
