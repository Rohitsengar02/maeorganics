'use client';

import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  {
    icon: Package,
    label: 'My Orders',
    description: 'View your order history',
    href: '/account/orders',
  },
  {
    icon: MapPin,
    label: 'Shipping Addresses',
    description: 'Manage your shipping addresses',
    href: '/checkout/add-address',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    description: 'Manage your payment methods',
    href: '#',
  },
  {
    icon: Settings,
    label: 'Account Details',
    description: 'Update your profile information',
    href: '#',
  },
];

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">My Account</h1>
          </div>

          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/50">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-grow">
                    <h2 className="text-2xl font-bold text-[#2d2b28]">John Doe</h2>
                    <p className="text-gray-500">john.doe@example.com</p>
                    <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
                </div>
            </div>
            
            <Separator className="my-8" />

            <div className="space-y-4">
              {menuItems.map((item) => (
                <Card
                  key={item.label}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => router.push(item.href)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#2d2b28]">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="flex justify-center">
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300" onClick={() => router.push('/login')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
