'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ArrowLeft, FileDown, MapPin, User } from 'lucide-react';
import { getOfflineOrderById, updateOfflineOrder } from '@/lib/offline-orders-api';

export default function OfflineOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOfflineOrderById(id);
        if (res.success) setOrder(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Auto print when ?print=1 and order loaded
  useEffect(() => {
    if (search.get('print') === '1' && !loading && order) {
      const t = setTimeout(() => window.print(), 250);
      return () => clearTimeout(t);
    }
  }, [search, loading, order]);

  const fmt = (v: number) => `₹${(v ?? 0).toFixed(2)}`;

  const handleStatusUpdate = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await updateOfflineOrder(order._id, { status });
      if (res.success) setOrder(res.data);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div>
      <style>{`@media print { body * { visibility: hidden; } #invoice-root, #invoice-root * { visibility: visible; } #invoice-root { position:absolute; left:0; top:0; width:100%; } }`}</style>
      <PageHeader title={`Offline Order ${order._id.slice(-6)}`} description="Manage and print invoice for offline order.">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => window.print()}><FileDown className="h-4 w-4 mr-2" /> Invoice</Button>
        </div>
      </PageHeader>

      <main id="invoice-root" className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md bg-muted overflow-hidden">
                        {it.imageUrl ? (
                          <Image src={it.imageUrl} alt={it.name} fill className="object-contain p-1" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{fmt(it.price)} x {it.quantity}</p>
                      <p className="text-sm text-gray-600">{fmt(it.price * it.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(order.amounts.subtotal)}</span></div>
                {order.amounts.discount > 0 && (
                  <div className="flex justify-between text-green-700"><span>Discount</span><span>- {fmt(order.amounts.discount)}</span></div>
                )}
                <div className="flex justify-between"><span>Delivery</span><span>{order.amounts.shipping === 0 ? 'Free' : fmt(order.amounts.shipping)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>{fmt(order.amounts.total)}</span></div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">Created {new Date(order.createdAt).toLocaleString()}</CardFooter>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select onValueChange={handleStatusUpdate}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder={order.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Current: <span className="capitalize font-medium">{order.status}</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.customer?.fullName || '—'}</p>
              {order.customer?.email && <p>Email: {order.customer.email}</p>}
              {order.customer?.phone && <p>Phone: {order.customer.phone}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-gray-700">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-gray-700">
              <p className="font-semibold">{order.deliveryAddress.fullName}</p>
              <p>{order.deliveryAddress.addressLine1}</p>
              {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
              {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              <p>{order.deliveryAddress.country}</p>
              <p className="text-gray-600">Phone: {order.deliveryAddress.phone}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
