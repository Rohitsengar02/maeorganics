"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, User } from "lucide-react";

const navLinks = ["About", "Smoothies", "Delivery", "Contact"];

const slides = [
  {
    id: 1,
    bottle: {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/True_fruits_-_Smoothie_yellow.png",
      alt: "True Fruits yellow smoothie bottle",
    },
    title: "Sunshine Orange",
    subtitle: "CITRUS BLAST",
    description: "Start your day with a burst of vitamin C. Our signature orange smoothie combines fresh-squeezed citrus with tropical fruits and creamy textures for the ultimate morning boost.",
    price: "$5.99",
    rating: 5,
    baseBackground: "#fdf8e8",
    accentBackground: "#ffc857",
    haloGradient: "from-[#ffb627] via-[#ffd666] to-[#ffe9a3]",
    baseIngredients: [
      { name: "Banana", icon: "🍌", accent: "from-[#fff4d6] to-[#ffe88c]" },
      { name: "Pineapple", icon: "🍍", accent: "from-[#fff0c2] to-[#ffd54f]" },
      { name: "Orange", icon: "🍊", accent: "from-[#ffe4b3] to-[#ffb347]" },
    ],
    extras: [
      { name: "Almond Milk", icon: "🥛", accent: "from-[#fff5e1] to-[#ffd89b]" },
      { name: "Avocado", icon: "🥑", accent: "from-[#e8f5d7] to-[#9ed86f]" },
      { name: "Mango", icon: "🥭", accent: "from-[#ffe7c7] to-[#ffb84d]" },
    ],
  },
  {
    id: 2,
    bottle: {
      src: "https://pepelasalonline.com/wp-content/uploads/2023/02/33721-TRUE-FRUITS-SMOOTHIE-LIGHT-GREEN-25CL.png",
      alt: "True Fruits light green smoothie bottle",
    },
    title: "Green Vitality",
    subtitle: "DETOX BLEND",
    description: "Refresh and rejuvenate with our nutrient-packed green smoothie. Loaded with leafy greens, tropical kiwi, and crisp apple for a revitalizing experience.",
    price: "$6.49",
    rating: 5,
    baseBackground: "#f0f9f0",
    accentBackground: "#90cc7f",
    haloGradient: "from-[#6fba5c] via-[#8fd67d] to-[#c8f4b8]",
    baseIngredients: [
      { name: "Kiwi", icon: "🥝", accent: "from-[#e6f9d8] to-[#b8e986]" },
      { name: "Spinach", icon: "🥬", accent: "from-[#dff5d3] to-[#95d183]" },
      { name: "Green Apple", icon: "🍏", accent: "from-[#dff9d4] to-[#a8e68d]" },
    ],
    extras: [
      { name: "Coconut Water", icon: "🥥", accent: "from-[#f5fae8] to-[#d4e8a8]" },
      { name: "Kale", icon: "🥬", accent: "from-[#ddf5d2] to-[#a3d89a]" },
      { name: "Ginger", icon: "🫚", accent: "from-[#faf3e0] to-[#e8d3a0]" },
    ],
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const bottleVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? -10 : 10,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 10 : -10,
    }),
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatePresence>
        <motion.div
          key={`bg-${currentSlide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{ backgroundColor: currentSlide.baseBackground }}
        />
      </AnimatePresence>

      {/* Accent Panel */}
      <div className="absolute inset-y-0 right-0 z-0 hidden w-[35%] md:block">
        <AnimatePresence>
          <motion.div
            key={`accent-${currentSlide.id}`}
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: { duration: 1.2, ease: [0.83, 0, 0.17, 1] } }}
            exit={{ x: "100%", transition: { duration: 1.2, ease: [0.83, 0, 0.17, 1] } }}
            className="absolute inset-0"
            style={{ backgroundColor: currentSlide.accentBackground }}
          />
        </AnimatePresence>
      </div>
      
      {/* Decorative Blobs */}
      <AnimatePresence>
        <motion.div
          key={`blob1-${currentSlide.id}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: currentSlide.accentBackground }}
        />
        <motion.div
          key={`blob2-${currentSlide.id}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          className="absolute -bottom-20 right-0 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: currentSlide.accentBackground }}
        />
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95], delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-headline text-3xl font-black tracking-tight text-[#2d2b28] sm:text-4xl"
          >
            Smoothie<span className="text-[#f3b315]">.</span>
          </motion.div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#4a4844] md:flex lg:gap-8">
            {navLinks.map((item, i) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -2, color: "#000" }}
                className="transition-all duration-200"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
             <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl sm:h-12 sm:w-12"
            >
              <ShoppingBag size={24} className="text-[#2d2b28]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/50 bg-white/70 text-lg shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl sm:h-12 sm:w-12"
            >
              <User size={24} className="text-[#2d2b28]" />
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="mt-8 flex flex-col items-center gap-8 text-center lg:mt-16 lg:flex-row lg:items-center lg:gap-12 lg:text-left">
          {/* Left Content */}
          <div className="flex-1 space-y-6 lg:space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${currentSlide.id}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="space-y-4"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: "easeOut" } }}
                  className="inline-block text-sm font-bold uppercase tracking-[0.3em] text-[#b8884d] sm:text-base"
                >
                  {currentSlide.subtitle}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.6, ease: "easeOut" } }}
                  className="font-headline text-5xl font-black leading-tight tracking-tight text-[#1a1815] sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  {currentSlide.title.split(" ")[0]} <br />
                  <span className="bg-gradient-to-r from-[#1a1815] to-[#4a4844] bg-clip-text text-transparent">
                    {currentSlide.title.split(" ")[1]}
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.6, ease: "easeOut" } }}
                  className="flex items-center justify-center gap-4 lg:justify-start"
                >
                  <div className="flex text-xl text-[#ffb627] sm:text-2xl">
                    {[...Array(currentSlide.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-[#1a1815] sm:text-4xl">
                    {currentSlide.price}
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.6, ease: "easeOut" } }}
                  className="mx-auto max-w-md text-base leading-relaxed text-[#5a5854] sm:text-lg lg:mx-0 lg:max-w-xl"
                >
                  {currentSlide.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottle Showcase */}
          <div className="relative mt-8 flex flex-1 items-center justify-center py-8 lg:mt-0 lg:py-0">
            <div className="relative flex w-full max-w-xs items-center justify-center sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Desktop Ingredients - Left */}
              <div className="hidden min-w-[100px] flex-col items-end gap-8 pr-4 lg:flex">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`desktop-base-${currentSlide.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-8"
                  >
                    {currentSlide.baseIngredients.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-sm font-semibold text-[#2f2a23]">{item.name}</span>
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.accent} text-lg shadow-xl`}
                        >
                          {item.icon}
                        </motion.span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottle */}
              <div className="relative flex h-[400px] w-[250px] items-center justify-center sm:h-[550px] sm:w-[340px]">
                <AnimatePresence>
                  <motion.div
                    key={`halo-${currentSlide.id}`}
                    initial={{ scale: 0, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 0.8, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 90 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute inset-0 m-auto h-[90%] w-[80%] rounded-[50%] bg-gradient-to-t ${currentSlide.haloGradient} blur-2xl`}
                  />
                </AnimatePresence>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentSlide.id}
                    custom={direction}
                    variants={bottleVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="relative z-10"
                    style={{ rotate: 0 }} 
                  >
                    <Image
                      src={currentSlide.bottle.src}
                      alt={currentSlide.bottle.alt}
                      width={280}
                      height={480}
                      className="h-auto w-[250px] object-contain drop-shadow-2xl sm:w-[340px]"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Desktop Ingredients - Right */}
              <div className="hidden min-w-[100px] flex-col gap-8 pl-4 lg:flex">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`desktop-extra-${currentSlide.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-8"
                  >
                    {currentSlide.extras.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-3"
                      >
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: -15 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.accent} text-lg shadow-xl`}
                        >
                          {item.icon}
                        </motion.span>
                        <span className="text-sm font-semibold text-[#2f2a23]">{item.name}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients for Mobile */}
        <div className="mt-12 lg:hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`mobile-ingredients-${currentSlide.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0 }}
              className="flex justify-center gap-4"
            >
              {[...currentSlide.baseIngredients, ...currentSlide.extras].slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.span
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${item.accent} text-xl shadow-lg`}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-xs font-semibold text-[#2f2a23]">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Carousel Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 transform sm:bottom-8 lg:relative lg:bottom-auto lg:left-auto lg:translate-x-0 lg:mt-8 flex w-full items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl sm:h-12 sm:w-12"
          >
            <span className="text-lg text-[#2f2a23] sm:text-xl">←</span>
          </motion.button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-[#2f2a23] sm:w-8"
                    : "w-2 bg-[#2f2a23]/30 hover:bg-[#2f2a23]/50"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl sm:h-12 sm:w-12"
          >
            <span className="text-lg text-[#2f2a23] sm:text-xl">→</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
