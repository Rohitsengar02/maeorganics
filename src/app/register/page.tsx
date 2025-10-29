'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, KeyRound, Mail, Phone, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-md px-4 py-16">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-headline font-black text-[#2d2b28]">Create Account</h1>
          </div>

          <div className="rounded-2xl border bg-white/60 p-8 shadow-lg">
            <form className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Upload a profile picture</p>
              </div>

              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="fullname" placeholder="John Doe" className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" onClick={(e) => { e.preventDefault(); router.push('/'); }}>
                Create Account
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
