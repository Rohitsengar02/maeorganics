'use client';
import PageHeader from '../components/PageHeader';
    
export default function AnalyticsPage() {
    return (
        <div>
        <PageHeader
            title="Analytics"
            description="View your store's analytics."
        />
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center py-20">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                    Check back later to see your store's performance.
                </p>
            </div>
        </div>
        </div>
    );
}
