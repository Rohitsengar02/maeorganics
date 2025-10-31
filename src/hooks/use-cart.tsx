'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import type { Smoothie } from '@/lib/types';
import { useToast } from './use-toast';
import { getCart, addItemToCart, removeItemFromCart } from '@/lib/cart-api';
import { useAuth } from './use-auth';

interface CartItem extends Smoothie {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Smoothie, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const response = await getCart();
          if (response.success) {
            const items = response.data.items.map((item: any) => ({
              ...item.product,
              id: item.product._id,
              quantity: item.quantity,
              price: item.product.currentPrice || item.product.regularPrice,
              image: {
                id: `img-${item.product._id}`,
                description: item.product.name,
                imageUrl: item.product.images?.[0] || '/placeholder-product.png',
                imageHint: item.product.name
              }
            }));
            setCartItems(items);
          }
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      }
    };
    loadCart();
  }, [user]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(async (product: Smoothie, quantity: number = 1) => {
    if (!user) {
      toast({ title: "Please log in to add items to your cart.", variant: "destructive" });
      return;
    }
    try {
      const response = await addItemToCart(product.id, quantity);
      if (response.success) {
        const items = response.data.items.map((item: any) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity,
          price: item.product.currentPrice || item.product.regularPrice,
          image: {
            id: `img-${item.product._id}`,
            description: item.product.name,
            imageUrl: item.product.images?.[0] || '/placeholder-product.png',
            imageHint: item.product.name
          }
        }));
        setCartItems(items);
        toast({ title: `Added ${product.name} to cart.` });
        openCart();
      }
    } catch (error) {
      toast({ title: "Failed to add item to cart.", variant: "destructive" });
    }
  }, [user, openCart, toast]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) return;
    try {
      const response = await removeItemFromCart(productId);
      if (response.success) {
        const items = response.data.items.map((item: any) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity,
          price: item.product.currentPrice || item.product.regularPrice,
          image: {
            id: `img-${item.product._id}`,
            description: item.product.name,
            imageUrl: item.product.images?.[0] || '/placeholder-product.png',
            imageHint: item.product.name
          }
        }));
        setCartItems(items);
        toast({ title: "Item removed from cart." });
      }
    } catch (error) {
      toast({ title: "Failed to remove item from cart.", variant: "destructive" });
    }
  }, [user, toast]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      try {
        const response = await addItemToCart(productId, quantity);
        if (response.success) {
          const items = response.data.items.map((item: any) => ({
            ...item.product,
            id: item.product._id,
            quantity: item.quantity,
            price: item.product.currentPrice || item.product.regularPrice,
            image: {
              id: `img-${item.product._id}`,
              description: item.product.name,
              imageUrl: item.product.images?.[0] || '/placeholder-product.png',
              imageHint: item.product.name
            }
          }));
          setCartItems(items);
        }
      } catch (error) {
        toast({ title: "Failed to update quantity.", variant: "destructive" });
      }
    }
  }, [user, removeFromCart, toast]);
  
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    // Optionally also clear server-side cart here if needed in the future.
  }, []);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
