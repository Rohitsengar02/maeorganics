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

export type OrderItem = {
    product: Smoothie;
    quantity: number;
}

export type Order = {
    id: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: OrderItem[];
    shippingAddress: SavedAddress;
    billingAddress: SavedAddress;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
};