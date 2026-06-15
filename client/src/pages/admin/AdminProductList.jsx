// ============================================================
// AdminProductList - Product inventory management (CRUD)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, adminAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiShield, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminProductList.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'];

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  // Form Modals State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Form Fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    brand: '',
    isFeatured: false,
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 }; // Fetch a large batch for admin search
      if (keyword) params.keyword = keyword;
      if (category !== 'All') params.category = category;

      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [keyword, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentProductId(null);
    setForm({
      title: '',
      description: '',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      stock: '',
      image: '',
      brand: '',
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditMode(true);
    setCurrentProductId(p._id);
    setForm({
      title: p.title || '',
      description: p.description || '',
      category: p.category || 'Electronics',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      stock: p.stock !== undefined ? p.stock : 0,
      image: p.image || '',
      brand: p.brand || '',
      isFeatured: !!p.isFeatured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || form.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        // Sync images array with single image
        images: form.image ? [form.image] : undefined
      };

      if (editMode) {
        await adminAPI.updateProduct(currentProductId, payload);
        toast.success('Product updated successfully!');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created successfully!');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

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
          <Link to="/admin/products" className="admin-nav-item active">Products</Link>
          <Link to="/admin/orders" className="admin-nav-item">Orders</Link>
          <Link to="/admin/users" className="admin-nav-item">Users</Link>
          <hr className="admin-divider" />
          <Link to="/" className="admin-nav-item back-shop">Back to Shop</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="admin-header product-list-header">
          <div>
            <h2>Product Catalog</h2>
            <p>Manage store inventory, details, and stock levels</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <FiPlus /> Add Product
          </button>
        </header>

        {/* Toolbar & Filter Options */}
        <section className="admin-toolbar">
          <div className="admin-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search products by title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="admin-filter">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Products Table */}
        <section className="admin-card product-table-card">
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try resetting filters or adding new products.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={p.image}
                          alt={p.title}
                          className="table-product-thumbnail"
                          onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?'; }}
                        />
                      </td>
                      <td>
                        <div className="user-table-cell">
                          <strong>{p.title}</strong>
                          <span>Brand: {p.brand || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{p.category}</span>
                      </td>
                      <td>
                        <div className="price-stack">
                          <strong>₹{p.price}</strong>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="original-strike">₹{p.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`stock-indicator ${p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>
                        {p.isFeatured ? (
                          <span className="featured-check-badge"><FiCheck /> Yes</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="action-btn edit" onClick={() => handleOpenEdit(p)} title="Edit Details">
                            <FiEdit2 size={15} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(p._id)} title="Delete Product">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="admin-modal-card">
            <header className="modal-header">
              <h3>{editMode ? 'Edit Product Details' : 'Add New Product'}</h3>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </button>
            </header>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Mechanical Gaming Keyboard"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Provide details about specs, features, etc."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    className="form-control"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    value={form.brand}
                    onChange={handleFormChange}
                    placeholder="e.g. Logitech"
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="Price"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    className="form-control"
                    value={form.originalPrice}
                    onChange={handleFormChange}
                    placeholder="List price"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Initial Stock Count *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={form.stock}
                    onChange={handleFormChange}
                    placeholder="Stock Qty"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image Link / URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={form.image}
                  onChange={handleFormChange}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleFormChange}
                />
                <label htmlFor="isFeatured">Display product in 'Featured Products' on homepage</label>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Save Changes' : 'Add Product'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
