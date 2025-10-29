'use client';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlusCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
  

const orders = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Fulfilled', total: '₹250.00', images: ['https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png'] },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Fulfilled', total: '₹150.00', images: ['https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png', 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png'] },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Unfulfilled', total: '₹350.00', images: ['https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761644760/ChatGPT_Image_Oct_28_2025_03_14_30_PM_1_hgd95d.png'] },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Fulfilled', total: '₹450.00', images: ['https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png'] },
    { id: 'ORD005', customer: 'Liam Johnson', date: '2023-11-19', status: 'Unfulfilled', total: '₹550.00', images: ['https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png'] },
]

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage your store's orders."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </PageHeader>
      
      <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                    <div className="flex -space-x-4">
                        {order.images.map((src, index) => (
                            <div key={index} className="relative h-8 w-8 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                                <Image
                                    src={src}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                        ))}
                    </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell><Badge variant={order.status === 'Fulfilled' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
                <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
