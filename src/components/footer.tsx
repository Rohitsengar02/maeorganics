import { Leaf } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground/60">
           <Leaf className="h-5 w-5 text-primary" />
           <span>© {new Date().getFullYear()} SmoothieShop. All Rights Reserved.</span>
        </div>
        <div className="flex gap-4 text-sm font-medium">
            <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
