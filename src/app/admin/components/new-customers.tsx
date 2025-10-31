"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUsers } from "@/lib/users-api";

export function NewCustomers({ limit = 5 }: { limit?: number }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.success ? res.data : []);
      } catch (e: any) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  const latest = users
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  if (latest.length === 0) return <div className="text-sm text-muted-foreground">No customers found.</div>;

  return (
    <div className="space-y-2">
      {latest.map((u: any) => {
        const name = u.fullName || u.name || u.email || "User";
        const initials = (name || 'U').split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase();
        const key = u._id || u.uid || u.email || name;
        return (
          <div key={key} className="flex items-center justify-between rounded-md border p-3 bg-white hover:bg-muted/40 transition">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={u.photoURL || u.avatar || ''} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-sm font-medium leading-none truncate">{name}</div>
                <div className="text-xs text-muted-foreground truncate">{u.email || '—'}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</div>
          </div>
        );
      })}
    </div>
  );
}
