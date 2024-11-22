'use client'; // Ensure this is at the top of the file

import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [notebooks, setNotebooks] = useState([]);
    const [user , setUser] = useState({})
    const [credits, setCredits] =useState(0)

    const fetchCredits = async () => {
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/credits`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
            },
        });
        if (response.ok) {
            const data = await response.json();
            setCredits(data.data.credits); 
        } 
        } catch (err) {
        console.log('An error occurred while fetching credits');
        }
    };

    useEffect(()=>{
        console.log("credits",credits)
    },[credits])

    return (
        <GlobalContext.Provider value={{ notebooks, setNotebooks, user , setUser, credits, setCredits, fetchCredits }}>
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
