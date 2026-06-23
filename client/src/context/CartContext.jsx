import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart,    setCart]    = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);

  // ─── Fetch cart from server ─────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data || { items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ─── Add to cart ────────────────────────────────────────
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      const res = await cartAPI.addToCart({ productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart! 🛒');
      setCartDrawerOpen(true);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  // ─── Update quantity ────────────────────────────────────
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartAPI.updateItem({ productId, quantity });
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  // ─── Remove item ────────────────────────────────────────
  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.removeItem(productId);
      setCart(res.data.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // ─── Clear cart ─────────────────────────────────────────
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  // ─── Computed values ────────────────────────────────────
  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    cartCount,
    isCartDrawerOpen,
    setCartDrawerOpen,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartContext;
