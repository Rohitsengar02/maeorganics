'use client';

import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';
import TeamSwitcher from './team-switcher';
import { MainNav } from './main-nav';

const getTitleFromPathname = (pathname: string) => {
    if (pathname.startsWith('/admin/products')) return 'Products';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/customers')) return 'Customers';
    if (pathname.startsWith('/admin/analytics')) return 'Analytics';
    if (pathname.startsWith('/admin/settings')) return 'Settings';
    return 'Dashboard';
}

export default function AdminHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <header className={cn("sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg")}>
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-8">
        <div className="flex items-center">
          <SidebarTrigger className="mr-4" />
        </div>
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
