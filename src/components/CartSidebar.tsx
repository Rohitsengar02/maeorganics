'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';

const CartSidebar = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col bg-[#fdf8e8] p-0 sm:max-w-lg">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-center justify-between text-2xl font-headline font-black text-[#2d2b28]">
            My Cart
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
              {cartCount}
            </span>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-white">
                        <Image
                          src={item.image.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-[#2d2b28]">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{(item.price || 0).toFixed(2)}
                        </p>
                        <div className="mt-2 flex h-8 items-center justify-between rounded-full border bg-white px-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-red-100 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-6">
              <div className="mb-4 flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" passHref>
                <Button size="lg" className="w-full h-12 rounded-full" onClick={closeCart}>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <h3 className="text-xl font-bold">Your cart is empty</h3>
            <p className="text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
