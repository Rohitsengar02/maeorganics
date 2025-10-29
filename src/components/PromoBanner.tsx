'use client';

import Image from 'next/image';
import { forwardRef } from 'react';

const PromoBanner = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section ref={ref} className="w-full relative h-[100vh] md:h-[70vh]">
      <Image
        src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761715542/Beige_and_Black_Modern_Elegant_Fashion_Email_Header_1_mqmppk.png"
        alt="Promotional banner"
        fill
        className="object-cover"
      />
    </section>
  );
});

PromoBanner.displayName = 'PromoBanner';


export default PromoBanner;
