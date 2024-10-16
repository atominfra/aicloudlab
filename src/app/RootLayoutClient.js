'use client';

import { useEffect, useState } from 'react';
import NotSupported from './components/notSupported';
import { CircularProgress } from '@mui/material';

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
      <div className="w-screen h-screen bg-gray-800 bg-cover bg-center flex justify-center items-center text-white">
        <CircularProgress color="inherit" />
      </div>

    );
  }

  if (!isSupported) {
    return <NotSupported />;
  }

  return <>{children}</>;
}
