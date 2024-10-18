'use client';

import { GlobalProvider } from '@/context/GlobalContext';

export default function RootLayoutClient({ children }) {


  return <>
        <GlobalProvider>
          {children}
        </GlobalProvider>
  </>;
}
