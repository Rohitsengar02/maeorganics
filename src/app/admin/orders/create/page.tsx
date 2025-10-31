'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { createOfflineOrder } from '@/lib/offline-orders-api';
import { getAuthHeaders } from '@/lib/api-helpers';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  images?: string[];
  currentPrice?: number;
  regularPrice?: number;
}

export default function AdminCreateOfflineOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [items, setItems] = useState<{ productId: string; name: string; imageUrl?: string; price: number; quantity: number }[]>([]);

  const [customer, setCustomer] = useState({ fullName: '', email: '', phone: '' });
  const [shipping, setShipping] = useState({ fullName: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', landmark: '', city: '', state: '', country: 'India' });
  const [delivery, setDelivery] = useState({ fullName: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', landmark: '', city: '', state: '', country: 'India' });

  const [payment, setPayment] = useState<{ method: 'cash' | 'upi' | 'card' | 'other'; status: 'paid' | 'pending'; notes?: string }>({ method: 'cash', status: 'paid', notes: '' });
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.price * it.quantity, 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount + shippingFee), [subtotal, discount, shippingFee]);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          (process.env.NODE_ENV === 'production'
            ? 'https://maeorganics.vercel.app'
            : 'http://localhost:5000');
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/products`, { headers });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.data || data.products || []);
      } catch (e: any) {
        setErr(e.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addItem = (p: Product) => {
    setItems((prev) => {
      const exists = prev.find((x) => x.productId === p._id);
      if (exists) {
        return prev.map((x) => (x.productId === p._id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      const price = p.currentPrice || p.regularPrice || 0;
      return [
        ...prev,
        {
          productId: p._id,
          name: p.name,
          imageUrl: p.images?.[0],
          price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, quantity: Math.max(1, qty) } : x)));
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((x) => x.productId !== productId));

  const handleSubmit = async () => {
    try {
      if (items.length === 0) return alert('Add at least one product');
      const payload = {
        items,
        customer,
        shippingAddress: shipping,
        deliveryAddress: delivery,
        payment,
        amounts: { subtotal, discount, shipping: shippingFee, total, currency: 'INR' },
        status: 'created' as const,
      };
      const res = await createOfflineOrder(payload);
      if (res.success) {
        router.push(`/admin/orders`);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to create order');
    }
  };

  return (
    <div>
      <PageHeader title="Create Offline Order" description="Record an offline sale with customer and address details." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading products...</div>
              ) : err ? (
                <div className="text-red-600 text-sm">{err}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p._id} className="rounded-lg border bg-white p-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-50">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-gray-600">₹{(p.currentPrice || p.regularPrice || 0).toFixed(2)}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => addItem(p)}>Add</Button>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-6" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Selected Items</h3>
                  {items.length > 0 && (
                    <div className="text-sm text-gray-600">Subtotal: ₹{subtotal.toFixed(2)}</div>
                  )}
                </div>
                {items.length === 0 ? (
                  <div className="text-sm text-gray-500">No items added.</div>
                ) : (
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div key={it.productId} className="flex items-center justify-between rounded border p-3 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded bg-gray-50">
                            {it.imageUrl ? (
                              <Image src={it.imageUrl} alt={it.name} fill className="object-contain p-1" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-500">IMG</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{it.name}</div>
                            <div className="text-xs text-gray-600">₹{it.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`qty-${it.productId}`} className="text-xs">Qty</Label>
                          <Input id={`qty-${it.productId}`} type="number" className="h-8 w-20" value={it.quantity} onChange={(e) => updateQty(it.productId, parseInt(e.target.value || '1', 10))} />
                          <Button variant="destructive" size="sm" onClick={() => removeItem(it.productId)}>Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Full Name</Label>
                  <Input value={customer.fullName} onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Method</Label>
                  <select className="h-10 w-full rounded border px-2 text-sm" value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value as any })}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select className="h-10 w-full rounded border px-2 text-sm" value={payment.status} onChange={(e) => setPayment({ ...payment, status: e.target.value as any })}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Notes</Label>
                  <Input value={payment.notes} onChange={(e) => setPayment({ ...payment, notes: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Full Name</Label><Input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} /></div>
                <div className="col-span-2"><Label>Address Line 1</Label><Input value={shipping.addressLine1} onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })} /></div>
                <div className="col-span-2"><Label>Address Line 2</Label><Input value={shipping.addressLine2} onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })} /></div>
                <div className="col-span-2"><Label>Landmark</Label><Input value={shipping.landmark} onChange={(e) => setShipping({ ...shipping, landmark: e.target.value })} /></div>
                <div><Label>City</Label><Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} /></div>
                <div><Label>State</Label><Input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} /></div>
                <div><Label>Country</Label><Input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Full Name</Label><Input value={delivery.fullName} onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input value={delivery.pincode} onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })} /></div>
                <div className="col-span-2"><Label>Address Line 1</Label><Input value={delivery.addressLine1} onChange={(e) => setDelivery({ ...delivery, addressLine1: e.target.value })} /></div>
                <div className="col-span-2"><Label>Address Line 2</Label><Input value={delivery.addressLine2} onChange={(e) => setDelivery({ ...delivery, addressLine2: e.target.value })} /></div>
                <div className="col-span-2"><Label>Landmark</Label><Input value={delivery.landmark} onChange={(e) => setDelivery({ ...delivery, landmark: e.target.value })} /></div>
                <div><Label>City</Label><Input value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} /></div>
                <div><Label>State</Label><Input value={delivery.state} onChange={(e) => setDelivery({ ...delivery, state: e.target.value })} /></div>
                <div><Label>Country</Label><Input value={delivery.country} onChange={(e) => setDelivery({ ...delivery, country: e.target.value })} /></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>₹{discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹{shippingFee.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <Label>Discount</Label>
                  <Input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value || '0'))} />
                </div>
                <div>
                  <Label>Shipping</Label>
                  <Input type="number" value={shippingFee} onChange={(e) => setShippingFee(parseFloat(e.target.value || '0'))} />
                </div>
              </div>

              <Button className="w-full mt-4" onClick={handleSubmit} disabled={items.length === 0}>Create Offline Order</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
