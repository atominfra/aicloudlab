'use client'; // Ensure this is at the top of the file

import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [notebooks, setNotebooks] = useState([]);
    const [user , setUser] = useState({})
    useEffect(()=>{
        console.log("user",user)
    },[user])
    return (
        <GlobalContext.Provider value={{ notebooks, setNotebooks, user , setUser }}>
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
