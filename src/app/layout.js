// 'use client'
import localFont from "next/font/local";
import "./globals.css";
import {AuthProvider} from './components/providers'
import NotSupported from '../app/components/notSupported'
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AI Cloud Lab",
  description: "Seamless AI development, deployment and monitoring in Cloud all through one interface!",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <NotSupported/>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
