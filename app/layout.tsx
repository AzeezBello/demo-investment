import './globals.css';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';

const inter = localFont({
  src: '../public/fonts/Inter-VariableFont_slnt,wght.ttf',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
});

export const metadata = {
  title: 'Demo-Investment - Smart Investment Platform',
  description: 'Demo-Investment is a cutting-edge investment platform designed for modern investors seeking secure, transparent, and profitable opportunities. Join us to take control of your financial future with innovative tools and insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <Toaster position="top-right" />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
