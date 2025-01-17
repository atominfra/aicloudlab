

import { AppProvider, useApp } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import RootLayout from './rootLayout';

export default function Providers({ children }) {

  return (
    <>
      <AuthProvider>
        <AppProvider>
          {/* <RootLayout> */}
            {children}
          {/* </RootLayout> */}
        </AppProvider>
      </AuthProvider>
    </>
  );
}
