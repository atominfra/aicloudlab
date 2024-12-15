'use client'; 

import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [notebooks, setNotebooks] = useState([]);
    const [user , setUser] = useState({})
    const [isloading, setIsloading] = useState(true)
    const [auth, setAuth] = useState(null);

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
  

    const fetchUserDetails = async () => {
        setIsloading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth}`,
            },
          });
      
          if (!response.ok) {
            // Attempt to parse the error body if possible
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user data');
          }
      
          const responseData = await response.json();
          console.log('responseData', responseData);
          setUser(user=>({...user, ...responseData.data}));
        } catch (error) {
          // Handle error of type `unknown`
          if (error instanceof Error) {
            console.error('Error fetching user data:', error.message);
            // toast.error(`${error.message}`,{position:"bottom-center"});
          } else {
            console.error('Unknown error occurred:', error);
            // toast.error('An unexpected error occurred.',{position:"bottom-center"});
          }
        } finally {
          setIsloading(false);
        }
      };

      useEffect(()=>{
        if(auth){
          fetchUserDetails()
        }
      },[auth])

      useEffect(()=>{
        console.log("user",user)
      },[user])


      const options = { 
        notebooks, 
        setNotebooks, 
        user, 
        setUser, 
        fetchUserDetails, 
        isloading, 
        auth,
        setAuth
      }
    return (
        <GlobalContext.Provider value={options}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};
