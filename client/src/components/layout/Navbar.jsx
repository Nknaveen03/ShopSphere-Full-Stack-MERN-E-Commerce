// ============================================================
// Navbar Component
// ============================================================
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropOpen,    setDropOpen]    = useState(false);

  // Track scroll for navbar shadow
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

        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">◈</span>
          ShopSphere
        </Link>

        {/* Desktop Search */}
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

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <NavLink to="/"        className="nav-link" end>Home</NavLink>
          <NavLink to="/products" className="nav-link">Products</NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

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

        {/* Mobile Menu Toggle */}
        <div className="mobile-actions">
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
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

          <NavLink to="/"        onClick={() => setMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>

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
              <Link to="/login"    className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
