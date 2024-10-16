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
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#1f2937', // Replace with your image path
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        color: 'white' 
      }}>
        <CircularProgress color='white' />
      </div>
    );
  }

  if (!isSupported) {
    return <NotSupported />;
  }

  return <>{children}</>;
}
