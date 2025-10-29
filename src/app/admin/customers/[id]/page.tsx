'use client';

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import PageHeader from "../../components/PageHeader"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  return (
    <div>
        <PageHeader title={`Customer: ${params.id}`} description="Detailed view of a customer and their order history.">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </PageHeader>
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            
            <Card>
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Liam Johnson
                  </CardTitle>
                  <CardDescription>liam@example.com</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Details</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>liam@example.com</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Address</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from this customer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* We'll add a table of orders here later */}
                 <p className="text-muted-foreground">No orders found.</p>
              </CardContent>
            </Card>

          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle>Customer Stats</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Total Spent</dt>
                      <dd className="font-semibold">₹1,250.00</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Total Orders</dt>
                      <dd className="font-semibold">5</dd>
                    </div>
                     <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Last Order</dt>
                      <dd className="font-semibold">2023-11-23</dd>
                    </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Customer Notes
                  </CardTitle>
                  <CardDescription>
                    Internal notes about the customer.
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Add Note
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <p className="text-muted-foreground">No notes for this customer yet.</p>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  )
}
