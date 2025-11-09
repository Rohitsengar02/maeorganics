'use client';

import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, MapPin, Package, User, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';
import { getOrderById, updateOrder } from '@/lib/orders-api';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderById(orderId);
        if (res.success) setOrder(res.data);
      } catch (e: any) {
        setError(e.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  // Auto print when ?print=1
  useEffect(() => {
    const p = searchParams.get('print');
    if (p === '1' && !loading && order) {
      setTimeout(() => window.print(), 200);
    }
  }, [searchParams, loading, order]);

  const fmt = (v: number) => `₹${v.toFixed(2)}`;
  const steps = ['created','processing','shipped','delivered'];
  const stepLabel: Record<string,string> = { created:'Created', processing:'Processing', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled' };
  const statusIndex = (status: string) => { const idx = steps.indexOf(status); return idx === -1 ? 0 : idx; };

  const handleCancel = async () => {
    if (!order) return;
    await updateOrder(order._id, { status: 'cancelled' });
    // reload
    const res = await getOrderById(orderId);
    if (res.success) setOrder(res.data);
  };

  const handleDownload = () => window.print();

  if (loading) return <div className="container mx-auto max-w-5xl px-4 py-12">Loading...</div>;
  if (error) return <div className="container mx-auto max-w-5xl px-4 py-12 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <style>{`@media print { body * { visibility: hidden; } #invoice-root, #invoice-root * { visibility: visible; } #invoice-root { position:absolute; left:0; top:0; width:100%; } }`}</style>
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Order Details</h1>
              <p className="text-sm text-gray-500">Order #{order._id.slice(-6)} • {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}><FileDown className="mr-2 h-4 w-4" /> Invoice</Button>
              {['created','processing'].includes(order.status) && (
                <Button variant="destructive" onClick={handleCancel}>Cancel Order</Button>
              )}
            </div>
          </div>
          
          <div id="invoice-root">
          <div id="invoice-area" ref={invoiceRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Order Items ({order.items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {order.items.map((item: any, index: number) => {
                      const isCombo = item.itemType === 'combo';
                      return (
                        <div key={index} className="border rounded-lg p-3 bg-white/50">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                              {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                              )}
                              {isCombo && (
                                <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                  COMBO
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-[#2d2b28]">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{fmt(item.price * item.quantity)}</p>
                          </div>
                          
                          {/* Show combo products if available */}
                          {isCombo && item.comboProducts && item.comboProducts.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 mb-2">Includes:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.comboProducts.map((cp: any, cpIdx: number) => (
                                  <div key={cpIdx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded p-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <span className="font-medium">{cp.name}</span>
                                    <span className="text-gray-500">x {cp.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Delivery Progress */}
                  <div className="mt-6">
                    {order.status === 'cancelled' ? (
                      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Order Cancelled</div>
                    ) : (
                      <>
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
                        <div className="mt-2 flex justify-between text-[11px] text-gray-600">
                          {steps.map((s) => (
                            <span key={s} className="flex-1 text-center capitalize">{stepLabel[s]}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{fmt(order.amounts.subtotal)}</span></div>
                  {order.amounts.discount > 0 && (
                    <div className="flex justify-between text-green-700"><span>Discount</span><span>- {fmt(order.amounts.discount)}</span></div>
                  )}
                  <div className="flex justify-between"><span>Delivery</span><span>{order.amounts.shipping === 0 ? 'Free' : fmt(order.amounts.shipping)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span>{fmt(order.amounts.total)}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>Delivery Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-gray-700">
                  <p className="font-semibold">{order.address.fullName}</p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                  <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  <p>{order.address.country}</p>
                  <p className="text-gray-600">Phone: {order.address.phone}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
