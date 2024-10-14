// src/components/NotSupported.js

'use client'

import { useEffect, useState } from 'react';

const NotSupported = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Function to check the viewport width
    const handleResize = () => {
      if (window.innerWidth < 1024) { // Change 1024 to your preferred breakpoint
        setIsSupported(false);
      } else {
        setIsSupported(true);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Check on initial render
    handleResize();

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If the app is not supported, show the "Not Supported" screen
  if (!isSupported) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5rem',
        padding: '2rem'
      }}>
        <p>This application is not supported on mobile or tablet devices. Please use a desktop to access the application.</p>
      </div>
    );
  }

  // If the app is supported, return null (or could return children if needed)
  return null;
};

export default NotSupported;
