

import { AppProvider, useApp } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {

  return (
    <>
      <AuthProvider>
        <AppProvider>
            {children}
        </AppProvider>
      </AuthProvider>
    </>
  );
}
