'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

function VerifyOTPComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { firebaseUser, updateUserVerificationStatus } = useAuth();
  
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  useEffect(() => {
    if (!email || !phone) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Missing user information. Please register again.'
        });
        router.push('/register');
    }
  }, [email, phone, router, toast])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, you'd verify the OTPs against a backend service (e.g., Firebase Functions + Twilio)
    // For this prototype, we'll simulate a successful verification.
    const isEmailOtpValid = emailOtp === '123456'; // Dummy OTP
    const isPhoneOtpValid = phoneOtp === '123456'; // Dummy OTP

    if (isEmailOtpValid && isPhoneOtpValid) {
        try {
            if (firebaseUser) {
                await updateUserVerificationStatus(firebaseUser.uid, 'email', true);
                await updateUserVerificationStatus(firebaseUser.uid, 'mobile', true);
                toast({ title: 'Verification Successful', description: 'Your account is now fully active.' });
                router.push('/');
            } else {
                throw new Error('User not found. Please log in.');
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: error.message || 'An error occurred while updating your profile.',
            });
        }
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'One or both of the OTPs are incorrect. Please try again.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-md px-4 py-24">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Verify Your Account</h1>
          </div>

          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <p className="mb-6 text-center text-sm text-gray-600">
              We've sent verification codes to your email ({email}) and your phone ({phone}). For this demo, please use `123456` for both.
            </p>
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <Label htmlFor="email-otp">Email OTP</Label>
                <Input 
                  id="email-otp" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone-otp">Phone OTP</Label>
                <Input 
                  id="phone-otp" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify and Continue'}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOTPComponent />
        </Suspense>
    )
}
