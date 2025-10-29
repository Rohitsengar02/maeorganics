'use client';
import { Button } from '@/components/ui/button';
import PageHeader from '../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesChart, UsersChart } from './components/charts';
import { Download } from 'lucide-react';
    
export default function AnalyticsPage() {
    return (
        <div>
            <PageHeader
                title="Analytics"
                description="View your store's analytics and performance."
            >
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </PageHeader>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                        <CardDescription>A chart showing total sales over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SalesChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>New Users Over Time</CardTitle>
                        <CardDescription>A chart showing new user sign-ups over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UsersChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
