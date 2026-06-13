// ============================================================
// ProductDetailPage
// ============================================================
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FiShoppingCart, FiArrowLeft, FiStar, FiTruck,
  FiShield, FiRefreshCw, FiMinus, FiPlus, FiZap
} from 'react-icons/fi';
import './ProductDetailPage.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product,    setProduct]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [qty,        setQty]        = useState(1);
  const [activeImg,  setActiveImg]  = useState(0);
  const [adding,     setAdding]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    const ok = await addToCart(product._id, qty);
    setAdding(false);
    if (ok) navigate('/cart');
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> /
          <Link to="/products">Products</Link> /
          <Link to={`/products?category=${product.category}`}>{product.category}</Link> /
          <span>{product.title}</span>
        </nav>

        <div className="detail-grid">
          {/* ── Images ─────────────────────────────────────── */}
          <div className="detail-images">
            <div className="main-image">
              <img
                src={images[activeImg] || product.image}
                alt={product.title}
                onError={(e) => { e.target.src = 'https://placehold.co/600x500?text=Product'; }}
              />
              {discount > 0 && <div className="detail-discount-badge">-{discount}% OFF</div>}
            </div>
            {images.length > 1 && (
              <div className="thumb-list">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb${activeImg === i ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ───────────────────────────────────────── */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-title">{product.title}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="stars">
                {stars.map((s) => (
                  <FiStar
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                    stroke={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating?.toFixed(1)}</span>
              <span className="review-count">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="detail-price-block">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">{formatPrice(product.originalPrice)}</span>
                  <span className="detail-save">Save {formatPrice(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              <span className="stock-dot" />
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className="detail-description">{product.description}</p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <>
                <div className="qty-row">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      disabled={qty >= product.stock}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="btn btn-primary btn-lg detail-cart-btn" onClick={handleAddToCart} disabled={adding}>
                    <FiShoppingCart /> {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button className="btn btn-outline btn-lg detail-buy-btn" onClick={handleBuyNow} disabled={adding}>
                    <FiZap /> Buy Now
                  </button>
                </div>
              </>
            )}

            {/* Guarantees */}
            <div className="guarantees">
              {[
                { icon: <FiTruck />,      text: 'Free delivery on orders over ₹999' },
                { icon: <FiShield />,     text: '100% secure payment' },
                { icon: <FiRefreshCw />,  text: '30-day easy returns' },
              ].map(({ icon, text }) => (
                <div key={text} className="guarantee-item">
                  <span className="g-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Brand / tags */}
            {product.brand && (
              <div className="detail-meta">
                <span className="meta-label">Brand:</span>
                <span className="meta-value">{product.brand}</span>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <button className="back-link" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
