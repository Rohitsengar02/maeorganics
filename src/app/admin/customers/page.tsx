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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  
const customers = [
    { name: 'Liam Johnson', email: 'liam@example.com', totalSpent: '$250.00', avatar: 'https://github.com/shadcn.png' },
    { name: 'Olivia Smith', email: 'olivia@example.com', totalSpent: '$150.00', avatar: 'https://github.com/shadcn.png' },
    { name: 'Noah Williams', email: 'noah@example.com', totalSpent: '$350.00', avatar: 'https://github.com/shadcn.png' },
    { name: 'Emma Brown', email: 'emma@example.com', totalSpent: '$450.00', avatar: 'https://github.com/shadcn.png' },
    { name: 'Liam Johnson', email: 'liam@example.com', totalSpent: '$550.00', avatar: 'https://github.com/shadcn.png' },
]

export default function CustomersPage() {
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
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.email}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
