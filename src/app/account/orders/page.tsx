
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, FileDown } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
                className="transition-all hover:shadow-lg rounded-2xl"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-bold text-lg text-[#2d2b28]">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                       <Badge className={cn("text-xs mt-2", getStatusVariant(order.status))}>
                          {order.status}
                      </Badge>
                    </div>
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="relative h-12 w-12 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                          <Image
                            src={item.product.image.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative h-12 w-12 flex items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className='flex-1 text-right'>
                            <p className="font-bold text-xl text-[#2d2b28]">
                                ${order.total.toFixed(2)}
                            </p>
                        </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button variant="outline" size="sm">
                        <FileDown className='mr-2 h-4 w-4' />
                        Download Invoice
                    </Button>
                    <Button onClick={() => router.push(`/account/orders/${order.id}`)}>
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
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

