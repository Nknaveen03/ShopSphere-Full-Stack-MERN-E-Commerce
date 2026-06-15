// ============================================================
// AdminOrderList - Order tracking and status management
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FiEdit2, FiTrash2, FiSearch, FiShield, FiX, FiEye, FiMapPin, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminOrderList.css';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending:    { bg: '#fffbeb', color: '#92400e' },
  Processing: { bg: '#eff6ff', color: '#1e40af' },
  Shipped:    { bg: '#e0f2fe', color: '#0369a1' },
  Delivered:  { bg: '#ecfdf5', color: '#166534' },
  Cancelled:  { bg: '#fef2f2', color: '#991b1b' },
};

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Order for status changes or detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllOrders();
      // Server returns { orders, totalRevenue }
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setStatusInput(order.status);
    setShowDetailModal(true);
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!statusInput || !selectedOrder) return;

    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(selectedOrder._id, statusInput);
      toast.success(`Order status updated to ${statusInput}`);
      setShowDetailModal(false);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      try {
        await adminAPI.deleteOrder(id);
        toast.success('Order deleted successfully');
        loadOrders();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo-title">
          <FiShield size={22} className="admin-icon-brand" />
          <span>ShopSphere Admin</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-item">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-item">Products</Link>
          <Link to="/admin/orders" className="admin-nav-item active">Orders</Link>
          <Link to="/admin/users" className="admin-nav-item">Users</Link>
          <hr className="admin-divider" />
          <Link to="/" className="admin-nav-item back-shop">Back to Shop</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Customer Orders</h2>
          <p>Update order shipping status, track entries, and manage refunds</p>
        </header>

        {/* Search Toolbar */}
        <section className="admin-toolbar">
          <div className="admin-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by Order ID, Customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Orders Table */}
        <section className="admin-card orders-table-card">
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>Verify search queries or wait for customers to place orders.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date Placed</th>
                    <th>Total Price</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                    return (
                      <tr key={order._id}>
                        <td>
                          <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                        </td>
                        <td>
                          <div className="user-table-cell">
                            <strong>{order.user?.name || 'Guest User'}</strong>
                            <span>{order.user?.email || ''}</span>
                          </div>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <strong>{formatPrice(order.totalAmount)}</strong>
                        </td>
                        <td>
                          <span className="payment-method-badge">{order.paymentMethod}</span>
                        </td>
                        <td>
                          <span
                            className="order-status-badge pointer"
                            style={{ background: sc.bg, color: sc.color }}
                            onClick={() => handleOpenDetails(order)}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="action-btn edit"
                              onClick={() => handleOpenDetails(order)}
                              title="Update Status / View Details"
                            >
                              <FiEye size={15} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteOrder(order._id)}
                              title="Delete Order"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Order Details & Status Update Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-backdrop">
          <div className="admin-modal-card order-detail-modal">
            <header className="modal-header">
              <h3>Order Details: #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
              <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>
                <FiX size={20} />
              </button>
            </header>
            <div className="modal-body scrollable-modal-content">
              {/* Status Update Form */}
              <div className="modal-sub-card status-edit-section">
                <h4>Update Order Status</h4>
                <form onSubmit={handleStatusChange} className="status-update-row">
                  <select
                    className="form-control"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? 'Saving...' : 'Update Status'}
                  </button>
                </form>
              </div>

              {/* Customer Info */}
              <div className="order-details-grid-modal">
                <div className="detail-col">
                  <h5><FiMapPin /> Shipping Details</h5>
                  <div className="shipping-box-detail">
                    <strong>{selectedOrder.shippingAddress?.fullName}</strong>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} –{' '}
                      {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                    <p>📞 Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                <div className="detail-col">
                  <h5>Summary</h5>
                  <div className="modal-summary-list">
                    <p><span>Payment Method:</span> <strong>{selectedOrder.paymentMethod}</strong></p>
                    <p>
                      <span>Paid:</span>{' '}
                      <strong className={selectedOrder.isPaid ? 'paid-yes' : 'paid-no'}>
                        {selectedOrder.isPaid ? '✓ Yes' : '✕ No'}
                      </strong>
                    </p>
                    <p><span>Subtotal:</span> <span>{formatPrice(selectedOrder.itemsPrice || 0)}</span></p>
                    <p><span>Shipping:</span> <span>{formatPrice(selectedOrder.shippingPrice || 0)}</span></p>
                    <p><span>GST Tax (18%):</span> <span>{formatPrice(selectedOrder.taxPrice || 0)}</span></p>
                    <hr className="divider" />
                    <p className="total-modal-row">
                      <span>Total Amount:</span> <strong>{formatPrice(selectedOrder.totalAmount || 0)}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="modal-order-items">
                <h5><FiPackage /> Items List ({selectedOrder.orderItems?.length})</h5>
                <div className="modal-items-list-wrap">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item._id} className="modal-item-row-preview">
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/48x48?text=?';
                        }}
                      />
                      <div className="modal-item-details">
                        <strong>{item.title}</strong>
                        <span>₹{item.price} x {item.quantity}</span>
                      </div>
                      <div className="modal-item-total">
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <footer className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
