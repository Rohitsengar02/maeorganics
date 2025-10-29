'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { orders } from '@/lib/data';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">My Orders</h1>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => router.push(`/account/orders/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <p className="font-bold text-lg text-[#2d2b28]">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className='flex-1'>
                            <Badge className={cn("text-xs", getStatusVariant(order.status))}>
                                {order.status}
                            </Badge>
                            <p className="font-bold text-lg text-right sm:text-left mt-2 sm:mt-0">
                                ${order.total.toFixed(2)}
                            </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
