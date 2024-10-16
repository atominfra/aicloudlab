import React from 'react';

const NotSupported = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      // backgroundImage: 'url(https://res.cloudinary.com/dy8hx2xrj/image/upload/v1728928735/dgjdxenss7ghprlroxhm.png)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundColor: '#111827', 
      color: 'white',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '2rem'
    }}>
      <p>This application is not supported on mobile or tablet devices. Please use a desktop to access the application.</p>
    </div>
  );
};

export default NotSupported;
