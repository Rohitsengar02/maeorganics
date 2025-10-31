'use client';
import { ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageHeader from '../../components/PageHeader';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { getUserById } from '@/lib/users-api';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUserById(id);
        if (res.success) setUser(res.data);
      } catch (e: any) {
        setError(e.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  return (
    <div>
      <PageHeader title={user ? (user.fullName || user.name || 'Customer') : 'Customer'} description="Customer details and profile.">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </PageHeader>

      {loading ? (
        <div className="p-6">Loading...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : !user ? (
        <div className="p-6">User not found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photoURL || user.avatar || ''} />
                    <AvatarFallback>{(user.fullName || user.name || 'U').slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-semibold">{user.fullName || user.name || 'Unnamed'}</div>
                    <div className="text-xs text-gray-500">ID: {user._id?.slice(-6)}</div>
                  </div>
                </div>

                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{user.email || '—'}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{user.phone || '—'}</span></div>
                  <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span className="capitalize">{user.role || 'customer'}</span></div>
                </div>

                <Separator />
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</div>
                  <div>Updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                {user.address ? (
                  <div>
                    <div className="font-medium mb-1">Address</div>
                    <div className="leading-6">
                      {user.address.addressLine1 && <div>{user.address.addressLine1}</div>}
                      {user.address.addressLine2 && <div>{user.address.addressLine2}</div>}
                      {(user.address.city || user.address.state || user.address.pincode) && (
                        <div>{user.address.city || ''}{user.address.city && (user.address.state || user.address.pincode) ? ', ' : ''}{user.address.state || ''} {user.address.pincode || ''}</div>
                      )}
                      {user.address.country && <div>{user.address.country}</div>}
                    </div>
                  </div>
                ) : (
                  <div>No additional info available.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
