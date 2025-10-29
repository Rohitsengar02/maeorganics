'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
];

const usersData = [
  { month: 'Jan', users: 200 },
  { month: 'Feb', users: 250 },
  { month: 'Mar', users: 300 },
  { month: 'Apr', users: 280 },
  { month: 'May', users: 350 },
  { month: 'Jun', users: 400 },
];

const chartConfig = {
    sales: {
        label: "Sales",
        color: "hsl(var(--primary))",
    },
    users: {
        label: "New Users",
        color: "hsl(var(--chart-2))",
    }
}

export function SalesChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={salesData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="dot"
                        formatter={(value) => `₹${value.toLocaleString()}`}
                    />}
                />
                <Line
                    dataKey="sales"
                    type="natural"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                    dot={true}
                />
            </LineChart>
        </ChartContainer>
    )
}

export function UsersChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={usersData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="dot"
                    />}
                />
                <Line
                    dataKey="users"
                    type="natural"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                    dot={true}
                />
            </LineChart>
        </ChartContainer>
    )
}