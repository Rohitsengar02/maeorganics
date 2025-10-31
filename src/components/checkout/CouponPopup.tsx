'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCoupons } from '@/lib/coupons-api';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  expiryDate?: string;
  isActive: boolean;
}

interface CouponPopupProps {
  onApplyCoupon: (coupon: Coupon) => void;
  appliedCoupon: Coupon | null;
}

export default function CouponPopup({ onApplyCoupon, appliedCoupon }: CouponPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [customCode, setCustomCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons();
        if (response.success) {
          setCoupons(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
        toast({
          title: 'Error',
          description: 'Failed to load coupons. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [toast]);

  const handleApplyCoupon = (coupon: Coupon) => {
    if (!coupon.isActive) {
      toast({
        title: 'Coupon Inactive',
        description: 'This coupon is no longer active.',
        variant: 'destructive',
      });
      return;
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      toast({
        title: 'Coupon Expired',
        description: 'This coupon has expired.',
        variant: 'destructive',
      });
      return;
    }

    onApplyCoupon(coupon);
    setIsOpen(false);
  };

  const handleApplyCustomCode = () => {
    if (!customCode.trim()) return;

    const coupon = {
      _id: 'custom',
      code: customCode.trim().toUpperCase(),
      discountType: 'percentage' as const,
      discountValue: 10, // Default value, will be overridden if code matches
      isActive: true,
    };

    // Check if the custom code matches any existing coupon
    const matchedCoupon = coupons.find(c => c.code === customCode.trim().toUpperCase());
    
    if (matchedCoupon) {
      handleApplyCoupon(matchedCoupon);
    } else {
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code you entered is not valid.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium border-yellow-500"
        >
          Apply Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply Coupon</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Enter Coupon Code</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter coupon code" 
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomCode()}
              />
              <Button onClick={handleApplyCustomCode}>Apply</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Available Coupons</h3>
            {loading ? (
              <div className="text-center py-4">Loading coupons...</div>
            ) : coupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                {coupons.map((coupon) => (
                  <div 
                    key={coupon._id}
                    className={`border rounded-lg p-4 ${appliedCoupon?._id === coupon._id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{coupon.code}</p>
                        <p className="text-sm text-gray-600">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% off` 
                            : `₹${coupon.discountValue} off`}
                          {coupon.minPurchase && ` on orders over ₹${coupon.minPurchase}`}
                        </p>
                        {coupon.expiryDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplyCoupon(coupon)}
                        disabled={!coupon.isActive}
                      >
                        {appliedCoupon?._id === coupon._id ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No coupons available</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
