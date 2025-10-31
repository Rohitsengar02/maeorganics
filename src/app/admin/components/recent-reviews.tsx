"use client";

import { useEffect, useState } from "react";
import { getAllReviews } from "@/lib/reviews-api";

export function RecentReviews({ limit = 5 }: { limit?: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllReviews();
        setReviews(res?.data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  const latest = (reviews || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  if (latest.length === 0) return <div className="text-sm text-muted-foreground">No reviews found.</div>;

  return (
    <div className="space-y-2">
      {latest.map((r) => {
        const key = r._id || `${r.product?._id || 'p'}-${r.user?._id || 'u'}-${r.createdAt}`;
        return (
          <div key={key} className="flex items-start justify-between rounded-md border p-3 bg-white hover:bg-muted/40 transition">
            <div className="min-w-0 pr-2">
              <div className="font-medium text-sm truncate">{r.product?.name || "Product"}</div>
              <div className="text-xs text-muted-foreground truncate">{r.user?.fullName || r.user?.email || "User"} • {r.rating ? `${r.rating}/5` : ""}</div>
              {r.comment && <div className="text-xs mt-1 line-clamp-2">{r.comment}</div>}
            </div>
            <div className="text-xs text-muted-foreground shrink-0">{new Date(r.createdAt).toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
}
