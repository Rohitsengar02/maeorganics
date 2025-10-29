
'use client';

import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Globe, Linkedin, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DeveloperPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <Card className="overflow-hidden rounded-2xl shadow-lg">
            <CardHeader className="bg-muted/30 p-8">
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src="https://avatars.githubusercontent.com/u/1089233?v=4" alt="Rohit Sengar" />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold text-[#2d2b28]">
                    Rohit Sengar
                  </CardTitle>
                  <p className="mt-1 text-lg font-medium text-primary">
                    Full-Stack Developer
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 text-base text-foreground/80">
                <p>
                  Hi, I’m Rohit Sengar, a passionate full-stack developer and founder of{' '}
                  <a href="https://cyberlim.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                    CyberLim.com
                  </a>
                  {' '}— a modern software solutions company dedicated to building smart, scalable, and beautifully designed digital products.
                </p>
                <p>
                  With expertise in the MERN stack, Next.js, and Python, I focus on creating seamless, high-performance user experiences with clean architecture and modern animation frameworks like Framer Motion and GSAP. I believe that every line of code should serve a purpose — efficiency, innovation, and design harmony.
                </p>
                <p>
                  At CyberLim, my goal is to craft digital experiences that not only work flawlessly but also leave a lasting impression. From developing intelligent SaaS platforms to building custom web apps, I strive to merge creativity with technical precision.
                </p>
                
                <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Connect with me:</h3>
                    <div className="space-y-3">
                        <Link href="mailto:contact@cyberlim.com" className="flex items-center gap-3 transition-colors hover:text-primary">
                            <Mail className="h-5 w-5" />
                            <span>contact@cyberlim.com</span>
                        </Link>
                         <Link href="https://www.cyberlim.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-primary">
                            <Globe className="h-5 w-5" />
                            <span>www.cyberlim.com</span>
                        </Link>
                         <Link href="https://linkedin.com/in/rohitsengar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-primary">
                            <Linkedin className="h-5 w-5" />
                            <span>linkedin.com/in/rohitsengar</span>
                        </Link>
                    </div>
                </div>

                <div className="pt-6 text-center text-sm text-muted-foreground">
                    <p>Built with passion. Engineered for impact.</p>
                    <p>— Rohit Sengar, Founder & Developer at CyberLim</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
