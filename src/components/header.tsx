'use client';

import { ShoppingBag, UserCircle, Menu, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "/shop", label: "Smoothies" },
  { href: "#delivery", label: "Delivery" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const { openCart, cartCount } = useCart();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8">
      <div className="container flex h-20 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-[#2d2b28]">
          Maeorganics<span className="text-primary">.</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          
           <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                </span>
            )}
            <ShoppingBag className="h-6 w-6" />
            <span className="sr-only">Shopping Bag</span>
          </Button>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">User Profile</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline">
                    <span>Maeorganics</span>
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                </Link>
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
