import './globals.css';
import Providers from './providers';
import { AbilityProvider } from './context/AbilityContext';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  // const user = session?.user || null;
  const user = { id: '123', role: 'guest' }; // no permissions


  return (
    <html lang="en">
      <body>
        <Providers>
          <AbilityProvider user={user}>
            {children}
          </AbilityProvider>
        </Providers>
      </body>
    </html>
  );
}
