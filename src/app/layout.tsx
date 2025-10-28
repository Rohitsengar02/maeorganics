'use client'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ReactLenis } from "@studio-freight/react-lenis";
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scrollbar-hide">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caprasimo&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased scrollbar-hide" suppressHydrationWarning={true}>
        <ReactLenis root>
          {children}
        </ReactLenis>
        <Toaster />
        <MobileBottomNav />
      </body>
    </html>
  );
}
