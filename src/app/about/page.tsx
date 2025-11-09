'use client';

import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Droplets, Leaf, Sparkles, ShieldCheck, Recycle, Users } from 'lucide-react';

const productHighlights = [
  {
    title: 'Handwash Collection',
    description: 'Gentle, moisturizing handwash blends crafted to remove germs while keeping skin nourished and soft.',
    icon: <Droplets className="h-8 w-8 text-green-600" />,
  },
  {
    title: 'Pinopthlene Floor Cleaners',
    description: 'Powerful disinfecting pinopthlene solutions that wipe away stains and leave a refreshing fragrance behind.',
    icon: <Sparkles className="h-8 w-8 text-green-600" />,
  },
  {
    title: 'Toilet Wash Range',
    description: 'Deep-clean toilet wash formulas that tackle tough build-up, deodorise, and keep bathrooms sparkling.',
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
  },
  {
    title: 'Dishwash Essentials',
    description: 'Streak-free dishwash liquids that cut tough grease quickly while being gentle on hands and cookware.',
    icon: <Leaf className="h-8 w-8 text-green-600" />,
  },
];

const values = [
  {
    icon: <Leaf className="h-6 w-6 text-emerald-500" />,
    title: 'Botanical Integrity',
    description: 'We favour plant-derived surfactants, essential oils, and natural extracts to create safer household solutions.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
    title: 'Uncompromised Safety',
    description: 'Each batch is dermatologically tested and crafted in GMP-certified facilities to ensure consistent quality.',
  },
  {
    icon: <Recycle className="h-6 w-6 text-emerald-500" />,
    title: 'Planet Positive',
    description: 'From biodegradable formulations to recyclable packaging, sustainability is built into every Maeorganics product.',
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-500" />,
    title: 'Community First',
    description: 'We collaborate with local communities and micro-entrepreneurs to empower sustainable livelihoods.',
  },
];

const milestones = [
  {
    year: '2018',
    title: 'The Spark',
    description: 'Maeorganics launched with a single mission: rethink daily cleaning essentials with natural, skin-safe ingredients.',
  },
  {
    year: '2020',
    title: 'Product Expansion',
    description: 'Introduced handwash and pinopthlene lines, winning the trust of households and boutique hospitality partners.',
  },
  {
    year: '2022',
    title: 'Modern Manufacturing',
    description: 'Scaled production with a state-of-the-art facility, ensuring quality, safety, and faster deliveries nationwide.',
  },
  {
    year: '2024',
    title: 'Today & Beyond',
    description: 'Serving thousands of customers while continuously innovating eco-conscious formulas for a cleaner tomorrow.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf8e8]">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden">
         
          <div className="relative mx-auto max-w-5xl px-4 py-24 text-center">
            <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-sm font-semibold text-green-700 shadow">
              Clean Home. Conscious Planet.
            </span>
            <h1 className="mt-6 text-4xl font-headline font-black text-[#2d2b28] md:text-6xl">
              About Maeorganics
            </h1>
            <p className="mt-6 text-lg text-[#4b4945] md:text-xl">
              We craft elevated cleaning rituals for modern Indian homes—powered by nature, perfected by science, and
              trusted for everyday wellbeing.
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="bg-white/70 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <h2 className="text-3xl font-headline font-black text-[#2d2b28] md:text-4xl">
                We believe home care should nurture, not harm.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#5a5854]">
                Maeorganics was born from a simple observation: while our lifestyles evolve, the products we bring into
                our kitchens and bathrooms often lag behind. Our founders set out to create an alternative range that
                blends Ayurvedic wisdom, pharmaceutical rigour, and contemporary design. The result is a portfolio of
                home essentials—from handwash and pinopthlene to toilet wash and dishwash liquids—that deliver deep
                cleansing without compromising on skin safety or environmental responsibility.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#5a5854]">
                Each Maeorganics formulation celebrates plant-powered actives, hypoallergenic perfumes, and cruelty-free
                testing. We obsess over details so that every pump, spray, or pour feels luxurious while performing at
                professional-grade standards.
              </p>
            </div>
         
          </div>
        </section>

        {/* Product Highlights */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-black text-[#2d2b28] md:text-4xl">
                Everyday essentials, elevated.
              </h2>
              <p className="mt-4 text-[#5a5854] md:text-lg">
                Thoughtfully designed collections for every corner of your home, each backed by rigorous quality checks
                and customer feedback loops.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {productHighlights.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-[#ece4d1] bg-white/80 p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-green-500/40 hover:shadow-xl"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-green-50 p-4">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#2d2b28]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#605d58]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gradient-to-br from-green-100 via-green-50 to-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                Our Compass
              </span>
              <h2 className="mt-4 text-3xl font-headline font-black text-[#2d2b28] md:text-4xl">
                Principles that guide Maeorganics.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="rounded-3xl bg-white p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2d2b28]">{value.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5a5854]">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-black text-[#2d2b28] md:text-4xl">Our Journey</h2>
              <p className="mt-3 text-[#5a5854]">
                A timeline of milestones that shaped Maeorganics into a trusted home-care companion.
              </p>
            </div>
            <div className="mt-12 space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className="relative rounded-3xl border border-[#ece4d1] bg-white/90 p-6 shadow-sm md:flex md:items-center md:gap-8"
                >
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-green-600 text-2xl font-bold text-white">
                    {milestone.year}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <h3 className="text-2xl font-semibold text-[#2d2b28]">{milestone.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5a5854]">{milestone.description}</p>
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="absolute -bottom-6 left-10 hidden h-6 w-[1px] bg-gradient-to-b from-green-600/40 to-transparent md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1f3d2b] py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center text-white">
            <h2 className="text-3xl font-headline font-black md:text-4xl">
              Ready to refresh your cleaning ritual?
            </h2>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Explore our full range of handwash, pinopthlene, toilet wash, dishwash, and more. Experience a cleaner
              home that loves the planet back.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#1f3d2b] shadow-lg transition hover:-translate-y-1 hover:bg-green-100"
              >
                Shop Maeorganics
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
