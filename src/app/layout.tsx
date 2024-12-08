"use client"

import { Provider } from "react-redux";
import { WalletProvider } from "./context/WalletContext";
import store from '@/app/stores';
import localFont from "next/font/local";
import "./globals.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

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

const ErrorBoundaryError: React.FC<{ error: unknown }> = ({ error }) => (
  <div className='grid h-full'>
    <div className='w-full h-full content-center text-center'>
      <h1 className='md:text-4xl text-xl font-bold'>Oops!</h1>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
      <div className='md:text-2xl text-md py-3'>Sorry, an unexpected error has occurred.</div>
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary fallback={ErrorBoundaryError}>
          <Provider store={store}>
            <WalletProvider>
              {children}
            </WalletProvider>
          </Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
