'use client';

import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingCart,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/admin/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <BaseSidebar>
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2">
            <span className="flex items-center justify-center h-8 w-8 bg-primary rounded-full text-primary-foreground font-bold text-lg">
                M
            </span>
            <span className="font-bold text-lg">Maeorganics</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
                  icon={<item.icon />}
                  tooltip={item.label}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/admin/settings" passHref>
                    <SidebarMenuButton icon={<Settings />} tooltip="Settings" isActive={pathname.startsWith('/admin/settings')}>
                        Settings
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/" passHref>
                    <SidebarMenuButton icon={<LogOut />} tooltip="Logout">
                        Logout
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </BaseSidebar>
  );
}
