
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, FileDown } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { getMyOrders } from '@/lib/orders-api';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMyOrders();
        if (res.success) setOrders(res.data);
      } catch (e: any) {
        setError(e.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading]);

  const fmt = (v: number) => `₹${v.toFixed(2)}`;
  const steps = ['created','processing','shipped','delivered'];
  const stepLabel: Record<string,string> = {
    created: 'Created',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  const statusIndex = (status: string) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  if (loading) return <div className="container mx-auto max-w-4xl px-4 py-12">Loading...</div>;

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

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!user && !authLoading && (
            <div className="rounded-2xl border bg-white/60 p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Please sign in to view your orders</h2>
              <p className="text-gray-600 mb-4">Your orders will appear here after you place them.</p>
              <Button onClick={() => router.push('/login')}>Sign In</Button>
            </div>
          )}

          {user && orders.length === 0 && !loading && (
            <div className="rounded-2xl border bg-white/60 p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-4">When you place an order, it will appear here.</p>
              <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
            </div>
          )}

          {user && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="transition-all hover:shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-bold text-lg text-[#2d2b28]">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border capitalize ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>{order.status}</span>
                          <div className='text-right font-bold text-xl text-[#2d2b28]'>{fmt(order.amounts.total)}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-4">
                          {order.items.slice(0, 4).map((item: any, index: number) => (
                            <div key={index} className="relative h-12 w-12 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                              {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="relative h-12 w-12 flex items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/account/orders/${order._id}?print=1`)}>
                            <FileDown className='mr-2 h-4 w-4' />
                            Invoice
                          </Button>
                          <Button onClick={() => router.push(`/account/orders/${order._id}`)}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Delivery Progress */}
                      <div className="mt-4">
                        {order.status === 'cancelled' ? (
                          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Order Cancelled</div>
                        ) : (
                          <div className="flex items-center justify-between">
                            {steps.map((s, i) => {
                              const current = statusIndex(order.status);
                              const done = i <= current;
                              return (
                                <div key={s} className="flex-1 flex items-center">
                                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
                                  {i < steps.length-1 && (
                                    <div className={`mx-2 h-1 flex-1 rounded ${i < current ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="mt-2 flex justify-between text-[11px] text-gray-600">
                          {steps.map((s) => (
                            <span key={s} className="flex-1 text-center capitalize">{stepLabel[s]}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

