// ============================================================
// AdminUserList - User management panel for administrators
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiSearch, FiShield, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminUserList.css';

const AdminUserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (id === currentUser._id) {
      toast.error('You cannot delete your own admin account!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? All their cart and order histories will be orphaned.')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('User account deleted successfully');
        loadUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
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
          <Link to="/admin/orders" className="admin-nav-item">Orders</Link>
          <Link to="/admin/users" className="admin-nav-item active">Users</Link>
          <hr className="admin-divider" />
          <Link to="/" className="admin-nav-item back-shop">Back to Shop</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>User Management</h2>
          <p>Review and delete accounts, or monitor administrator profiles</p>
        </header>

        {/* Toolbar */}
        <section className="admin-toolbar">
          <div className="admin-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search users by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Users Table */}
        <section className="admin-card user-table-card">
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>Verify spelling or wait for new user registration.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>User Details</th>
                    <th>Join Date</th>
                    <th>Role Privilege</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === currentUser._id;
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className="avatar-preview-circle">
                            {u.name?.charAt(0).toUpperCase() || <FiUser />}
                          </div>
                        </td>
                        <td>
                          <div className="user-table-cell">
                            <strong>
                              {u.name} {isSelf && <span className="self-badge">(You)</span>}
                            </strong>
                            <span>{u.email}</span>
                            {u.phone && <span className="user-sub-phone">📞 {u.phone}</span>}
                          </div>
                        </td>
                        <td>
                          {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="action-btn delete"
                              disabled={isSelf}
                              onClick={() => handleDeleteUser(u._id)}
                              title={isSelf ? 'Cannot delete yourself' : 'Delete Account'}
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
    </div>
  );
};

export default AdminUserList;
