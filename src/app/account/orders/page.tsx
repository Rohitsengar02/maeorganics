
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
                <Card key={order._id} className="transition-all hover:shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#2d2b28] to-[#5a5854] text-white p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-lg">Order #{order._id.slice(-6)}</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' ? 'bg-green-500 text-white' :
                              order.status === 'processing' ? 'bg-yellow-500 text-white' :
                              order.status === 'cancelled' ? 'bg-red-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>{order.status}</span>
                          </div>
                          <p className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">Total Amount</p>
                          <p className="font-bold text-2xl">{fmt(order.amounts.total)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                      {/* Items Preview */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-sm text-gray-600">Order Items ({order.items.length})</h3>
                        </div>
                        <div className="space-y-3">
                          {order.items.slice(0, 3).map((item: any, index: number) => {
                            const isCombo = item.itemType === 'combo';
                            return (
                              <div key={index} className="rounded-lg bg-gray-50 p-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-14 w-14 flex-shrink-0 rounded-lg border-2 border-white bg-white overflow-hidden shadow-sm">
                                    {item.imageUrl ? (
                                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                                    )}
                                    {isCombo && (
                                      <div className="absolute top-0 right-0 bg-green-600 text-white text-[8px] px-1.5 py-0.5 rounded-bl-md font-bold">
                                        COMBO
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-[#2d2b28] truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} • {fmt(item.price)}</p>
                                  </div>
                                  <p className="font-semibold text-sm text-[#2d2b28]">{fmt(item.price * item.quantity)}</p>
                                </div>
                                
                                {/* Show combo products */}
                                {isCombo && item.comboProducts && item.comboProducts.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-[10px] font-semibold text-gray-600 mb-1.5">Includes:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.comboProducts.map((cp: any, cpIdx: number) => (
                                        <div key={cpIdx} className="inline-flex items-center gap-1 text-[10px] text-gray-700 bg-white rounded-full px-2 py-1 border border-gray-200">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                          <span className="font-medium">{cp.name}</span>
                                          <span className="text-gray-500">×{cp.quantity}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {order.items.length > 3 && (
                            <div className="text-center py-2 text-sm text-gray-500 bg-gray-50 rounded-lg">
                              +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-xs font-semibold text-blue-600 mb-1">Payment Method</p>
                          <p className="text-sm font-medium text-[#2d2b28] capitalize">{order.payment.method}</p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">Status: {order.payment.status}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                          <p className="text-xs font-semibold text-purple-600 mb-1">Delivery Address</p>
                          <p className="text-sm font-medium text-[#2d2b28] truncate">{order.address.fullName}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{order.address.city}, {order.address.state}</p>
                        </div>
                      </div>

                      {/* Delivery Progress */}
                      <div>
                        <h3 className="font-semibold text-sm text-gray-600 mb-3">Delivery Status</h3>
                        {order.status === 'cancelled' ? (
                          <div className="rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 text-center">
                            Order has been cancelled
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              {steps.map((s, i) => {
                                const current = statusIndex(order.status);
                                const done = i <= current;
                                return (
                                  <div key={s} className="flex-1 flex items-center">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                      done 
                                        ? 'bg-green-600 text-white border-green-600' 
                                        : 'bg-white text-gray-400 border-gray-300'
                                    }`}>
                                      {done ? '✓' : i+1}
                                    </div>
                                    {i < steps.length-1 && (
                                      <div className={`mx-2 h-2 flex-1 rounded-full transition-all ${
                                        i < current ? 'bg-green-600' : 'bg-gray-200'
                                      }`}></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                              {steps.map((s) => (
                                <span key={s} className="flex-1 text-center capitalize">{stepLabel[s]}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          onClick={() => router.push(`/account/orders/${order._id}?print=1`)}
                        >
                          <FileDown className='mr-2 h-4 w-4' />
                          Download Invoice
                        </Button>
                        <Button 
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white" 
                          onClick={() => router.push(`/account/orders/${order._id}`)}
                        >
                          View Full Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
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

