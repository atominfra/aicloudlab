'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type UserType = Record<string, any>; // Replace `Record<string, any>` with a specific type if available
type NotebooksType = string[]; // Array of strings for notebooks

type GlobalContextType = {
  notebooks: NotebooksType;
  setNotebooks: React.Dispatch<React.SetStateAction<NotebooksType>>;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  fetchUserDetails: () => Promise<void>;
  isloading: boolean;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notebooks, setNotebooks] = useState<NotebooksType>([]);
  const [user, setUser] = useState<UserType>({});
  const [isloading, setIsloading] = useState<boolean>(true);

  // ------------------useEffects--------------------
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ------------------Functions--------------------
  const fetchUserDetails = async () => {
    setIsloading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const responseData = await response.json();
      console.log('responseData', responseData);
      setUser((user) => ({ ...user, ...responseData.data }));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching user data:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  const value: GlobalContextType = {
    notebooks,
    setNotebooks,
    user,
    setUser,
    fetchUserDetails,
    isloading,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
