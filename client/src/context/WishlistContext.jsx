import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item._id === product._id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item._id !== product._id);
      toast.success('Removed from wishlist');
    } else {
      updated = [...wishlist, product];
      toast.success('Added to wishlist! ❤️');
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
