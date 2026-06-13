// ============================================================
// AuthContext - Manages user authentication state globally
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true on initial load

  // ─── Load user from localStorage on mount ──────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ─── Register ──────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token, user: userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    toast.success('Account created successfully! 🎉');
    return userData;
  };

  // ─── Login ─────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}! 👋`);
    return userData;
  };

  // ─── Logout ────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // ─── Update profile ────────────────────────────────────
  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    const updatedUser = res.data.user;

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success('Profile updated!');
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
