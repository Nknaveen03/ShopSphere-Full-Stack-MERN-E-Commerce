import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

// Format price in Indian Rupees
const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// Render star rating
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0' }}>★</span>
    );
  }
  return <span className="star-row">{stars} <span className="rating-num">{rating?.toFixed(1)}</span></span>;
};

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Don't navigate to product page
    await addToCart(product._id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const isWish = isInWishlist(product._id);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className={`product-card animate-fade-slide ${className}`}>
      {/* Image */}
      <div className="product-img-wrap">
        <img
          src={product.image || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Product'; }}
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        <button
          className={`wishlist-btn${isWish ? ' active' : ''}`}
          aria-label="Wishlist"
          onClick={handleWishlist}
        >
          <FiHeart size={16} fill={isWish ? 'var(--accent)' : 'none'} style={{ color: isWish ? 'var(--accent)' : 'inherit' }} />
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>

        <StarRating rating={product.rating} />

        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={15} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
