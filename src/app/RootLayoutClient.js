'use client';

import { useEffect, useState } from 'react';
import NotSupported from './components/notSupported';
import LoadingPage from './components/loadingPage';

export default function RootLayoutClient({ children }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSupported(false);
      } else {
        setIsSupported(true);
      }
      setIsLoading(false); 
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <LoadingPage/>
    );
  }

  if (!isSupported) {
    return <NotSupported />;
  }

  return <>{children}</>;
}
