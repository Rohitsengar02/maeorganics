'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, MapPin, Package, User } from 'lucide-react';
import { notFound } from 'next/navigation';

import { orders, savedAddresses } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    notFound();
  }

  const {
    id,
    date,
    status,
    items,
    shippingAddress,
    billingAddress,
    subtotal,
    shipping,
    tax,
    total,
  } = order;

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Order Details</h1>
              <p className="text-sm text-gray-500">Order #{id} &bull; {new Date(date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Order Items ({items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                          <Image
                            src={item.product.image.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#2d2b28]">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
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
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold">{shippingAddress.name}</p>
                  <p>{shippingAddress.street}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Billing Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                   <p className="font-semibold">{billingAddress.name}</p>
                   <p>{billingAddress.street}</p>
                   <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
