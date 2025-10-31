"use client";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/users-api";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllUsers();
        if (res.success) setCustomers(res.data);
      } catch (e: any) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Customers" description="All registered users." />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-red-600 text-sm">{error}</TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No customers found.</TableCell>
              </TableRow>
            ) : (
              customers.map((c) => {
                const rowId = c?._id || c?.id || c?.uid;
                return (
                <TableRow key={rowId} className="hover:bg-muted/40">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={c.photoURL || c.avatar || ''} />
                        <AvatarFallback>{(c.fullName || c.name || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{c.fullName || c.name || 'Unnamed'}</div>
                        <div className="text-xs text-gray-500">ID: {(rowId || '').toString().slice(-6)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{c.email || '—'}</TableCell>
                  <TableCell>{c.phone || '—'}</TableCell>
                  <TableCell className="capitalize">{c.role || 'customer'}</TableCell>
                  <TableCell>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" disabled={!rowId} onClick={() => router.push(`/admin/customers/${rowId}`)}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
