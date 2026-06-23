import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './CartDrawer.css';

const CartDrawer = () => {
  const {
    cart,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart
  } = useCart();
  const navigate = useNavigate();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCartDrawerOpen(false);
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cart-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('cart-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('cart-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart ({cart.items?.reduce((a, c) => a + c.quantity, 0) || 0})</h3>
          <button className="close-btn" onClick={() => setCartDrawerOpen(false)} aria-label="Close cart">
            <FiX size={22} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {!cart.items || cart.items.length === 0 ? (
            <div className="empty-cart-view">
              <FiShoppingBag className="empty-icon" />
              <p>Your shopping cart is empty</p>
              <button className="btn btn-primary" onClick={() => setCartDrawerOpen(false)}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.items.map((item) => (
                <div key={item.product._id} className="cart-drawer-item">
                  <div className="item-img">
                    <img src={item.product.image} alt={item.product.title} />
                  </div>
                  <div className="item-details">
                    <h4>{item.product.title}</h4>
                    <p className="item-price">₹{item.product.price.toLocaleString('en-IN')}</p>
                    <div className="item-qty-row">
                      <div className="qty-selector">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button className="delete-btn" onClick={() => removeFromCart(item.product._id)} aria-label="Remove item">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items && cart.items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <span className="subtotal-amount">₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <p className="footer-notice">Shipping and taxes calculated at checkout.</p>
            <div className="footer-actions">
              <button className="btn btn-outline" onClick={() => { setCartDrawerOpen(false); navigate('/cart'); }}>
                View Cart
              </button>
              <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
