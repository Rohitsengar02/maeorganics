import type { Smoothie, SavedAddress, Order } from '@/lib/types';

export const featuredSmoothies: Smoothie[] = [
    {
      id: '1',
      name: 'Sunshine Orange',
      description: 'A vibrant mix of orange, mango, and passion fruit.',
      price: 7.99,
      rating: 5,
      ratingCount: 4.9,
      image: {
        id: 'sunshine-orange-smoothie',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png',
        description: 'A bottle of yellow smoothie',
        imageHint: 'yellow smoothie'
      },
    },
    {
      id: '2',
      name: 'Green Vitality',
      description: 'Spinach, kale, apple, and a hint of ginger for a healthy kick.',
      price: 8.49,
      rating: 4,
      ratingCount: 4.6,
      image: {
        id: 'green-vitality-smoothie',
        imageUrl: 'https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png',
        description: 'A bottle of green smoothie',
        imageHint: 'green smoothie'
      },
    },
    {
      id: '3',
      name: 'Berry Bliss',
      description: 'A classic blend of strawberries, blueberries, and raspberries.',
      price: 8.99,
      rating: 5,
      ratingCount: 4.8,
      image: {
        id: 'berry_smoothie',
        description: "A delicious berry smoothie with strawberries and blueberries.",
        imageUrl: "https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png",
        imageHint: "berry smoothie"
      },
    },
    {
      id: '4',
      name: 'Crimson Crush',
      description: 'A refreshing mix of watermelon, mint, and lime.',
      price: 7.49,
      rating: 4,
      ratingCount: 4.5,
      image: {
        id: 'red_smoothie',
        description: "A refreshing red smoothie with watermelon and raspberries.",
        imageUrl: "https://images.unsplash.com/photo-1749940015122-9263483c4642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWQlMjBzbW9vdGhpZXxlbnwwfHx8fDE3NjE2MjkwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "red smoothie"
      },
    },
  ];

export const smoothieCategories = [
  {
    id: "cat-1",
    slug: "energizing-blends",
    name: "Energizing Blends",
    image: "https://picsum.photos/seed/cat1/400/500",
    hint: "citrus smoothie"
  },
  {
    id: "cat-2",
    slug: "immunity-boosters",
    name: "Immunity Boosters",
    image: "https://picsum.photos/seed/cat2/400/500",
    hint: "green smoothie"
  },
  {
    id: "cat-3",
    slug: "detox-smoothies",
    name: "Detox Smoothies",
    image: "https://picsum.photos/seed/cat3/400/500",
    hint: "vegetable smoothie"
  },
  {
    id: "cat-4",
    slug: "protein-power",
    name: "Protein Power",
    image: "https://picsum.photos/seed/cat4/400/500",
    hint: "protein shake"
  },
  {
    id: "cat-5",
    slug: "green-goodness",
    name: "Green Goodness",
    image: "https://picsum.photos/seed/cat5/400/500",
    hint: "kale smoothie"
  },
  {
    id: "cat-6",
    slug: "berry-classics",
    name: "Berry Classics",
    image: "https://picsum.photos/seed/cat6/400/500",
    hint: "berry smoothie"
  },
];

const baseProducts = featuredSmoothies;

export const allProducts: Smoothie[] = Array.from({ length: 16 }, (_, i) => {
    const baseProduct = baseProducts[i % baseProducts.length];
    return {
        ...baseProduct,
        id: `prod-${i + 1}`,
        name: `${baseProduct.name} #${Math.floor(i / baseProducts.length) + 1}`,
        price: parseFloat((baseProduct.price * (1 + (i % 4) * 0.1)).toFixed(2)),
    };
});

export const savedAddresses: SavedAddress[] = [
    {
      id: 'addr-1',
      name: 'John Doe',
      street: '123 Smoothie Street',
      city: 'Flavor Town',
      state: 'CA',
      zip: '90210',
      country: 'USA',
      isDefault: true,
    },
    {
      id: 'addr-2',
      name: 'John Doe',
      street: '456 Wellness Ave, Apt 5B',
      city: 'Vibrant City',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isDefault: false,
    },
  ];

  export const orders: Order[] = [
    {
      id: 'ORD-12345',
      date: '2024-07-28',
      status: 'Delivered',
      items: [
        { product: allProducts[0], quantity: 2 },
        { product: allProducts[3], quantity: 1 },
      ],
      shippingAddress: savedAddresses[0],
      billingAddress: savedAddresses[0],
      subtotal: 23.47,
      shipping: 5.00,
      tax: 1.88,
      total: 30.35,
    },
    {
      id: 'ORD-67890',
      date: '2024-07-25',
      status: 'Shipped',
      items: [
        { product: allProducts[1], quantity: 1 },
      ],
      shippingAddress: savedAddresses[1],
      billingAddress: savedAddresses[1],
      subtotal: 8.49,
      shipping: 5.00,
      tax: 0.68,
      total: 14.17,
    },
    {
      id: 'ORD-54321',
      date: '2024-06-15',
      status: 'Delivered',
      items: [
        { product: allProducts[2], quantity: 3 },
        { product: allProducts[5], quantity: 1 },
        { product: allProducts[8], quantity: 2 },
      ],
      shippingAddress: savedAddresses[0],
      billingAddress: savedAddresses[0],
      subtotal: 61.42,
      shipping: 0.00,
      tax: 4.91,
      total: 66.33,
    },
  ];
