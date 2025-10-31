'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { getProducts } from '@/lib/products-api';
import { getCategories } from '@/lib/categories-api';
import { useCart } from '@/hooks/use-cart';

type Filters = {
  search?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  categorySlug?: string | null;
  minRating?: number | null;
  tags?: string[];
  sort?: 'all' | 'price-asc' | 'price-desc' | 'date-desc' | 'alphabetical';
};

interface ShopSidebarProps {
  value: Filters;
  onChange: (v: Filters) => void;
}

const ShopSidebar = ({ value, onChange }: ShopSidebarProps) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProducts({ limit: 200 });
        setProducts(res.success ? res.data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const [fallbackCategories, setFallbackCategories] = useState<{ slug: string; name: string; image?: string }[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await getCategories();
        const cats = (res.data || res.categories || []).map((c: any) => ({
          slug: c.slug,
          name: c.name,
          image: c.image?.url || c.bannerImage?.url || c.thumbnail?.url || c.icon?.url || (Array.isArray(c.media) && c.media[0]?.url) || undefined,
        }));
        setFallbackCategories(cats);
      } catch {}
    };
    loadCats();
  }, []);

  const { minPrice, maxPrice, tags, categories } = useMemo(() => {
    let minP = Infinity, maxP = 0;
    const tagsSet = new Set<string>();
    const catMap = new Map<string, { slug: string; name: string; image?: string }>();
    for (const p of products) {
      const price = Number(p.currentPrice ?? p.regularPrice ?? 0);
      if (!isNaN(price)) {
        minP = Math.min(minP, price);
        maxP = Math.max(maxP, price);
      }
      if (Array.isArray(p.tags)) p.tags.forEach((t: string) => t && tagsSet.add(t));
      const cat = p.category;
      if (cat?.slug) {
        if (!catMap.has(cat.slug)) {
          catMap.set(cat.slug, { slug: cat.slug, name: cat.name || cat.slug, image: p.images?.[0] });
        }
      }
    }
    const tagList = Array.from(tagsSet).slice(0, Math.max(10, tagsSet.size));
    const derived = {
      minPrice: minP === Infinity ? 0 : Math.floor(minP),
      maxPrice: maxP === 0 ? 1000 : Math.ceil(maxP),
      tags: tagList,
      categories: Array.from(catMap.values()),
    };
    if (derived.categories.length === 0 && fallbackCategories.length > 0) {
      derived.categories = fallbackCategories;
    }
    return derived;
  }, [products, fallbackCategories]);

  const priceRange: [number, number] = [
    value.priceMin ?? minPrice,
    value.priceMax ?? maxPrice,
  ];

  const topRated = useMemo(() => {
    const score = (p: any) => Number(p.averageRating ?? p.rating ?? 0);
    const revs = (p: any) => Number(p.totalReviews ?? p.reviewsCount ?? 0);
    return products
      .slice()
      .sort((a, b) => {
        const sd = score(b) - score(a);
        if (sd !== 0) return sd;
        return revs(b) - revs(a);
      })
      .slice(0, 5);
  }, [products]);

  const quickBuy = useMemo(() => {
    const list = products.slice();
    // simple shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, 4);
  }, [products]);

  const moreExplore = useMemo(() => {
    const list = products.slice();
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(4, 7);
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Search</h3>
        <div className="relative">
          <Input
            placeholder="Search our store"
            className="pr-10"
            value={value.search || ''}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Price Range</h3>
        <div className="px-2">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={([min, max]) => onChange({ ...value, priceMin: min, priceMax: max })}
          />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Categories (horizontal rectangular cards, no image) */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Categories</h3>
        <div className="space-y-2">
          {(categories.length ? categories : []).map((cat) => {
            const active = value.categorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onChange({ ...value, categorySlug: active ? null : cat.slug })}
                className={`w-full flex items-center justify-between rounded-md border p-3 bg-white hover:bg-muted/40 transition text-left ${active ? 'ring-2 ring-primary/60 border-primary/30' : ''}`}
                aria-pressed={active}
              >
                <span className="text-sm font-medium" title={cat.name}>{cat.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>View</span>
              </button>
            );
          })}
          {categories.length === 0 && (
            <div className="col-span-full text-xs text-muted-foreground">No categories</div>
          )}
        </div>
      </div>

      <Separator />

      {/* Tags (moved up) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Tags</h3>
          <Button variant="ghost" size="sm" onClick={() => onChange({ ...value, tags: [] })}>Clear</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, Math.max(10, tags.length)).map((tag) => {
            const active = (value.tags || []).includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  const has = (value.tags || []).includes(tag);
                  const next = has ? (value.tags || []).filter(t => t !== tag) : [...(value.tags || []), tag];
                  onChange({ ...value, tags: next });
                }}
                className={`px-3 py-1 rounded-full border text-xs transition ${active ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-muted/40'}`}
                aria-pressed={active}
              >
                {tag}
              </button>
            );
          })}
          {tags.length === 0 && <span className="text-xs text-muted-foreground">No tags</span>}
        </div>
      </div>

      <Separator />

      {/* Quick Buy */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Quick Buy</h3>
        <div className="space-y-2">
          {quickBuy.map((p: any) => (
            <div key={p._id} className="w-full flex items-center gap-3 rounded-md border p-2 bg-white hover:bg-muted/40 transition">
              <Link href={`/shop/${p._id}`} className="relative h-14 w-14 rounded bg-gray-50 overflow-hidden flex-shrink-0">
                {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${p._id}`} className="text-sm font-medium line-clamp-2 hover:underline">{p.name}</Link>
                <div className="text-xs text-muted-foreground">₹{Number(p.currentPrice ?? p.regularPrice ?? 0).toFixed(2)}</div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const sm = {
                    id: p._id,
                    name: p.name,
                    description: p.shortDescription || p.longDescription || p.name,
                    price: Number(p.currentPrice ?? p.regularPrice ?? 0),
                    image: {
                      id: `img-${p._id}`,
                      description: p.name,
                      imageUrl: p.images?.[0] || '/placeholder-product.png',
                      imageHint: p.name,
                    },
                  } as any;
                  addToCart(sm, 1);
                }}
              >
                Buy
              </Button>
            </div>
          ))}
          {quickBuy.length === 0 && <div className="text-xs text-muted-foreground">No products to show.</div>}
        </div>
      </div>

      <Separator />

      {/* Top Rated Products */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Top Rated Products</h3>
        <div className="space-y-2">
          {topRated.map((p: any) => (
            <div key={p._id} className="w-full flex items-center gap-3 rounded-md border p-2 bg-white hover:bg-muted/40 transition">
              <Link href={`/shop/${p._id}`} className="relative h-14 w-14 rounded bg-gray-50 overflow-hidden flex-shrink-0">
                {p.images?.[0] && (
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${p._id}`} className="font-semibold text-sm line-clamp-2 hover:underline">{p.name}</Link>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(p.averageRating ?? p.rating ?? 0)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="font-bold text-sm">₹{Number(p.currentPrice ?? p.regularPrice ?? 0).toFixed(2)}</p>
            </div>
          ))}
          {topRated.length === 0 && <div className="text-xs text-muted-foreground">No rated products yet.</div>}
        </div>
      </div>

      {/* More to Explore */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">More to Explore</h3>
        {moreExplore.map((p: any) => (
          <div key={p._id} className="flex items-center gap-3">
            <Link href={`/shop/${p._id}`} className="relative h-12 w-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
              {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${p._id}`} className="text-sm font-medium truncate hover:underline">{p.name}</Link>
              <div className="text-xs text-muted-foreground">₹{Number(p.currentPrice ?? p.regularPrice ?? 0).toFixed(2)}</div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const sm = {
                  id: p._id,
                  name: p.name,
                  description: p.shortDescription || p.longDescription || p.name,
                  price: Number(p.currentPrice ?? p.regularPrice ?? 0),
                  image: {
                    id: `img-${p._id}`,
                    description: p.name,
                    imageUrl: p.images?.[0] || '/placeholder-product.png',
                    imageHint: p.name,
                  },
                } as any;
                addToCart(sm, 1);
              }}
            >
              Buy
            </Button>
          </div>
        ))}
        {moreExplore.length === 0 && <div className="text-xs text-muted-foreground">No products to show.</div>}
      </div>
    </div>
  );
};

export default ShopSidebar;
