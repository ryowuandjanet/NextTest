import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
