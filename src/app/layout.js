import './globals.css';
import Providers from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import DashboardLayoutWrapper from '@/components/DashboardLayout';

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  // const user = session?.user || null;
  


  return (
    <html lang="en">
      <body>
        <Providers>
          <DashboardLayoutWrapper>
            {children}
          </DashboardLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
