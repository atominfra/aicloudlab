import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Providers from '../app/Providers';
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/sidebar";
import {Poppins} from "@next/font/google";
const poppins =Poppins({
  subsets: ["latin"],
  weight: ["400","900","800","700","600","500","400","300","200"],
});


export const metadata = {
  title: "Atom Infra | Democratising Compute",
  description: "Seamlessly manage deployments across various providers through a consistent and user-friendly interface",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Google Tag Manager Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6R85ZEG6WD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6R85ZEG6WD');
        `}
        </Script>
      </head>
      <body className={`${poppins.className}  antialiased bg-white`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />

      </body>
    </html>
  );
}
