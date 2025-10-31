'use client';
import {
    Activity,
    CreditCard,
    DollarSign,
    Download,
    Users,
    Bell,
    LineChart
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import { SalesChart, UsersChart } from "./analytics/components/charts";
import { TopRatedProducts } from "./components/top-rated-products";
import { NewCustomers } from "./components/new-customers";
import { RecentReviews } from "./components/recent-reviews";
import { PendingOrders } from "./components/pending-orders";
import { BestSellers } from "./components/best-sellers";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from 'react';
import { adminGetAllOrders } from '@/lib/orders-api';
import { getOfflineOrders } from '@/lib/offline-orders-api';
import { getAllUsers } from '@/lib/users-api';

  
  export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [offlineOrders, setOfflineOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
      const load = async () => {
        try {
          const [o, oo, u] = await Promise.all([
            adminGetAllOrders().catch(() => ({ success: true, data: [] })),
            getOfflineOrders().catch(() => ({ success: true, data: [] })),
            getAllUsers().catch(() => ({ success: true, data: [] })),
          ]);
          setOrders(o.success ? o.data : []);
          setOfflineOrders(oo.success ? oo.data : []);
          setUsers(u.success ? u.data : []);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, []);

    const allOrders = useMemo(() => {
      const withTypeA = (orders || []).map((x: any) => ({ ...x, __type: 'online' }));
      const withTypeB = (offlineOrders || []).map((x: any) => ({ ...x, __type: 'offline' }));
      return [...withTypeA, ...withTypeB];
    }, [orders, offlineOrders]);

    const fmt = (v: number) => `₹${v.toFixed(2)}`;
    const isCompleted = (s: string) => s !== 'cancelled';
    const totalRevenue = useMemo(() => allOrders.filter(o => isCompleted(o.status)).reduce((sum, o) => sum + (o.amounts?.total || 0), 0), [allOrders]);
    const totalUsers = users.length;
    const totalOrders = allOrders.length;
    const startOfMonth = useMemo(() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; }, []);
    const monthlySalesCount = useMemo(() => allOrders.filter(o => new Date(o.createdAt) >= startOfMonth).length, [allOrders, startOfMonth]);
    const completedOrders = useMemo(() => allOrders.filter(o => o.status !== 'cancelled'), [allOrders]);
    const aov = useMemo(() => {
      const n = completedOrders.length || 1;
      const sum = completedOrders.reduce((s, o) => s + (o.amounts?.total || 0), 0);
      return sum / n;
    }, [completedOrders]);
    const deliveredThisMonth = useMemo(() => allOrders.filter(o => o.status === 'delivered' && new Date(o.createdAt) >= startOfMonth).length, [allOrders, startOfMonth]);
    const pendingCount = useMemo(() => allOrders.filter(o => ['created','processing','shipped'].includes(o.status)).length, [allOrders]);
    const cancelledCount = useMemo(() => allOrders.filter(o => o.status === 'cancelled').length, [allOrders]);

    // Revenue series for Overview chart (last 12 months)
    const overviewData = useMemo(() => {
      const now = new Date();
      const months: { name: string; total: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString(undefined, { month: 'short' });
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const total = allOrders
          .filter(o => o.status !== 'cancelled')
          .filter(o => {
            const t = new Date(o.createdAt).getTime();
            return t >= monthStart.getTime() && t < monthEnd.getTime();
          })
          .reduce((s, o) => s + (o.amounts?.total || 0), 0);
        months.push({ name: label, total: Math.round(total) });
      }
      return months;
    }, [allOrders]);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-col md:flex bg-[#fdf8e8] min-h-screen p-4"
      >
        <div className="flex-1 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tight text-[#2d2b28]">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
             
            </div>
          </motion.div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-green-100">Overview</TabsTrigger>
             
            </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#2d2b28]">
                          Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-[#2d2b28]">{fmt(totalRevenue)}</div>
                        <p className="text-xs text-green-700">{loading ? 'Loading…' : 'All-time total of completed orders'}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#2d2b28]">
                          Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-[#2d2b28]">{totalUsers}</div>
                        <p className="text-xs text-green-700">Registered users</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2d2b28]">Sales</CardTitle>
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#2d2b28]">{totalOrders}</div>
                        <p className="text-xs text-green-700">Total orders (online + offline)</p>
                    </CardContent>
                  </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#2d2b28]">
                          Active Now
                        </CardTitle>
                        <Activity className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-[#2d2b28]">+573</div>
                        <p className="text-xs text-green-700">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                {/* Extra live metric cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2d2b28]">Average Order Value (AOV)</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#2d2b28]">{fmt(aov)}</div>
                      <p className="text-xs text-green-700">Across non-cancelled orders</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2d2b28]">Delivered This Month</CardTitle>
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#2d2b28]">{deliveredThisMonth}</div>
                      <p className="text-xs text-green-700">Orders delivered since {startOfMonth.toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2d2b28]">Pending Orders</CardTitle>
                      <Activity className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#2d2b28]">{pendingCount}</div>
                      <p className="text-xs text-green-700">Created/Processing/Shipped</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2d2b28]">Cancelled Orders</CardTitle>
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#2d2b28]">{cancelledCount}</div>
                      <p className="text-xs text-green-700">All-time</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="lg:col-span-4"
                  >
                    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader>
                        <CardTitle className="text-[#2d2b28]">Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <Overview data={overviewData} />
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="lg:col-span-3"
                  >
                    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                      <CardHeader>
                        <CardTitle className="text-[#2d2b28]">Recent Sales</CardTitle>
                        <CardDescription>
                          You made {monthlySalesCount} sales this month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RecentSales orders={allOrders} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                <div className="grid gap-4 grid-cols-1">
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader>
                      <CardTitle className="text-[#2d2b28]">Top Rated Products</CardTitle>
                      <CardDescription>Products ranked by rating and reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopRatedProducts limit={5} />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader>
                      <CardTitle className="text-[#2d2b28]">New Customers</CardTitle>
                      <CardDescription>Most recent signups</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NewCustomers limit={5} />
                    </CardContent>
                  </Card>
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader>
                      <CardTitle className="text-[#2d2b28]">Recent Reviews</CardTitle>
                      <CardDescription>Latest customer feedback</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentReviews limit={5} />
                    </CardContent>
                  </Card>
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader>
                      <CardTitle className="text-[#2d2b28]">Pending Orders</CardTitle>
                      <CardDescription>Created/Processing/Shipped</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PendingOrders limit={5} />
                    </CardContent>
                  </Card>
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                    <CardHeader>
                      <CardTitle className="text-[#2d2b28]">Best Sellers</CardTitle>
                      <CardDescription>Top items by quantity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BestSellers limit={5} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
               <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                          <CardHeader>
                              <CardTitle className="text-[#2d2b28]">Sales Over Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <SalesChart />
                          </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0">
                          <CardHeader>
                              <CardTitle className="text-[#2d2b28]">New Users Over Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <UsersChart />
                          </CardContent>
                      </Card>
                    </motion.div>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex h-[450px] shrink-0 items-center justify-center rounded-md border-2 border-dashed border-green-200 bg-green-50"
                >
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <LineChart className="h-10 w-10 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold text-[#2d2b28]">No reports yet</h3>
                    <p className="mb-4 mt-2 text-sm text-green-700">
                      You have no reports to display. Reports will be generated based on your store's activity.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
               <TabsContent value="notifications" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex h-[450px] shrink-0 items-center justify-center rounded-md border-2 border-dashed border-green-200 bg-green-50"
                >
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Bell className="h-10 w-10 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold text-[#2d2b28]">No notifications yet</h3>
                    <p className="mb-4 mt-2 text-sm text-green-700">
                      You have no new notifications. We'll let you know when something new comes up.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      )
    }
  