'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import type { Smoothie } from '@/lib/types';
import { useToast } from './use-toast';
import { getCart, addItemToCart, removeItemFromCart } from '@/lib/cart-api';
import { useAuth } from './use-auth';

interface CartItem extends Smoothie {
  quantity: number;
  title?: string; // For combos
  isCombo?: boolean; // Flag to identify combos
  originalPrice?: number; // For combos to show original price
  finalPrice?: number; // For combos
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
  refreshCart: () => Promise<void>;
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
            const items = response.data.items.map((item: any) => {
              // Handle both products and combos
              const isCombo = item.itemType === 'combo';
              const itemData = isCombo ? item.combo : item.product;
              
              if (!itemData) {
                console.warn('Cart item has no product or combo data:', item);
                return null;
              }
              
              return {
                ...itemData,
                id: itemData._id,
                quantity: item.quantity,
                price: isCombo 
                  ? itemData.finalPrice 
                  : (itemData.currentPrice || itemData.regularPrice),
                isCombo,
                image: {
                  id: `img-${itemData._id}`,
                  description: itemData.title || itemData.name,
                  imageUrl: (isCombo ? itemData.bannerImage : itemData.images?.[0]) || '/placeholder-product.png',
                  imageHint: itemData.title || itemData.name
                }
              };
            }).filter(Boolean); // Remove null items
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

  const refreshCart = useCallback(async () => {
    if (user) {
      try {
        const response = await getCart();
        if (response.success) {
          const items = response.data.items.map((item: any) => {
            const isCombo = item.itemType === 'combo';
            const itemData = isCombo ? item.combo : item.product;
            
            if (!itemData) {
              console.warn('Cart item has no product or combo data:', item);
              return null;
            }
            
            return {
              ...itemData,
              id: itemData._id,
              quantity: item.quantity,
              price: isCombo 
                ? itemData.finalPrice 
                : (itemData.currentPrice || itemData.regularPrice),
              isCombo,
              image: {
                id: `img-${itemData._id}`,
                description: itemData.title || itemData.name,
                imageUrl: (isCombo ? itemData.bannerImage : itemData.images?.[0]) || '/placeholder-product.png',
                imageHint: itemData.title || itemData.name
              }
            };
          }).filter(Boolean);
          setCartItems(items);
        }
      } catch (error) {
        console.error("Failed to refresh cart", error);
      }
    }
  }, [user]);

  const addToCart = useCallback(async (product: Smoothie, quantity: number = 1) => {
    if (!user) {
      toast({ title: "Please log in to add items to your cart.", variant: "destructive" });
      return;
    }
    try {
      const isCombo = (product as any).isCombo || false;
      const response = await addItemToCart(product.id, quantity, isCombo);
      if (response.success) {
        const items = response.data.items.map((item: any) => {
          const isComboItem = item.itemType === 'combo';
          const itemData = isComboItem ? item.combo : item.product;
          
          if (!itemData) {
            console.warn('Cart item has no product or combo data:', item);
            return null;
          }
          
          return {
            ...itemData,
            id: itemData._id,
            quantity: item.quantity,
            price: isComboItem 
              ? itemData.finalPrice 
              : (itemData.currentPrice || itemData.regularPrice),
            isCombo: isComboItem,
            image: {
              id: `img-${itemData._id}`,
              description: itemData.title || itemData.name,
              imageUrl: (isComboItem ? itemData.bannerImage : itemData.images?.[0]) || '/placeholder-product.png',
              imageHint: itemData.title || itemData.name
            }
          };
        }).filter(Boolean);
        setCartItems(items);
        toast({ title: `Added ${product.name} to cart.` });
        openCart();
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({ title: "Failed to add item to cart.", variant: "destructive" });
    }
  }, [user, openCart, toast]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) {
      console.log('[CART CLIENT] User not logged in, cannot remove item');
      return;
    }
    
    console.log('[CART CLIENT] Remove from cart - START');
    console.log('[CART CLIENT] Product ID:', productId);
    console.log('[CART CLIENT] Current cart items:', cartItems.length);
    
    // Find if this is a combo or product
    const item = cartItems.find(i => i.id === productId);
    const isCombo = item?.isCombo || false;
    
    console.log('[CART CLIENT] Item to remove:', {
      id: productId,
      name: item?.name,
      isCombo,
      found: !!item
    });
    
    if (!item) {
      console.error('[CART CLIENT] Item not found in cart state!');
      toast({ title: "Item not found in cart.", variant: "destructive" });
      return;
    }
    
    // OPTIMISTIC UPDATE: Remove from UI immediately
    const previousItems = [...cartItems];
    const optimisticItems = cartItems.filter(i => i.id !== productId);
    console.log('[CART CLIENT] Optimistically removing item, new count:', optimisticItems.length);
    setCartItems(optimisticItems);
    
    try {
      console.log('[CART CLIENT] Calling API to remove item...');
      const response = await removeItemFromCart(productId, isCombo);
      console.log('[CART CLIENT] API response:', response.success);
      console.log('[CART CLIENT] Response items count:', response.data?.items?.length || 0);
      
      if (response.success) {
        // Sync with backend response
        const items = response.data.items.map((item: any) => {
          const isCombo = item.itemType === 'combo';
          const itemData = isCombo ? item.combo : item.product;
          
          if (!itemData) {
            console.warn('Cart item has no product or combo data:', item);
            return null;
          }
          
          return {
            ...itemData,
            id: itemData._id,
            quantity: item.quantity,
            price: isCombo 
              ? itemData.finalPrice 
              : (itemData.currentPrice || itemData.regularPrice),
            isCombo,
            image: {
              id: `img-${itemData._id}`,
              description: itemData.title || itemData.name,
              imageUrl: (isCombo ? itemData.bannerImage : itemData.images?.[0]) || '/placeholder-product.png',
              imageHint: itemData.title || itemData.name
            }
          };
        }).filter(Boolean);
        
        console.log('[CART CLIENT] Syncing with backend, final count:', items.length);
        setCartItems(items);
        toast({ title: "Item removed from cart." });
        console.log('[CART CLIENT] Remove from cart - SUCCESS');
      } else {
        // Revert optimistic update
        console.error('[CART CLIENT] API returned success: false, reverting');
        setCartItems(previousItems);
        toast({ title: "Failed to remove item from cart.", variant: "destructive" });
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('[CART CLIENT] Remove from cart error:', error);
      console.log('[CART CLIENT] Reverting optimistic update');
      setCartItems(previousItems);
      toast({ title: "Failed to remove item from cart.", variant: "destructive" });
    }
  }, [user, cartItems, toast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(itemId);
    } else {
      try {
        // Find if this is a combo or product
        const item = cartItems.find(i => i.id === itemId);
        const isCombo = item?.isCombo || false;
        
        const response = await addItemToCart(itemId, quantity, isCombo);
        if (response.success) {
          // Refresh cart to get updated data
          await refreshCart();
        }
      } catch (error) {
        toast({ title: "Failed to update quantity.", variant: "destructive" });
      }
    }
  }, [user, cartItems, removeFromCart, refreshCart, toast]);
  
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
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
