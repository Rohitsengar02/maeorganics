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

  
  export default function DashboardPage() {
    return (
      <>
        <div className="flex-col md:flex">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  Notifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹45,231.89</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Subscriptions
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2350</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Now
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        You made 265 sales this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
               <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SalesChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New Users Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UsersChart />
                        </CardContent>
                    </Card>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <LineChart className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No reports yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      You have no reports to display. Reports will be generated based on your store's activity.
                    </p>
                  </div>
                </div>
              </TabsContent>
               <TabsContent value="notifications" className="space-y-4">
                <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Bell className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No notifications yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      You have no new notifications. We'll let you know when something new comes up.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </>
    )
  }
  