import type { Smoothie } from '@/lib/types';

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
    name: "Energizing Blends",
    image: "https://picsum.photos/seed/cat1/400/500",
    hint: "citrus smoothie"
  },
  {
    id: "cat-2",
    name: "Immunity Boosters",
    image: "https://picsum.photos/seed/cat2/400/500",
    hint: "green smoothie"
  },
  {
    id: "cat-3",
    name: "Detox Smoothies",
    image: "https://picsum.photos/seed/cat3/400/500",
    hint: "vegetable smoothie"
  },
  {
    id: "cat-4",
    name: "Protein Power",
    image: "https://picsum.photos/seed/cat4/400/500",
    hint: "protein shake"
  },
  {
    id: "cat-5",
    name: "Green Goodness",
    image: "https://picsum.photos/seed/cat5/400/500",
    hint: "kale smoothie"
  },
  {
    id: "cat-6",
    name: "Berry Classics",
    image: "https://picsum.photos/seed/cat6/400/500",
    hint: "berry smoothie"
  },
];
