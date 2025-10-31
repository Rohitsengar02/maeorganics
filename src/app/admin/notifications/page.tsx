'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { adminGetAllOrders } from '@/lib/orders-api';
import { getOfflineOrders } from '@/lib/offline-orders-api';
import { getAllReviews } from '@/lib/reviews-api';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [offlineOrders, setOfflineOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, oo, r] = await Promise.all([
          adminGetAllOrders().catch(() => ({ success: true, data: [] })),
          getOfflineOrders().catch(() => ({ success: true, data: [] })),
          getAllReviews().catch(() => ({ success: true, data: [] })),
        ]);
        setOrders(o.success ? o.data : []);
        setOfflineOrders(oo.success ? oo.data : []);
        setReviews(r.success ? (r.data || []) : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const notifications = useMemo(() => {
    const orderEvents = [...orders.map(o => ({
      _id: o._id,
      type: 'order' as const,
      title: `New order ${o._id?.slice(-6)}`,
      subtitle: `${o.address?.fullName || 'Customer'} · ₹${(o.amounts?.total || 0).toFixed(2)}`,
      createdAt: o.createdAt,
    })), ...offlineOrders.map(o => ({
      _id: o._id,
      type: 'order' as const,
      title: `New offline order ${o._id?.slice(-6)}`,
      subtitle: `${o.customer?.fullName || 'Customer'} · ₹${(o.amounts?.total || 0).toFixed(2)}`,
      createdAt: o.createdAt,
    }))];
    const reviewEvents = (reviews || []).map((rv: any) => ({
      _id: rv._id,
      type: 'review' as const,
      title: `New review on ${rv.product?.name || 'a product'}`,
      subtitle: `${rv.user?.fullName || rv.user?.email || 'User'} · ${rv.rating ? `${rv.rating}/5` : ''}`,
      createdAt: rv.createdAt,
    }));
    return [...orderEvents, ...reviewEvents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, offlineOrders, reviews]);

  return (
    <div>
      <PageHeader title="Notifications" description="Latest orders and reviews.">
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-sm text-muted-foreground">No notifications yet.</div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 30).map((n) => (
                <div key={`${n.type}-${n._id}`} className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={n.type === 'order' ? 'default' : 'secondary'} className="capitalize">{n.type}</Badge>
                      <span className="font-medium">{n.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{n.subtitle}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
