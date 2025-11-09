'use client';

import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Package2,
  Users,
  BarChart,
  Settings,
  ChevronDown,
  Leaf,
  Tags,
  MessageSquare,
  Bell,
  TicketPercent,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useEffect, useMemo, useState } from 'react';
import { UserNav } from './user-nav';
import { Separator } from '@/components/ui/separator';
import { adminGetAllOrders } from '@/lib/orders-api';
import { getOfflineOrders } from '@/lib/offline-orders-api';
import { getAllReviews } from '@/lib/reviews-api';

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
    href: '/admin/combos',
    label: 'Combos',
    icon: Package2,
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    icon: MessageSquare,
  },
  {
    href: '/admin/notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Tags,
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
  {
    href: '/admin/contacts',
    label: 'Contacts',
    icon: MessageSquare,
  },
  {
    href: '/admin/discounts',
    label: 'Discounts',
    icon: TicketPercent,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    pathname.startsWith('/admin/settings')
  );
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, oo, r] = await Promise.all([
          adminGetAllOrders().catch(() => ({ success: true, data: [] })),
          getOfflineOrders().catch(() => ({ success: true, data: [] })),
          getAllReviews().catch(() => ({ success: true, data: [] })),
        ]);
        const orders = (o.success ? o.data : []).concat(oo.success ? oo.data : []);
        const reviews = r.success ? (r.data || []) : [];
        const since = Date.now() - 24 * 60 * 60 * 1000; // last 24h
        const recentOrders = orders.filter((x: any) => new Date(x.createdAt).getTime() >= since).length;
        const recentReviews = reviews.filter((x: any) => new Date(x.createdAt).getTime() >= since).length;
        setNotifCount(recentOrders + recentReviews);
      } catch {
        setNotifCount(0);
      }
    };
    load();
  }, []);

  return (
    <BaseSidebar className="bg-[#fdf8e8]">
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="font-bold text-lg">Mae Organics</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    // Special handling for the dashboard route to avoid matching all sub-routes
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                  }
                  tooltip={item.label}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.label}</span>
                    {item.href === '/admin/notifications' && notifCount > 0 && (
                      <span className="ml-auto text-xs rounded-full bg-red-600 text-white px-2 py-0.5">
                        {notifCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <Separator className="my-2" />
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Settings"
                    isActive={pathname.startsWith('/admin/settings')}
                    className="w-full"
                  >
                    <Settings />
                    Settings
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === '/admin/settings'}
                    >
                      <Link href="/admin/settings">
                        Store
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === '/admin/settings/home'}
                    >
                      <Link href="/admin/settings/home">
                        Home Page
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="group-data-[collapsible=icon]:hidden">
          <Separator className="my-2" />
          <div className="p-2">
            <UserNav />
          </div>
        </div>
      </SidebarFooter>
    </BaseSidebar>
  );
}
