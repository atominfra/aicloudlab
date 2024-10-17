'use client'; // Ensure this is at the top of the file

import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [notebooks, setNotebooks] = useState([
      { id: 1, name: 'Machine Learning Basics', version: 'Python 1.1.2', isActive: true },
      { id: 2, name: 'Deep Learning', version: 'Python 1.1.8', isActive: true },
      { id: 3, name: 'Data Science', version: 'Python 1.1.3', isActive: true }
    ]);

    return (
        <GlobalContext.Provider value={{ notebooks, setNotebooks }}>
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
