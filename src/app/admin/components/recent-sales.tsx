import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Order = any;

function fmtINR(v: number) {
  return `₹${(v ?? 0).toFixed(2)}`;
}

export function RecentSales({ orders }: { orders: Order[] }) {
  const latest = (orders || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {latest.map((o, idx) => {
        const isOffline = o.__type === 'offline' || !!o.customer;
        const name = (isOffline ? o.customer?.fullName : o.address?.fullName) || 'Customer';
        const email = (isOffline ? o.customer?.email : undefined) || '';
        const amount = fmtINR(o.amounts?.total || 0);
        const initials = (name || 'C').split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase();
        return (
          <div key={o._id || idx} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={''} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
              {!email && <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>}
            </div>
            <div className="ml-auto font-medium">+{amount}</div>
          </div>
        );
      })}
      {latest.length === 0 && (
        <div className="text-sm text-muted-foreground">No recent sales found.</div>
      )}
    </div>
  );
}