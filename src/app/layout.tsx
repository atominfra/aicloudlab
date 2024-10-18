import localFont from "next/font/local";
import "./globals.css";
import RootLayoutClient from '../app/RootLayoutClient'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
            {/* <AuthProvider> */}
          <RootLayoutClient>
            {children}
            </RootLayoutClient>
              {/* </AuthProvider> */}
      </body>
    </html>
  );
}
