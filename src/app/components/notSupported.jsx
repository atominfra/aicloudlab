import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react';

const NotSupported = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div 
      className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white text-center text-lg p-8"
      style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Image
        src={resolvedTheme === 'dark' 
          ? 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728900185/cloud-lab-high-resolution-logo-grayscale-transparent_ba6qdw.png'
          : 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729070176/cln14b1469_p3ymed.png'}
        width={1000}
        height={1000}
        className="w-20 h-16 mb-6"
        alt="AI Cloud Lab Logo"
      />
      <p>This application is not supported on mobile or tablet devices. Please use a desktop to access the application.</p>
    </div>
  );
};

export default NotSupported;
