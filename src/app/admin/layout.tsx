
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from './components/Sidebar';
import AdminHeader from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The login page should not be protected by this layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AdminSidebar />
      </Sidebar>
      <div className='flex flex-1 flex-col'>
        <AdminHeader />
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
             {children}
            </div>
        </SidebarInset>
      </div>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
