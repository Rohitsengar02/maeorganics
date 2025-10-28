'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const usefulLinks = [
  "Payments",
  "Shipping",
  "Product Returns",
  "FAQ",
  "Checkout",
];

const helpLinks = [
    "Help Center",
    "Sell On Farmart",
    "Affiliate Program",
    "Our Suppliers",
    "Accessibility",
    "Advertise With Us",
];

export default function Footer() {
  return (
    <footer className="bg-[#2d2b28] text-white/80 pt-24 pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-headline text-3xl font-black tracking-tight text-white">
                Maeorganics<span className="text-[#f3b315]">.</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Maeorganics is a brand that stands for natural and healthy living. Our range of smoothies is designed to provide delicious taste and effective nutrition. We believe in the power of natural ingredients to deliver safe and sustainable products for a healthier lifestyle.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                    <span className='font-semibold'>Hotline 24/7:</span>
                    <br />
                    +91 7777072577
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <span>IMT MANESAR, GURUGRAM, HARYANA</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-primary" />
                <span>care@maeorganics.com</span>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              {usefulLinks.map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors hover:underline">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              {helpLinks.map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors hover:underline">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Maeorganics. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
