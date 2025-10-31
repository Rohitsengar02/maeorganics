'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Loader2, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from '@/components/ui/textarea';
import { getHomePageSettings, updateHomePageSettings, deleteHeroSlide, addNavLink, deleteNavLink } from '@/lib/homepage-settings-api';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/lib/products-api';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

const heroSlides = [
    { 
        id: 1,
        title: 'Citrus Glow', 
        subtitle: 'VITAMIN BURST', 
        image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761643874/ChatGPT_Image_Oct_28_2025_02_57_54_PM_1_tys6ek.png',
        description: "Awaken your senses with EcoBless Citrus Glow Handwash — enriched with orange peel, lemon, and honey extracts. Its vitamin-rich formula deeply cleanses and refreshes, leaving your hands bright, smooth, and energized.",
        price: "₹299.00",
        rating: 5,
        baseBackground: "#fff7e6",
        accentBackground: "#ffb84d",
        baseIngredients: [
            { name: "Orange Peel", icon: "🍊" },
            { name: "Lemon Extract", icon: "🍋" },
            { name: "Honey", icon: "🍯" }
        ],
        extras: [
            { name: "Turmeric", icon: "🌻" },
            { name: "Papaya", icon: "🥭" },
            { name: "Vitamin C", icon: "💊" }
        ],
    },
    { 
        id: 2,
        title: 'Green Essence', 
        subtitle: 'HERBAL FRESH', 
        image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png',
        description: "Experience the purity of nature with our EcoBless Green Essence Handwash. Infused with aloe vera, mint, and lemon for a refreshing and gentle cleanse that leaves hands soft, clean, and naturally fragrant.",
        price: "₹299.00",
        rating: 5,
        baseBackground: "#f0f9f0",
        accentBackground: "#90cc7f",
        baseIngredients: [
          { name: "Aloe Vera", icon: "🪴" },
          { name: "Mint Leaves", icon: "🍃" },
          { name: "Lemon Extract", icon: "🍋" }
        ],
        extras: [
          { name: "Green Apple", icon: "🍏" },
          { name: "Cucumber", icon: "🥒" },
          { name: "Tea Tree Oil", icon: "🌿" }
        ],
    },
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
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [siteName, setSiteName] = useState('Maeorganics');
    const [logo, setLogo] = useState('');
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [navLinks, setNavLinks] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);
    const [productGrid, setProductGrid] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);

    // Load settings and products from backend
    useEffect(() => {
        loadSettings();
        loadProducts();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await getHomePageSettings();
            if (response.success) {
                const data = response.data;
                setSiteName(data.siteName || 'Maeorganics');
                setLogo(data.logo || '');
                setHeroSlides(data.heroSlides || []);
                setNavLinks(data.navLinks || []);
                setFeaturedProducts(data.featuredProducts?.map((p: any) => p._id) || []);
                setProductGrid(data.productGrid?.map((p: any) => p._id) || []);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load home page settings',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await getProducts({ limit: 100 });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Clean up hero slides - remove empty ingredients (only name is required)
            const cleanedHeroSlides = heroSlides.map(slide => ({
                ...slide,
                baseIngredients: slide.baseIngredients?.filter((ing: any) => ing.name?.trim()) || [],
                extras: slide.extras?.filter((ing: any) => ing.name?.trim()) || [],
            }));

            const response = await updateHomePageSettings({
                siteName,
                logo,
                heroSlides: cleanedHeroSlides,
                navLinks,
                featuredProducts,
                productGrid,
            });

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Home page settings updated successfully',
                });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to save home page settings',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSlide = async (slideId: string) => {
        try {
            const response = await deleteHeroSlide(slideId);
            if (response.success) {
                setHeroSlides(heroSlides.filter(slide => slide._id !== slideId));
                toast({
                    title: 'Success',
                    description: 'Hero slide deleted successfully',
                });
            }
        } catch (error) {
            console.error('Error deleting slide:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete hero slide',
                variant: 'destructive',
            });
        }
    };

    const handleAddNavLink = () => {
        setNavLinks([...navLinks, { label: 'New Link', href: '#' }]);
    };

    const handleDeleteNavLink = (index: number) => {
        setNavLinks(navLinks.filter((_, i) => i !== index));
    };

    const handleSlideChange = (index: number, field: string, value: any) => {
        const updatedSlides = [...heroSlides];
        updatedSlides[index] = { ...updatedSlides[index], [field]: value };
        setHeroSlides(updatedSlides);
    };

    const handleNavLinkChange = (index: number, field: string, value: string) => {
        const updatedLinks = [...navLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setNavLinks(updatedLinks);
    };

    const handleIngredientChange = (slideIndex: number, ingredientType: 'baseIngredients' | 'extras', ingredientIndex: number, field: string, value: string) => {
        const updatedSlides = [...heroSlides];
        const ingredients = [...updatedSlides[slideIndex][ingredientType]];
        ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], [field]: value };
        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], [ingredientType]: ingredients };
        setHeroSlides(updatedSlides);
    };

    const handleAddIngredient = (slideIndex: number, ingredientType: 'baseIngredients' | 'extras') => {
        const updatedSlides = [...heroSlides];
        const ingredients = [...updatedSlides[slideIndex][ingredientType]];
        ingredients.push({ name: '', icon: '' });
        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], [ingredientType]: ingredients };
        setHeroSlides(updatedSlides);
    };

    const handleDeleteIngredient = (slideIndex: number, ingredientType: 'baseIngredients' | 'extras', ingredientIndex: number) => {
        const updatedSlides = [...heroSlides];
        const ingredients = updatedSlides[slideIndex][ingredientType].filter((_: any, i: number) => i !== ingredientIndex);
        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], [ingredientType]: ingredients };
        setHeroSlides(updatedSlides);
    };

    const handleImageUpload = async (file: File, slideIndex: number, field: 'image') => {
        try {
            setUploadingImage(`slide-${slideIndex}-${field}`);
            const imageUrl = await uploadToCloudinary(file);
            handleSlideChange(slideIndex, field, imageUrl);
            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error) {
            console.error('Image upload error:', error);
            toast({
                title: 'Error',
                description: 'Failed to upload image',
                variant: 'destructive',
            });
        } finally {
            setUploadingImage(null);
        }
    };

    const handleIngredientImageUpload = async (file: File, slideIndex: number, ingredientType: 'baseIngredients' | 'extras', ingredientIndex: number) => {
        try {
            setUploadingImage(`${ingredientType}-${slideIndex}-${ingredientIndex}`);
            const imageUrl = await uploadToCloudinary(file);
            handleIngredientChange(slideIndex, ingredientType, ingredientIndex, 'image', imageUrl);
            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error) {
            console.error('Image upload error:', error);
            toast({
                title: 'Error',
                description: 'Failed to upload image',
                variant: 'destructive',
            });
        } finally {
            setUploadingImage(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading settings...</span>
            </div>
        );
    }

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
                           <div className="space-y-2 mt-2">
                             <div className="relative h-16 w-16 rounded-md border bg-muted overflow-hidden">
                                {logo ? (
                                    <Image 
                                        src={logo} 
                                        alt="Site logo" 
                                        fill 
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                        No logo
                                    </div>
                                )}
                             </div>
                             <div className="flex gap-2">
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                setUploadingImage('logo');
                                                const imageUrl = await uploadToCloudinary(file);
                                                setLogo(imageUrl);
                                                toast({
                                                    title: 'Success',
                                                    description: 'Logo uploaded successfully',
                                                });
                                            } catch (error) {
                                                console.error('Logo upload error:', error);
                                                toast({
                                                    title: 'Error',
                                                    description: 'Failed to upload logo',
                                                    variant: 'destructive',
                                                });
                                            } finally {
                                                setUploadingImage(null);
                                            }
                                        }
                                    }}
                                    disabled={uploadingImage === 'logo'}
                                    className="max-w-xs"
                                />
                                {uploadingImage === 'logo' && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                             </div>
                             <Input 
                                value={logo} 
                                onChange={(e) => setLogo(e.target.value)}
                                placeholder="Or paste logo URL"
                                className="text-sm"
                             />
                           </div>
                        </div>
                        <div>
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input 
                                id="site-name" 
                                value={siteName} 
                                onChange={(e) => setSiteName(e.target.value)}
                            />
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
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setHeroSlides([...heroSlides, {
                                        title: 'New Slide',
                                        subtitle: 'SUBTITLE',
                                        image: '',
                                        description: '',
                                        price: '₹0.00',
                                        rating: 5,
                                        baseBackground: '#ffffff',
                                        accentBackground: '#000000',
                                        baseIngredients: [],
                                        extras: [],
                                    }])}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Slide
                                </Button>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                {heroSlides.map((slide, slideIndex) => (
                                    <AccordionItem value={`item-${slideIndex}`} key={slide._id || slideIndex}>
                                        <AccordionTrigger className='font-semibold'>Slide {slideIndex + 1}: {slide.title}</AccordionTrigger>
                                        <AccordionContent className="p-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column: Text Content */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-md mb-2 border-b pb-2">Slide Content</h4>
                                                    <div>
                                                        <Label>Title</Label>
                                                        <Input 
                                                            value={slide.title} 
                                                            onChange={(e) => handleSlideChange(slideIndex, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Subtitle</Label>
                                                        <Input 
                                                            value={slide.subtitle} 
                                                            onChange={(e) => handleSlideChange(slideIndex, 'subtitle', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Description</Label>
                                                        <Textarea 
                                                            value={slide.description} 
                                                            onChange={(e) => handleSlideChange(slideIndex, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Price</Label>
                                                            <Input 
                                                                value={slide.price} 
                                                                onChange={(e) => handleSlideChange(slideIndex, 'price', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Rating (1-5)</Label>
                                                            <Input 
                                                                type="number" 
                                                                value={slide.rating} 
                                                                onChange={(e) => handleSlideChange(slideIndex, 'rating', parseInt(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                </div>

                                                {/* Right Column: Images & Ingredients */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-md mb-2 border-b pb-2">Visuals</h4>
                                                    <div>
                                                        <Label>Bottle Image</Label>
                                                        <div className="space-y-2">
                                                            {slide.image && (
                                                                <div className="relative w-full h-32 border rounded-md overflow-hidden">
                                                                    <Image 
                                                                        src={slide.image} 
                                                                        alt="Bottle preview" 
                                                                        fill 
                                                                        className="object-contain"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex gap-2">
                                                                <Input 
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handleImageUpload(file, slideIndex, 'image');
                                                                    }}
                                                                    disabled={uploadingImage === `slide-${slideIndex}-image`}
                                                                    className="flex-1"
                                                                />
                                                                {uploadingImage === `slide-${slideIndex}-image` && (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                )}
                                                            </div>
                                                            <Input 
                                                                value={slide.image} 
                                                                onChange={(e) => handleSlideChange(slideIndex, 'image', e.target.value)}
                                                                placeholder="Or paste image URL"
                                                                className="text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Base Background</Label>
                                                            <Input 
                                                                value={slide.baseBackground} 
                                                                onChange={(e) => handleSlideChange(slideIndex, 'baseBackground', e.target.value)}
                                                                placeholder="#ffffff"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Accent Background</Label>
                                                            <Input 
                                                                value={slide.accentBackground} 
                                                                onChange={(e) => handleSlideChange(slideIndex, 'accentBackground', e.target.value)}
                                                                placeholder="#000000"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Base Ingredients */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>Base Ingredients (Left)</Label>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => handleAddIngredient(slideIndex, 'baseIngredients')}
                                                            >
                                                                <PlusCircle className="mr-1 h-3 w-3"/>Add
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-3 rounded-md border p-3">
                                                            {slide.baseIngredients?.map((ing: any, index: number) => (
                                                                <div key={`base-${slideIndex}-${index}`} className="space-y-2 p-2 border rounded">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input 
                                                                            placeholder="Icon/Emoji" 
                                                                            value={ing.icon} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'baseIngredients', index, 'icon', e.target.value)}
                                                                            className="w-20" 
                                                                        />
                                                                        <Input 
                                                                            placeholder="Name" 
                                                                            value={ing.name} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'baseIngredients', index, 'name', e.target.value)}
                                                                        />
                                                                        <Button 
                                                                            variant="ghost" 
                                                                            size="icon" 
                                                                            className="h-8 w-8 text-muted-foreground"
                                                                            onClick={() => handleDeleteIngredient(slideIndex, 'baseIngredients', index)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {ing.image && (
                                                                            <div className="relative w-full h-20 border rounded-md overflow-hidden">
                                                                                <Image 
                                                                                    src={ing.image} 
                                                                                    alt={ing.name} 
                                                                                    fill 
                                                                                    className="object-contain"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex gap-2">
                                                                            <Input 
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                    if (file) handleIngredientImageUpload(file, slideIndex, 'baseIngredients', index);
                                                                                }}
                                                                                disabled={uploadingImage === `baseIngredients-${slideIndex}-${index}`}
                                                                                className="text-xs"
                                                                            />
                                                                            {uploadingImage === `baseIngredients-${slideIndex}-${index}` && (
                                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                            )}
                                                                        </div>
                                                                        <Input 
                                                                            placeholder="Or paste image URL" 
                                                                            value={ing.image || ''} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'baseIngredients', index, 'image', e.target.value)}
                                                                            className="text-xs"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Extra Ingredients */}
                                                    <div className="space-y-2">
                                                         <div className="flex items-center justify-between">
                                                            <Label>Extra Ingredients (Right)</Label>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => handleAddIngredient(slideIndex, 'extras')}
                                                            >
                                                                <PlusCircle className="mr-1 h-3 w-3"/>Add
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-3 rounded-md border p-3">
                                                            {slide.extras?.map((ing: any, index: number) => (
                                                                <div key={`extra-${slideIndex}-${index}`} className="space-y-2 p-2 border rounded">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input 
                                                                            placeholder="Icon/Emoji" 
                                                                            value={ing.icon} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'extras', index, 'icon', e.target.value)}
                                                                            className="w-20" 
                                                                        />
                                                                        <Input 
                                                                            placeholder="Name" 
                                                                            value={ing.name} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'extras', index, 'name', e.target.value)}
                                                                        />
                                                                        <Button 
                                                                            variant="ghost" 
                                                                            size="icon" 
                                                                            className="h-8 w-8 text-muted-foreground"
                                                                            onClick={() => handleDeleteIngredient(slideIndex, 'extras', index)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {ing.image && (
                                                                            <div className="relative w-full h-20 border rounded-md overflow-hidden">
                                                                                <Image 
                                                                                    src={ing.image} 
                                                                                    alt={ing.name} 
                                                                                    fill 
                                                                                    className="object-contain"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex gap-2">
                                                                            <Input 
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                    if (file) handleIngredientImageUpload(file, slideIndex, 'extras', index);
                                                                                }}
                                                                                disabled={uploadingImage === `extras-${slideIndex}-${index}`}
                                                                                className="text-xs"
                                                                            />
                                                                            {uploadingImage === `extras-${slideIndex}-${index}` && (
                                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                            )}
                                                                        </div>
                                                                        <Input 
                                                                            placeholder="Or paste image URL" 
                                                                            value={ing.image || ''} 
                                                                            onChange={(e) => handleIngredientChange(slideIndex, 'extras', index, 'image', e.target.value)}
                                                                            className="text-xs"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button 
                                                    variant="destructive"
                                                    onClick={() => slide._id ? handleDeleteSlide(slide._id) : setHeroSlides(heroSlides.filter((_, i) => i !== slideIndex))}
                                                >
                                                    Delete Slide
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                         <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Navigation Links</h3>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleAddNavLink}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Link
                                </Button>
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
                                        {navLinks.map((link, index) => (
                                            <TableRow key={`nav-${index}`}>
                                                <TableCell className="font-medium">
                                                    <Input 
                                                        value={link.label} 
                                                        onChange={(e) => handleNavLinkChange(index, 'label', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        value={link.href} 
                                                        onChange={(e) => handleNavLinkChange(index, 'href', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => handleDeleteNavLink(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                        <TableRow key={`featured-${product._id}`}>
                                            <TableCell>
                                                <Checkbox 
                                                    checked={featuredProducts.includes(product._id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setFeaturedProducts([...featuredProducts, product._id]);
                                                        } else {
                                                            setFeaturedProducts(featuredProducts.filter(id => id !== product._id));
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 rounded-md bg-muted">
                                                        <Image src={product.images?.[0] || '/placeholder.png'} alt={product.name} fill className="object-contain p-1" />
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
                                        <TableRow key={`grid-${product._id}`}>
                                            <TableCell>
                                                <Checkbox 
                                                    checked={productGrid.includes(product._id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setProductGrid([...productGrid, product._id]);
                                                        } else {
                                                            setProductGrid(productGrid.filter(id => id !== product._id));
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 rounded-md bg-muted">
                                                        <Image src={product.images?.[0] || '/placeholder.png'} alt={product.name} fill className="object-contain p-1" />
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
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
