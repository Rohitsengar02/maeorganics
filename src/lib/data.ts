import type { Smoothie } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback to a default image if not found, to prevent crashes
    const defaultImage = PlaceHolderImages[0];
    if (!defaultImage) {
        return {
            id: 'fallback',
            description: 'A delicious smoothie',
            imageUrl: 'https://picsum.photos/seed/fallback/600/600',
            imageHint: 'smoothie'
        }
    }
    return defaultImage;
  }
  return image;
};

export const featuredSmoothies: Smoothie[] = [
  {
    id: '1',
    name: 'Sunshine Burst',
    description: 'A vibrant mix of orange, mango, and passion fruit.',
    price: 7.99,
    image: getImage('tropical_smoothie'),
  },
  {
    id: '2',
    name: 'Green Goddess',
    description: 'Spinach, kale, apple, and a hint of ginger for a healthy kick.',
    price: 8.49,
    image: getImage('green_smoothie'),
  },
  {
    id: '3',
    name: 'Berry Bliss',
    description: 'A classic blend of strawberries, blueberries, and raspberries.',
    price: 8.99,
    image: getImage('berry_smoothie'),
  },
  {
    id: '4',
    name: 'Crimson Crush',
    description: 'A refreshing mix of watermelon, mint, and lime.',
    price: 7.49,
    image: getImage('red_smoothie'),
  },
];
