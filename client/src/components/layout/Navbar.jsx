import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut,
  FiPackage, FiShield, FiHeart, FiSun, FiMoon
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropOpen, setDropOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">

        <Link to="/" className="nav-logo">
          <span className="logo-icon">◈</span>
          ShopSphere
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FiSearch size={18} />
          </button>
        </form>

        <div className="nav-links">
          <NavLink to="/" className="nav-link" end>Home</NavLink>
          <NavLink to="/products" className="nav-link">Products</NavLink>
        </div>

        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="nav-icon-btn theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Wishlist */}
          <Link to="/dashboard?tab=wishlist" className="nav-icon-btn wishlist-icon-btn" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
          </Link>

          {/* Cart */}
          <button onClick={() => setCartDrawerOpen(true)} className="nav-icon-btn" aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu" onMouseLeave={() => setDropOpen(false)}>
              <button
                className="nav-icon-btn user-btn"
                onClick={() => setDropOpen(!dropOpen)}
                aria-label="User menu"
              >
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              </button>
              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiUser size={15} /> My Dashboard
                  </Link>
                  <Link to="/dashboard?tab=wishlist" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiHeart size={15} /> My Wishlist
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      <FiShield size={15} style={{ color: 'var(--primary)' }} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard?tab=orders" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="mobile-actions">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="nav-icon-btn theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <Link to="/dashboard?tab=wishlist" className="nav-icon-btn" aria-label="Wishlist">
            <FiHeart size={18} />
            {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
          </Link>
          <button onClick={() => setCartDrawerOpen(true)} className="nav-icon-btn" aria-label="Cart">
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><FiSearch size={16} /></button>
          </form>

          <NavLink to="/" onClick={() => setMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
          <NavLink to="/dashboard?tab=wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
              )}
              <button className="mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
