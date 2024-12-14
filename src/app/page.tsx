'use client';

import { useGlobal } from '@/context/global-context';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const {auth, setAuth} =  useGlobal()

  useEffect(() => {
    if (auth && auth !== '') {
      window.location.href = '/dashboard/notebooks';
    } else {
      window.location.href = '/login';
    }
  }, [auth]);

  return null; 
};

export default Home;
