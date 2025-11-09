'use client';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlusCircle } from 'lucide-react';
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
      
      <div className="grid gap-4">
        {orders.map((order) => {
          const hasCombo = order.items.some((it: any) => it.itemType === 'combo');
          return (
            <div 
              key={order._id} 
              className={`rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                hasCombo 
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header */}
              <div className={`p-4 ${hasCombo ? 'bg-green-600' : 'bg-muted'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className={hasCombo ? 'text-white' : ''}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg">Order #{order._id.slice(-6)}</p>
                      <Badge variant={order.__type === 'offline' ? 'secondary' : 'default'}>
                        {order.__type === 'offline' ? 'Offline' : 'Online'}
                      </Badge>
                      {hasCombo && (
                        <Badge className="bg-yellow-500 text-white border-yellow-600">
                          COMBO ORDER
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${hasCombo ? 'text-green-100' : 'text-muted-foreground'}`}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`text-right ${hasCombo ? 'text-white' : ''}`}>
                    <p className="text-sm font-medium mb-1">
                      {(order.__type === 'offline' ? order.customer?.fullName : order.address?.fullName) || '—'}
                    </p>
                    <p className="font-bold text-2xl">{fmt((order.amounts?.total) || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Items */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">Order Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((it: any, index: number) => {
                      const isCombo = it.itemType === 'combo';
                      return (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white border">
                          <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                            {it.imageUrl ? (
                              <Image src={it.imageUrl} alt={it.name} fill className="object-contain p-1" />
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
                            <p className="font-medium text-sm truncate">{it.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                            {isCombo && it.comboProducts && it.comboProducts.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {it.comboProducts.slice(0, 2).map((cp: any, cpIdx: number) => (
                                  <span key={cpIdx} className="inline-flex items-center gap-1 text-[9px] bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">
                                    <span>•</span>
                                    <span>{cp.name}</span>
                                  </span>
                                ))}
                                {it.comboProducts.length > 2 && (
                                  <span className="text-[9px] text-muted-foreground">+{it.comboProducts.length - 2} more</span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-sm">{fmt(it.price * it.quantity)}</p>
                        </div>
                      );
                    })}
                    {order.items.length > 3 && (
                      <div className="text-center py-2 text-xs text-muted-foreground bg-muted/50 rounded">
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
                  <div className="flex-1 flex items-center gap-2">
                    <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                      {order.status}
                    </Badge>
                    <Select onValueChange={(v) => handleStatusChange(order._id, v)} disabled={updatingId === order._id}>
                      <SelectTrigger className="h-8 w-[160px]">
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(order.__type === 'offline' ? `/admin/offline-orders/${order._id}?print=1` : `/admin/orders/${order._id}?print=1`)}
                    >
                      Invoice
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(order.__type === 'offline' ? `/admin/offline-orders/${order._id}` : `/admin/orders/${order._id}`)}
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
