"use client";

import { useEffect, useMemo, useState } from "react";
import { adminGetAllOrders } from "@/lib/orders-api";
import { getOfflineOrders } from "@/lib/offline-orders-api";

export function BestSellers({ limit = 5 }: { limit?: number }) {
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

  const top = useMemo(() => {
    const all = [...orders, ...offline];
    const map = new Map<string, { name: string; qty: number }>();
    all.forEach((o: any) => {
      (o.items || []).forEach((it: any) => {
        const key = it.productId || it._id || it.name;
        const prev = map.get(key) || { name: it.name, qty: 0 };
        prev.qty += Number(it.quantity || 0);
        map.set(key, prev);
      });
    });
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit);
  }, [orders, offline, limit]);

  if (loading) return <div>Loading best sellers...</div>;
  if (top.length === 0) return <div className="text-sm text-muted-foreground">No items sold yet.</div>;

  return (
    <div className="space-y-2 text-sm">
      {top.map((p) => (
        <div key={p.id || `${p.name}-${p.qty}`} className="flex items-center justify-between rounded-md border p-3 bg-white hover:bg-muted/40 transition">
          <div className="font-medium truncate pr-2">{p.name}</div>
          <div className="text-xs text-muted-foreground">Qty: {p.qty}</div>
        </div>
      ))}
    </div>
  );
}
