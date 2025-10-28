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
};
