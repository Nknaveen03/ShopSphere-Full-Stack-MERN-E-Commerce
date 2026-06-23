import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import {
  FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw,
  FiStar, FiZap
} from 'react-icons/fi';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#6366f1' },
  { name: 'Clothing',    icon: '👗', color: '#ec4899' },
  { name: 'Books',       icon: '📚', color: '#f59e0b' },
  { name: 'Home & Garden', icon: '🏠', color: '#10b981' },
  { name: 'Sports',      icon: '⚽', color: '#3b82f6' },
  { name: 'Toys',        icon: '🎮', color: '#8b5cf6' },
  { name: 'Beauty',      icon: '💄', color: '#f43f5e' },
  { name: 'Automotive',  icon: '🚗', color: '#64748b' },
];

const FEATURES = [
  { icon: <FiTruck />,      title: 'Free Shipping',     desc: 'On orders over ₹999' },
  { icon: <FiShield />,     title: 'Secure Payment',    desc: '100% safe & encrypted' },
  { icon: <FiRefreshCw />,  title: 'Easy Returns',      desc: '30-day return policy' },
  { icon: <FiStar />,       title: 'Quality Assured',   desc: 'Only genuine products' },
];

const HomePage = () => {
  const navigate  = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await productsAPI.getFeatured();
        setFeatured(res.data);
      } catch (e) {
        console.error('Failed to load featured products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <FiZap /> New Season Sale — Up to 50% Off
            </div>
            <h1 className="hero-title">
              Discover Premium <span className="gradient-text">Products</span> You'll Love
            </h1>
            <p className="hero-sub">
              Shop thousands of quality products across all categories. Trusted by over 1 million happy customers.
            </p>
            <form className="hero-search" onSubmit={handleHeroSearch}>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search <FiArrowRight />
              </button>
            </form>
            <div className="hero-stats">
              <div className="stat"><strong>50K+</strong><span>Products</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>1M+</strong><span>Customers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-float hero-card-1">🚀 Just arrived</div>
            <div className="hero-img-container">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"
                alt="Shopping"
              />
            </div>
            <div className="hero-card-float hero-card-2">🎉 50% Off Today</div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features-strip">
        <div className="container features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Shop by Category</h2>
              <p>Browse our wide selection of product categories</p>
            </div>
            <Link to="/products" className="btn btn-outline">View All <FiArrowRight /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Hand-picked products just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline">All Products <FiArrowRight /></Link>
          </div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="products-grid">
              {featured.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  className={`stagger-${(index % 8) + 1}`}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiShoppingBag /> Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────── */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div>
            <h2>Exclusive Member Deals 🎁</h2>
            <p>Sign up today and get ₹200 off your first order. Plus free shipping forever!</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Join Now — It's Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
