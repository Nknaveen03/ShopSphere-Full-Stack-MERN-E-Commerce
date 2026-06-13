// ============================================================
// DashboardPage - Profile + Order History
// ============================================================
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { FiUser, FiPackage, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import './DashboardPage.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const STATUS_COLORS = {
  Pending:    { bg: '#fffbeb', color: '#92400e' },
  Processing: { bg: '#eff6ff', color: '#1e40af' },
  Shipped:    { bg: '#ecfdf5', color: '#065f46' },
  Delivered:  { bg: '#ecfdf5', color: '#065f46' },
  Cancelled:  { bg: '#fef2f2', color: '#991b1b' },
};

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateProfile } = useAuth();

  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam);

  const [orders,      setOrders]      = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing,     setEditing]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city:   user?.address?.city   || '',
      state:  user?.address?.state  || '',
      country: user?.address?.country || 'India',
    },
  });

  useEffect(() => { setActiveTab(searchParams.get('tab') || 'profile'); }, [searchParams]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      const load = async () => {
        setOrdersLoading(true);
        try {
          const res = await ordersAPI.getMyOrders();
          setOrders(res.data);
        } catch { /* silent */ }
        finally { setOrdersLoading(false); }
      };
      load();
    }
  }, [activeTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'profile' ? {} : { tab });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      setEditing(false);
    } catch { /* toast shown inside context */ }
    finally { setSaving(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Manage your account and track orders</p>
        </div>
      </div>

      <div className="container dashboard-layout">
        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="dash-sidebar">
          <div className="dash-user-card">
            <div className="dash-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <nav className="dash-nav">
            <button className={`dash-nav-item${activeTab === 'profile' ? ' active' : ''}`} onClick={() => switchTab('profile')}>
              <FiUser /> Profile
            </button>
            <button className={`dash-nav-item${activeTab === 'orders' ? ' active' : ''}`} onClick={() => switchTab('orders')}>
              <FiPackage /> My Orders
            </button>
          </nav>
        </aside>

        {/* ── Content ────────────────────────────────────── */}
        <div className="dash-content">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Profile Information</h3>
                {!editing ? (
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                ) : (
                  <button className="btn btn-sm" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => setEditing(false)}>
                    <FiX size={14} /> Cancel
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="profile-view">
                  <div className="profile-grid">
                    <div className="profile-field"><span>Full Name</span><strong>{user?.name || '—'}</strong></div>
                    <div className="profile-field"><span>Email</span><strong>{user?.email}</strong></div>
                    <div className="profile-field"><span>Phone</span><strong>{user?.phone || '—'}</strong></div>
                    <div className="profile-field"><span>Role</span><strong className={`role-badge ${user?.role}`}>{user?.role}</strong></div>
                    {user?.address?.street && (
                      <div className="profile-field full-width">
                        <span>Address</span>
                        <strong>{user.address.street}, {user.address.city}, {user.address.state}, {user.address.country}</strong>
                      </div>
                    )}
                    <div className="profile-field"><span>Member Since</span><strong>{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</strong></div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} className="profile-edit-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input className="form-control" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-control" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input className="form-control" value={profileForm.address.street} onChange={(e) => setProfileForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
                  </div>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label>City</label>
                      <input className="form-control" value={profileForm.address.city} onChange={(e) => setProfileForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="form-control" value={profileForm.address.state} onChange={(e) => setProfileForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input className="form-control" value={profileForm.address.country} onChange={(e) => setProfileForm((f) => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="dash-card">
              <div className="dash-card-header">
                <h3>Order History</h3>
                <span className="order-count">{orders.length} orders</span>
              </div>

              {ordersLoading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>When you place an order, it will appear here.</p>
                  <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                    return (
                      <div key={order._id} className="order-card">
                        <div className="order-card-header">
                          <div>
                            <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                            <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className="order-status-badge" style={{ background: sc.bg, color: sc.color }}>
                            {order.status}
                          </span>
                        </div>

                        <div className="order-items-preview">
                          {order.orderItems.slice(0, 3).map((item) => (
                            <img
                              key={item._id}
                              src={item.image}
                              alt={item.title}
                              title={item.title}
                              onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?'; }}
                            />
                          ))}
                          {order.orderItems.length > 3 && (
                            <span className="more-items">+{order.orderItems.length - 3}</span>
                          )}
                        </div>

                        <div className="order-card-footer">
                          <span className="order-total">{formatPrice(order.totalAmount)}</span>
                          <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
