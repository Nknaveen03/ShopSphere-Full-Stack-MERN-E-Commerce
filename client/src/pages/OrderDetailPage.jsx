import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';
import './OrderDetailPage.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STATUS_COLORS = {
  Pending:    { bg: '#fffbeb', color: '#92400e' },
  Processing: { bg: '#eff6ff', color: '#1e40af' },
  Shipped:    { bg: '#ecfdf5', color: '#065f46' },
  Delivered:  { bg: '#ecfdf5', color: '#166534' },
  Cancelled:  { bg: '#fef2f2', color: '#991b1b' },
};

const OrderDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ordersAPI.getById(id);
        setOrder(res.data);
      } catch {
        navigate('/dashboard?tab=orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!order)  return null;

  const sc           = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
  const stepIndex    = STATUS_STEPS.indexOf(order.status);
  const isCancelled  = order.status === 'Cancelled';

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <div className="container">
          <h1>Order Details</h1>
          <p>Order #{order._id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="container order-detail-layout">
        <div className="order-detail-main">
          {/* Status Timeline */}
          {!isCancelled && (
            <div className="order-timeline-card">
              <h3>Order Status</h3>
              <div className="timeline">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className={`timeline-step${i <= stepIndex ? ' done' : ''}${i === stepIndex ? ' current' : ''}`}>
                    <div className="t-dot">{i < stepIndex ? '✓' : i + 1}</div>
                    {i < STATUS_STEPS.length - 1 && <div className={`t-line${i < stepIndex ? ' done' : ''}`} />}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="cancelled-banner">
              <span>✕</span> This order has been cancelled.
            </div>
          )}

          {/* Order Items */}
          <div className="order-items-card">
            <h3><FiPackage /> Order Items ({order.orderItems.length})</h3>
            <div className="order-items-list">
              {order.orderItems.map((item) => (
                <div key={item._id} className="order-item-row">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/72x72?text=?'; }}
                  />
                  <div className="oi-details">
                    <Link to={`/products/${item.product}`} className="oi-title">{item.title}</Link>
                    <span className="oi-qty">Qty: {item.quantity}</span>
                  </div>
                  <div className="oi-price">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                    <span>{formatPrice(item.price)} each</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-section-card">
            <h3><FiMapPin /> Shipping Address</h3>
            <div className="address-box">
              <strong>{order.shippingAddress.fullName}</strong>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="order-detail-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="os-status-row">
              <span className="os-badge" style={{ background: sc.bg, color: sc.color }}>{order.status}</span>
              <span className="os-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="os-rows">
              <div className="os-row"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="os-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
              <div className="os-row"><span>GST</span><span>{formatPrice(order.taxPrice)}</span></div>
              <hr className="divider" />
              <div className="os-row os-total"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
            </div>
            <div className="os-payment">
              <FiCreditCard size={14} />
              Payment: <strong>{order.paymentMethod}</strong>
            </div>
          </div>

          <button className="back-link" onClick={() => navigate('/dashboard?tab=orders')} style={{ width: '100%', justifyContent: 'center' }}>
            <FiArrowLeft /> Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
