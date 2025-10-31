"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getAuthHeaders } from "@/lib/api-helpers";

type Product = {
  _id: string;
  name: string;
  images?: string[];
  currentPrice?: number;
  regularPrice?: number;
  rating?: number;
  averageRating?: number;
  reviewsCount?: number;
  totalReviews?: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics.vercel.app'
    : 'http://localhost:5000');

export function TopRatedProducts({ limit = 5 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/products`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch products");
        const list: Product[] = data.data || data.products || [];
        setProducts(list);
      } catch (e: any) {
        setError(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const top = useMemo(() => {
    const score = (p: Product) => Number(p.rating ?? p.averageRating ?? 0);
    const revs = (p: Product) => Number(p.reviewsCount ?? p.totalReviews ?? 0);
    return products
      .slice()
      .sort((a, b) => {
        const sDiff = score(b) - score(a);
        if (sDiff !== 0) return sDiff;
        return revs(b) - revs(a);
      })
      .slice(0, limit);
  }, [products, limit]);

  if (loading) return <div>Loading top rated products...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (top.length === 0) return <div className="text-sm text-muted-foreground">No products found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {top.map((p) => (
        <Card key={p._id} className="overflow-hidden">
          <div className="relative h-28 w-full bg-gray-50">
            {p.images?.[0] ? (
              <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">IMG</div>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm line-clamp-1">{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 flex items-center justify-between">
            <div>
              <span className="font-medium text-[#2d2b28]">
                ₹{(p.currentPrice ?? p.regularPrice ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>⭐ {Number(p.rating ?? p.averageRating ?? 0).toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground">({Number(p.reviewsCount ?? p.totalReviews ?? 0)})</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
