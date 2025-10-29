export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Smoothie = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: ImagePlaceholder;
  rating: number;
  ratingCount: number;
};

export type SavedAddress = {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
};
