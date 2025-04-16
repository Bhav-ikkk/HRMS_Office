'use client';

import { SessionProvider } from 'next-auth/react';
import AbilityProvider from './components/AbilityProvider';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AbilityProvider>{children}</AbilityProvider>
    </SessionProvider>
  );
}
