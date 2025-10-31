"use client";

import { useEffect, useMemo, useState } from "react";
import { adminGetAllOrders } from "@/lib/orders-api";
import { getOfflineOrders } from "@/lib/offline-orders-api";

export function PendingOrders({ limit = 5 }: { limit?: number }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [offline, setOffline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, oo] = await Promise.all([
          adminGetAllOrders().catch(() => ({ success: true, data: [] })),
          getOfflineOrders().catch(() => ({ success: true, data: [] })),
        ]);
        setOrders(o.success ? o.data : []);
        setOffline(oo.success ? oo.data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = useMemo(() => {
    const all = [
      ...(orders || []).map((o: any) => ({ ...o, __type: 'online' })),
      ...(offline || []).map((o: any) => ({ ...o, __type: 'offline' })),
    ];
    return all
      .filter((o: any) => ['created', 'processing', 'shipped'].includes(o.status))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [orders, offline, limit]);

  if (loading) return <div>Loading pending orders...</div>;
  if (pending.length === 0) return <div className="text-sm text-muted-foreground">No pending orders.</div>;

  const fmt = (v: number) => `₹${(v ?? 0).toFixed(2)}`;

  return (
    <div className="space-y-2 text-sm">
      {pending.map((o: any) => {
        const name = o.__type === 'offline' ? (o.customer?.fullName || 'Customer') : (o.address?.fullName || 'Customer');
        const key = o._id || `${name}-${o.createdAt}`;
        return (
          <div key={key} className="flex items-center justify-between rounded-md border p-3 bg-white hover:bg-muted/40 transition">
            <div className="min-w-0">
              <div className="font-medium truncate">{name}</div>
              <div className="text-xs text-muted-foreground truncate">{o._id?.slice(-6)} • {o.status}</div>
            </div>
            <div className="font-semibold shrink-0">{fmt(o.amounts?.total || 0)}</div>
          </div>
        );
      })}
    </div>
  );
}
