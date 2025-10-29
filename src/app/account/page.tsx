
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import {
  User,
  Package,
  MapPin,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera,
  Loader2,
  Mail,
  Smartphone,
} from 'lucide-react';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const accountNavItems = [
  {
    icon: Package,
    label: 'My Orders',
    href: '/account/orders',
  },
  {
    icon: MapPin,
    label: 'Shipping Addresses',
    href: '/checkout/add-address',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    href: '#',
  },
];

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
      setAvatarPreview(user.imageUrl);
    }
  }, [user, form]);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  };


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      let newImageUrl = user.imageUrl;
      if (profileImageFile) {
        newImageUrl = await uploadToCloudinary(profileImageFile);
      }
      
      await updateProfile({
        ...data,
        imageUrl: newImageUrl
      });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    // This should ideally not happen if routing is protected, but as a fallback
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-headline font-black text-[#2d2b28] mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-[#2d2b28]">{user.fullName}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {accountNavItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start text-base py-6"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                        <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                      </Button>
                    ))}
                    <Separator className="my-2" />
                     <Button
                        variant="ghost"
                        className="w-full justify-start text-base py-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={signOut}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                      </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your personal information. Changes will be saved across the app.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={avatarPreview} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.slice(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                           <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-sm"
                            onClick={handleAvatarClick}
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                           <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{user.fullName}</h2>
                          <p className="text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input placeholder="Your full name" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                         <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                               <FormControl>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input placeholder="(+91) 123 456 7890" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                       <div>
                          <FormLabel>Email Address</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input value={user.email} disabled className="pl-10 bg-gray-100/80 cursor-not-allowed" />
                          </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>

                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
