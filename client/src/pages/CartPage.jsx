import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTruck } from 'react-icons/fi';
import './CartPage.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  const items = cart?.items || [];
  const subtotal     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping     = subtotal > 999 ? 0 : 99;
  const tax          = Math.round(subtotal * 0.18);
  const total        = subtotal + shipping + tax;

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container cart-layout">
        {items.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              <FiShoppingBag /> Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ── Cart Items ─────────────────────────────────── */}
            <div className="cart-items">
              <div className="cart-items-header">
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
                <span />
              </div>

              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div key={item._id || product._id} className="cart-item">
                    {/* Product info */}
                    <div className="cart-item-product">
                      <img
                        src={product.image}
                        alt={product.title}
                        onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=?'; }}
                      />
                      <div className="cart-item-details">
                        <Link to={`/products/${product._id}`} className="cart-item-title">
                          {product.title}
                        </Link>
                        {product.stock < 5 && product.stock > 0 && (
                          <span className="low-stock-warn">Only {product.stock} left</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price">{formatPrice(item.price)}</div>

                    {/* Qty control */}
                    <div className="cart-qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    {/* Item total */}
                    <div className="cart-item-total">{formatPrice(item.price * item.quantity)}</div>

                    {/* Remove */}
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(product._id)}
                      aria-label="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr className="divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="free-shipping-notice">
                  <FiTruck size={14} />
                  Add {formatPrice(999 - subtotal)} more for free shipping!
                </div>
              )}

              <button
                className="btn btn-primary btn-full btn-lg checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              <Link to="/products" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
