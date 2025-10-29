'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-md px-4 py-24">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Login</h1>
          </div>

          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <form className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="ml-2 font-normal">
                    Remember me
                  </Label> */}
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full h-12 text-base" onClick={(e) => { e.preventDefault(); router.push('/'); }}>
                Login
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
