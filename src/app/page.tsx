'use client';

import Loader from '@/components/loader';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const {auth,setAuth} = useApp();
  if(!auth){
    <Loader/>
  }
  useEffect(() => {
    if (auth && auth !== '') {
      window.location.href = '/dashboard/projects';
    } else {
      window.location.href = '/login';
    }
  }, [auth]);

  return null; 
};

export default Home;
