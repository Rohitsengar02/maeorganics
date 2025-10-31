'use client';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlusCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { adminGetAllOrders, adminUpdateOrderStatus } from '@/lib/orders-api';
import { getOfflineOrders } from '@/lib/offline-orders-api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [onlineRes, offlineRes] = await Promise.all([
          adminGetAllOrders(),
          getOfflineOrders(),
        ]);
        const online = onlineRes.success ? onlineRes.data.map((o: any) => ({ ...o, __type: 'online' })) : [];
        const offline = offlineRes.success ? offlineRes.data.map((o: any) => ({ ...o, __type: 'offline' })) : [];
        // Normalize for table
        const merged = [
          ...online,
          ...offline,
        ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(merged);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (v: number) => `₹${v.toFixed(2)}`;

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await adminUpdateOrderStatus(id, status);
      if (res.success) {
        setOrders(prev => prev.map(o => o._id === id ? res.data : o));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage your store's orders."
      >
        <Button onClick={() => router.push('/admin/orders/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </PageHeader>
      
      <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map((order) => (
                <TableRow key={order._id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                <TableCell>{(order.__type === 'offline' ? order.customer?.fullName : order.address?.fullName) || '—'}</TableCell>
                <TableCell>
                    <div className="flex -space-x-4">
                        {order.items.slice(0,3).map((it: any, index: number) => (
                            <div key={index} className="relative h-8 w-8 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                              {it.imageUrl ? (
                                <Image src={it.imageUrl} alt={it.name} fill className="object-contain p-1" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-500">IMG</div>
                              )}
                            </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="relative h-8 w-8 flex items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] text-gray-600">+{order.items.length-3}</div>
                        )}
                    </div>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">{order.status}</Badge>
                    <Select onValueChange={(v) => handleStatusChange(order._id, v)}>
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={order.__type === 'offline' ? 'secondary' : 'default'}>{order.__type === 'offline' ? 'Offline' : 'Online'}</Badge>
                </TableCell>
                <TableCell className="text-right">{fmt((order.amounts?.total) || 0)}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(order.__type === 'offline' ? `/admin/offline-orders/${order._id}?print=1` : `/admin/orders/${order._id}?print=1`)}
                      >Invoice</Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => router.push(order.__type === 'offline' ? `/admin/offline-orders/${order._id}` : `/admin/orders/${order._id}`)}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
