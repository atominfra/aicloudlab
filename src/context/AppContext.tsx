'use client'; 

import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';


const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [notebooks, setNotebooks] = useState([]);
    const [isloading, setIsloading] = useState(true)
    const [auth, setAuth] = useState(null);
    const {user, setUser} = useAuth();
    useEffect(() => {
      if(typeof window !== "undefined"){
  
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        console.log("atuh")
        setAuth(storedToken);
      }
    
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    }, []); 

    useEffect(() => {
      console.log("auth2",auth)
    }, [auth]);
  

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
          // @ts-expect-error error         
           setUser((prevUser: User) => ({...prevUser, ...responseData.data}));        
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

      useEffect(() => {
        const getNodePageStatus = async () => {
          try {
            const { data } = await axios.get('/api/getNodePageStatus');
            const s = data.key;
          } catch (error) {
            console.error('Error fetching node page status:', error);
          }
        };
    
        getNodePageStatus();
      }, []);


      const options = { 
        notebooks, 
        setNotebooks, 
        user, 
        setUser, 
        fetchUserDetails, 
        isloading, 
        setIsloading,
        auth,
        setAuth,
      }
    return (
        <AppContext.Provider value={options}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within a AppProvider');
    }
    return context;
};
