'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/orders-api';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

function ThankYouPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!orderId) return;
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

  if (!orderId) return <div className="container mx-auto max-w-4xl px-4 py-16">Invalid order.</div>;
  if (loading) return <div className="container mx-auto max-w-4xl px-4 py-16">Loading...</div>;
  if (error) return <div className="container mx-auto max-w-4xl px-4 py-16 text-red-600">{error}</div>;

  const fmt = (v: number) => `₹${v.toFixed(2)}`;

  const handleDownloadInvoice = () => {
    // Simple print-to-PDF flow. Most browsers allow Save as PDF.
    // Narrow print to invoice section if possible.
    window.print();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <style>
        {`@media print { 
            body * { visibility: hidden; }
            #invoice-root, #invoice-root * { visibility: visible; }
            #invoice-root { position: absolute; left: 0; top: 0; width: 100%; }
        }`}
      </style>
      <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#2d2b28]">Thank you for your order!</h1>
            <p className="text-gray-600 mt-2">Order ID: {order._id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push('/shop')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => router.push('/account/orders')}>See All Orders</Button>
            <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
          </div>
        </div>

        <div id="invoice-root">
        <div id="invoice-area" ref={invoiceRef} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Customer</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{user?.fullName || order.address.fullName}</p>
              {user?.email && <p>Email: {user.email}</p>}
              {user?.phone && <p>Phone: {user.phone}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Delivery Address</h2>
            <div className="text-sm leading-6 text-gray-700">
              <p className="font-medium">{order.address.fullName}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
              <p>
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p>{order.address.country}</p>
              <p className="text-gray-600">Phone: {order.address.phone}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Payment</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Method: {order.payment.method.toUpperCase()}</p>
              <p>Status: {order.payment.status}</p>
              {order.payment.upiId && <p>UPI ID: {order.payment.upiId}</p>}
              {order.payment.transactionId && <p>Txn: {order.payment.transactionId}</p>}
            </div>
          </div>
        </div>

        <div className="mt-10" id="invoice-items">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((it: any) => (
              <div key={it.productId} className="flex items-center justify-between border rounded-lg p-4 bg-white/70">
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-gray-600">Qty: {it.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fmt(it.price)} x {it.quantity}</p>
                  <p className="text-sm text-gray-600">{fmt(it.price * it.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{fmt(order.amounts.subtotal)}</span></div>
            {order.amounts.discount > 0 && (
              <div className="flex justify-between text-green-700"><span>Discount</span><span>- {fmt(order.amounts.discount)}</span></div>
            )}
            <div className="flex justify-between"><span>Delivery</span><span>{order.amounts.shipping === 0 ? 'Free' : fmt(order.amounts.shipping)}</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{fmt(order.amounts.total)}</span></div>
          </div>

          <div className="mt-8 hidden print:block text-center text-gray-500 text-xs">Generated by Mae Organics</div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-16">Loading...</div>}>
      <ThankYouPageInner />
    </Suspense>
  );
}
