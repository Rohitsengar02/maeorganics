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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
  
const customers = [
    { id: 'CUST001', name: 'Liam Johnson', email: 'liam@example.com', totalSpent: '₹250.00', avatar: 'https://github.com/shadcn.png' },
    { id: 'CUST002', name: 'Olivia Smith', email: 'olivia@example.com', totalSpent: '₹150.00', avatar: 'https://github.com/shadcn.png' },
    { id: 'CUST003', name: 'Noah Williams', email: 'noah@example.com', totalSpent: '₹350.00', avatar: 'https://github.com/shadcn.png' },
    { id: 'CUST004', name: 'Emma Brown', email: 'emma@example.com', totalSpent: '₹450.00', avatar: 'https://github.com/shadcn.png' },
    { id: 'CUST005', name: 'Liam Johnson', email: 'liam@example.com', totalSpent: '₹550.00', avatar: 'https://github.com/shadcn.png' },
]

export default function CustomersPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage your store's customers."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </PageHeader>
      
      <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="w-[50px]"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {customers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer" onClick={() => router.push(`/admin/customers/${customer.id}`)}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                    </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="text-right">{customer.totalSpent}</TableCell>
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
