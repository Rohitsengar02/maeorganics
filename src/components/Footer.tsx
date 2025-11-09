
'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const usefulLinks = [
  { label: 'About Maeorganics', href: '/about' },
  { label: 'Shop All', href: '/shop' },
  { label: 'Combos', href: '/combos' },
  { label: 'Checkout', href: '/checkout' },
  { label: 'Contact', href: '/contact' },
  { label: 'Thank You', href: '/thank-you' },
];

const helpLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Privacy & Policy", href: "/privacy-policy" },
  { label: 'Order Status', href: '/status' },
  { label: 'Login', href: '/login' },
];

export default function Footer() {
  return (
    <footer className="bg-[#2d2b28] text-white/80 pt-24 pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="https://res.cloudinary.com/dntayojln/image/upload/v1762671446/WhatsApp_Image_2025-10-29_at_13.38.10_1e6b9cdc_w3dqx8.png"
                alt="Maeorganics logo"
                width={180}
                height={60}
                className="h-14 w-auto"
                priority
              />
            </Link>
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
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors hover:underline">
                    {link.label}
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
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                  <Link href="/admin" className="hover:text-white transition-colors hover:underline">
                    Admin Panel
                  </Link>
              </li>
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
