import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '../../features/products/types/product';

const CART_STORAGE_KEY = 'dermas-customer-cart';

export type CartItem = {
  productId: string;
  sku: string;
  name: string;
  category: string;
  units: number;
  minUnits: number;
  availableUnits: number;
  pricePerUnit: number;
  priceLabel: string;
  color: string;
};

type CartContextValue = {
  items: CartItem[];
  totalUnits: number;
  totalAmount: number;
  setItemQuantity: (product: Product, units: number) => void;
  syncProducts: (products: Product[]) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItemUnits: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

const toCartItem = (product: Product, units: number): CartItem => ({
  productId: product.id,
  sku: product.sku,
  name: product.name,
  category: product.category,
  units,
  minUnits: product.minUnits,
  availableUnits: product.availableUnits,
  pricePerUnit: product.pricePerUnit,
  priceLabel: product.priceLabel,
  color: product.color,
});

const clampItemUnits = (item: CartItem, units: number) => {
  if (units <= 0) {
    return 0;
  }

  return Math.max(item.minUnits, Math.min(item.availableUnits, Math.floor(units)));
};

const readStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CartItem[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const setItemQuantity = (product: Product, units: number) => {
    setItems((currentItems) => {
      if (product.availableUnits < product.minUnits) {
        return currentItems.filter((item) => item.productId !== product.id);
      }

      if (units <= 0) {
        return currentItems.filter((item) => item.productId !== product.id);
      }

      const normalizedUnits = Math.max(product.minUnits, Math.min(product.availableUnits, Math.floor(units)));
      const nextItem = toCartItem(product, normalizedUnits);
      const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

      if (existingIndex === -1) {
        return [nextItem, ...currentItems];
      }

      return currentItems.map((item, index) => (index === existingIndex ? nextItem : item));
    });
  };

  const syncProducts = (products: Product[]) => {
    const productMap = new Map(products.map((product) => [product.id, product]));

    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        const product = productMap.get(item.productId);

        if (!product || product.availableUnits < product.minUnits) {
          return [];
        }

        const nextUnits = Math.min(item.units, product.availableUnits);

        if (nextUnits <= 0) {
          return [];
        }

        return [toCartItem(product, Math.max(product.minUnits, nextUnits))];
      }),
    );
  };

  const incrementItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              units: clampItemUnits(item, item.units + 1),
            }
          : item,
      ),
    );
  };

  const decrementItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.productId !== productId) {
          return [item];
        }

        const nextUnits = item.units - 1;

        if (nextUnits < item.minUnits) {
          return [];
        }

        return [
          {
            ...item,
            units: clampItemUnits(item, nextUnits),
          },
        ];
      }),
    );
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalUnits = items.reduce((sum, item) => sum + item.units, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.units * item.pricePerUnit, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalUnits,
        totalAmount,
        setItemQuantity,
        syncProducts,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        getItemUnits: (productId: string) => items.find((item) => item.productId === productId)?.units ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
};
