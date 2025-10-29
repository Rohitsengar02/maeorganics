'use client';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
        
export default function SettingsPage() {
    const router = useRouter();

    return (
        <div>
            <PageHeader
                title="Settings"
                description="Manage your store's settings and preferences."
            />
            <Tabs defaultValue="store" onValueChange={(value) => router.push(`/admin/settings/${value === 'store' ? '' : value}`)} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="store">Store Details</TabsTrigger>
                    <TabsTrigger value="home">Home Page</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="store" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Name</CardTitle>
                            <CardDescription>This is the name of your store that will be displayed to customers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input placeholder="Maeorganics" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Store Description</CardTitle>
                            <CardDescription>A brief description of your store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Your self-care ritual in a bottle!" />
                        </CardContent>
                    </Card>
                    <Button>Save Changes</Button>
                </TabsContent>
                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Zones</CardTitle>
                            <CardDescription>Manage where you ship and how much you charge for shipping.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Domestic Shipping</Label>
                                <Input placeholder="₹100.00" />
                            </div>
                            <div>
                                <Label>International Shipping</Label>
                                <Input placeholder="₹500.00" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Providers</CardTitle>
                            <CardDescription>Connect payment providers to accept payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">Stripe</p>
                                    <p className="text-sm text-muted-foreground">Accept all major credit cards.</p>
                                </div>
                                <Button>Connect</Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">PayPal</p>
                                    <p className="text-sm text-muted-foreground">Accept payments via PayPal.</p>
                                </div>
                                <Button>Connect</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Manage your email notification preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">New Orders</p>
                                    <p className="text-sm text-muted-foreground">Send an email when a new order is received.</p>
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All new orders</SelectItem>
                                        <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
