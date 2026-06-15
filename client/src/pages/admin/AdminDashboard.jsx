// ============================================================
// AdminDashboard - Overview statistics for administrators
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  FiUsers, FiShoppingBag, FiLayers, FiDollarSign,
  FiTrendingUp, FiArrowRight, FiShield
} from 'react-icons/fi';
import './AdminDashboard.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const STATUS_COLORS = {
  Pending:    { bg: '#fffbeb', color: '#92400e' },
  Processing: { bg: '#eff6ff', color: '#1e40af' },
  Shipped:    { bg: '#ecfdf5', color: '#065f46' },
  Delivered:  { bg: '#ecfdf5', color: '#166534' },
  Cancelled:  { bg: '#fef2f2', color: '#991b1b' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="form-error-banner">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo-title">
          <FiShield size={22} className="admin-icon-brand" />
          <span>ShopSphere Admin</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-item active">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-item">Products</Link>
          <Link to="/admin/orders" className="admin-nav-item">Orders</Link>
          <Link to="/admin/users" className="admin-nav-item">Users</Link>
          <hr className="admin-divider" />
          <Link to="/" className="admin-nav-item back-shop">Back to Shop</Link>
        </nav>
      </aside>

      {/* Admin Content Area */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Overview Dashboard</h2>
          <p>Real-time shop status and performance</p>
        </header>

        {/* Quick Stat Cards */}
        <section className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-card-inner">
              <div>
                <span>Total Revenue</span>
                <h3>{formatPrice(stats?.totalRevenue || 0)}</h3>
              </div>
              <div className="stat-card-icon"><FiDollarSign size={24} /></div>
            </div>
            <div className="stat-card-footer">
              <FiTrendingUp /> <span>12% growth this month</span>
            </div>
          </div>

          <div className="stat-card orders">
            <div className="stat-card-inner">
              <div>
                <span>Total Orders</span>
                <h3>{stats?.totalOrders || 0}</h3>
              </div>
              <div className="stat-card-icon"><FiShoppingBag size={24} /></div>
            </div>
            <div className="stat-card-footer">
              <span>Customer order entries</span>
            </div>
          </div>

          <div className="stat-card products">
            <div className="stat-card-inner">
              <div>
                <span>Products In Stock</span>
                <h3>{stats?.totalProducts || 0}</h3>
              </div>
              <div className="stat-card-icon"><FiLayers size={24} /></div>
            </div>
            <div className="stat-card-footer">
              <Link to="/admin/products" className="admin-card-link">Manage inventory <FiArrowRight /></Link>
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-card-inner">
              <div>
                <span>Registered Users</span>
                <h3>{stats?.totalUsers || 0}</h3>
              </div>
              <div className="stat-card-icon"><FiUsers size={24} /></div>
            </div>
            <div className="stat-card-footer">
              <Link to="/admin/users" className="admin-card-link">View accounts <FiArrowRight /></Link>
            </div>
          </div>
        </section>

        {/* Dashboard Detailed Grid */}
        <section className="admin-details-grid">
          {/* Recent Orders */}
          <div className="admin-card recent-orders-card">
            <div className="admin-card-header">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="btn btn-outline btn-sm">All Orders</Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No orders found yet</td>
                    </tr>
                  ) : (
                    stats?.recentOrders?.map((order) => {
                      const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                      return (
                        <tr key={order._id}>
                          <td><strong>#{order._id.slice(-8).toUpperCase()}</strong></td>
                          <td>
                            <div className="user-table-cell">
                              <strong>{order.user?.name || 'Guest User'}</strong>
                              <span>{order.user?.email || ''}</span>
                            </div>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td>{formatPrice(order.totalAmount)}</td>
                          <td>
                            <span className="order-status-badge" style={{ background: sc.bg, color: sc.color }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categories Inventory Breakdown */}
          <div className="admin-card categories-breakdown-card">
            <div className="admin-card-header">
              <h3>Category Breakdown</h3>
            </div>
            <div className="category-list-breakdown">
              {stats?.categoriesCount?.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>No items seeded in catalog</p>
              ) : (
                stats?.categoriesCount?.map((cat) => (
                  <div key={cat.category} className="cat-breakdown-item">
                    <div className="cat-breakdown-info">
                      <span className="cat-title">{cat.category}</span>
                      <span className="cat-count">{cat.count} products</span>
                    </div>
                    <div className="cat-progress-bar">
                      <div
                        className="cat-progress-fill"
                        style={{
                          width: `${Math.min(100, (cat.count / (stats.totalProducts || 1)) * 100)}%`,
                          backgroundColor: 'var(--primary)'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
