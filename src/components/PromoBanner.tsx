'use client';

import Image from 'next/image';

const PromoBanner = () => {
  return (
    <section className="w-full relative h-[30vh] md:h-[50vh]">
      <Image
        src="https://res.cloudinary.com/ds1wiqrdb/image/upload/v1761715289/Beige_and_Black_Modern_Elegant_Fashion_Email_Header_xb8mxq.png"
        alt="Promotional banner"
        fill
        className="object-cover"
      />
    </section>
  );
};

export default PromoBanner;
