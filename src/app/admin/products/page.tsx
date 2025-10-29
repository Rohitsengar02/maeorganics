'use client';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from 'next/image';

const products = [
    { name: 'Sunshine Orange', status: 'Active', price: '$7.99', stock: 100, image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png' },
    { name: 'Green Vitality', status: 'Active', price: '$8.49', stock: 80, image: 'https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png' },
    { name: 'Berry Bliss', status: 'Draft', price: '$8.99', stock: 50, image: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png' },
]

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your store's products."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </PageHeader>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell>
                <div className="relative h-12 w-12 rounded-md bg-muted">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
