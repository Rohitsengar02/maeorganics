'use client';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

const heroSlides = [
    { title: 'Citrus Glow', subtitle: 'VITAMIN BURST', image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png' },
    { title: 'Green Essence', subtitle: 'HERBAL FRESH', image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png' },
];

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Smoothies', href: '/shop' },
    { label: 'Delivery', href: '#delivery' },
    { label: 'Contact', href: '#contact' },
];

const products = [
    { id: '1', name: 'Sunshine Orange', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png' },
    { id: '2', name: 'Green Vitality', image: 'https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png' },
    { id: '3', name: 'Berry Bliss', image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png' },
    { id: '4', name: 'Crimson Crush', image: 'https://images.unsplash.com/photo-1749940015122-9263483c4642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWQlMjBzbW9vdGhpZXxlbnwwfHx8fDE3NjE2MjkwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export default function HomePageSettings() {
    const router = useRouter();

    return (
        <div>
            <PageHeader
                title="Home Page Settings"
                description="Customize the content and appearance of your home page."
            />
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Update your site logo and name.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div>
                           <Label>Logo</Label>
                           <div className="flex items-center gap-4 mt-2">
                             <div className="relative h-16 w-16 rounded-md border bg-muted">
                                {/* Placeholder for logo */}
                             </div>
                             <Input type="file" className="max-w-xs" />
                           </div>
                        </div>
                        <div>
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input id="site-name" defaultValue="Maeorganics" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                        <CardDescription>Manage hero section slides and navigation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Hero Slides</h3>
                                <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Slide</Button>
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Subtitle</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {heroSlides.map((slide) => (
                                            <TableRow key={slide.title}>
                                                <TableCell>
                                                    <div className="relative h-12 w-12 rounded-md bg-muted">
                                                        <Image src={slide.image} alt={slide.title} fill className="object-contain" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{slide.title}</TableCell>
                                                <TableCell>{slide.subtitle}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                         <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Navigation Links</h3>
                                <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Link</Button>
                            </div>
                             <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Label</TableHead>
                                            <TableHead>URL</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {navLinks.map((link) => (
                                            <TableRow key={link.label}>
                                                <TableCell className="font-medium"><Input defaultValue={link.label} /></TableCell>
                                                <TableCell><Input defaultValue={link.href} /></TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Featured Products</CardTitle>
                        <CardDescription>Select which products to display in the featured section on the home page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border h-96 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Product</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell><Checkbox defaultChecked={['1', '2', '3'].includes(product.id)} /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 rounded-md bg-muted">
                                                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                                                    </div>
                                                    <span className="font-medium">{product.name}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Product Grid</CardTitle>
                        <CardDescription>Select which products to display in the main product grid on the home page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border h-96 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Product</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell><Checkbox defaultChecked /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 rounded-md bg-muted">
                                                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                                                    </div>
                                                    <span className="font-medium">{product.name}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
