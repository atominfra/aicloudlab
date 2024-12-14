'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserType = {
  id: string;
  full_name: string;
  email: string;
  credits: number;
  phone:string
  gh_username:string
  google_username:string
  hf_username:string
};

type NotebooksType = {
  id: string;
  name: string;
  notebook_url: string;
  python_version: string;
  status: "running" | "stopped" | "error";
}[];

type GlobalContextType = {
  notebooks: NotebooksType;
  setNotebooks: React.Dispatch<React.SetStateAction<NotebooksType>>;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  fetchUserDetails: () => Promise<void>;
  isloading: boolean;
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notebooks, setNotebooks] = useState<NotebooksType>([]);
  const [user, setUser] = useState<UserType>();
  const [isloading, setIsloading] = useState<boolean>(true);
  const [auth, setAuth] = useState<string | null>(null);

  useEffect(() => {
    if(typeof window !== "undefined"){

    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setAuth(storedToken);
    }
  
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
          Authorization: `Bearer ${auth}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const responseData = await response.json();
      console.log('responseData', responseData);
      setUser((prevUser) => ({ ...prevUser, ...responseData.data }));
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

  // Fetch user details on initial load
  useEffect(() => {
    if (auth) {
      fetchUserDetails();
    }
  }, [auth]); 

  // Log user changes
  useEffect(() => {
    console.log('user', user);
  }, [user]);

  // Prepare context value
  const value: GlobalContextType = {
    notebooks,
    setNotebooks,
    user,
    setUser,
    fetchUserDetails,
    isloading,
    auth,
    setAuth,
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