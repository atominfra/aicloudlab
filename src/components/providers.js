"use client";
import { ThemeProvider } from "next-themes";
 import { SessionProvider } from "next-auth/react";

 export const AuthProvider = ({ children }) => {
    return <>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
         <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
</>
 };