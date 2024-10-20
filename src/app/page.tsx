'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [auth, setAuth] = useState<string>('');

  useEffect(() => {
    const token: string | null = localStorage.getItem('access_token');
    if (token) {
      setAuth(token);
    }
  }, []);

  useEffect(() => {
    if (auth && auth !== '') {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, [auth]);

  return null; 
};

export default Home;
