
'use client';

import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { UserNav } from './user-nav';
import TeamSwitcher from './team-switcher';
import { MainNav } from './main-nav';

export default function AdminHeader() {
  const { isMobile } = useSidebar();

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
          <div className="hidden md:block">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
