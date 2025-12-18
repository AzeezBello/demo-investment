import './globals.css';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';

const inter = localFont({
  src: '../public/fonts/Inter-VariableFont_slnt,wght.ttf',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
});

export const metadata = {
  title: 'ProfitBridge',
  description: 'Your bridge to smarter investments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}> 
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
