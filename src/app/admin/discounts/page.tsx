'use client';

import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/coupons-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function DiscountsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await getCoupons();
        if (response.success) {
          setCoupons(response.data);
        }
      } catch (error) {
        toast({ title: 'Failed to load coupons', variant: 'destructive' });
      }
      setLoading(false);
    };
    loadCoupons();
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCoupon._id) {
        await updateCoupon(currentCoupon._id, currentCoupon);
        toast({ title: 'Coupon updated successfully' });
      } else {
        await createCoupon(currentCoupon);
        toast({ title: 'Coupon created successfully' });
      }
      setIsDialogOpen(false);
      const response = await getCoupons();
      if (response.success) {
        setCoupons(response.data);
      }
    } catch (error: any) {
      toast({ title: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        toast({ title: 'Coupon deleted successfully' });
        setCoupons(coupons.filter(c => c._id !== id));
      } catch (error) {
        toast({ title: 'Failed to delete coupon', variant: 'destructive' });
      }
    }
  };

  const openDialog = (coupon: any = null) => {
    setCurrentCoupon(coupon || { code: '', discountType: 'percentage', discountValue: 0, isActive: true });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discount Coupons</h1>
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : (
              coupons.map(coupon => (
                <TableRow key={coupon._id}>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discountType}</TableCell>
                  <TableCell>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</TableCell>
                  <TableCell>{coupon.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openDialog(coupon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCoupon?._id ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="code">Coupon Code</Label>
              <Input id="code" value={currentCoupon?.code || ''} onChange={e => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <Select value={currentCoupon?.discountType || 'percentage'} onValueChange={value => setCurrentCoupon({ ...currentCoupon, discountType: value })}>
                <SelectTrigger id="discountType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input id="discountValue" type="number" value={currentCoupon?.discountValue || 0} onChange={e => setCurrentCoupon({ ...currentCoupon, discountValue: parseFloat(e.target.value) })} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={currentCoupon?.isActive || false} onCheckedChange={checked => setCurrentCoupon({ ...currentCoupon, isActive: checked })} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
