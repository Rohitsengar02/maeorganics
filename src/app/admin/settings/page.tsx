'use client';
import PageHeader from '../components/PageHeader';
        
export default function SettingsPage() {
    return (
        <div>
        <PageHeader
            title="Settings"
            description="Manage your store's settings."
        />
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center py-20">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no settings
                </h3>
                <p className="text-sm text-muted-foreground">
                    Check back later to configure your store.
                </p>
            </div>
        </div>
        </div>
    );
}
