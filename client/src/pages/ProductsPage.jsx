import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL
  const [keyword,  setKeyword]  = useState(searchParams.get('keyword')  || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || 'newest');
  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1);

  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [inputKey,   setInputKey]   = useState(keyword); // controlled search input

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 12 };
      if (keyword)            params.keyword  = keyword;
      if (category !== 'All') params.category = category;
      if (minPrice)           params.minPrice = minPrice;
      if (maxPrice)           params.maxPrice = maxPrice;

      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync URL params
  useEffect(() => {
    const p = {};
    if (keyword)            p.keyword  = keyword;
    if (category !== 'All') p.category = category;
    if (minPrice)           p.minPrice = minPrice;
    if (maxPrice)           p.maxPrice = maxPrice;
    if (sort !== 'newest')  p.sort     = sort;
    if (page > 1)           p.page     = page;
    setSearchParams(p, { replace: true });
  }, [keyword, category, minPrice, maxPrice, sort, page, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(inputKey);
    setPage(1);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const clearFilters = () => {
    setKeyword(''); setInputKey('');
    setCategory('All');
    setMinPrice(''); setMaxPrice('');
    setSort('newest'); setPage(1);
  };

  const hasActiveFilters = keyword || category !== 'All' || minPrice || maxPrice;

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <p>Discover {pagination.total || '...'} amazing products</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* ── Sidebar Filters ─────────────────────────────── */}
        <aside className={`filters-sidebar${showFilter ? ' open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <FiX size={14} /> Clear All
              </button>
            )}
          </div>

          {/* Category */}
          <div className="filter-group">
            <h4>Category</h4>
            <div className="category-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn${category === cat ? ' active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4>Price Range (₹)</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="form-control"
                min="0"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="form-control"
                min="0"
              />
            </div>
          </div>

          {/* Quick price buttons */}
          <div className="quick-prices">
            {[['Under ₹1K', '', '1000'], ['₹1K–5K', '1000', '5000'], ['₹5K–20K', '5000', '20000'], ['Over ₹20K', '20000', '']].map(([label, min, max]) => (
              <button
                key={label}
                className={`quick-price-btn${minPrice === min && maxPrice === max ? ' active' : ''}`}
                onClick={() => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <form className="search-bar" onSubmit={handleSearch}>
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              {inputKey && (
                <button type="button" className="clear-search" onClick={() => { setInputKey(''); setKeyword(''); setPage(1); }}>
                  <FiX size={14} />
                </button>
              )}
            </form>

            <div className="toolbar-right">
              <select className="sort-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button className="filter-toggle-btn" onClick={() => setShowFilter(!showFilter)}>
                <FiFilter size={15} /> Filters
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="active-filters">
              {keyword && <span className="filter-chip">Search: "{keyword}" <button onClick={() => { setKeyword(''); setInputKey(''); }}>×</button></span>}
              {category !== 'All' && <span className="filter-chip">{category} <button onClick={() => setCategory('All')}>×</button></span>}
              {(minPrice || maxPrice) && (
                <span className="filter-chip">
                  Price: {minPrice ? `₹${minPrice}` : '0'} – {maxPrice ? `₹${maxPrice}` : '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <p className="results-count">
              Showing {products.length} of {pagination.total || 0} products
            </p>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try different search terms or clear the filters</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="pg-products-grid">
              {products.map((p, index) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  className={`stagger-${(index % 12) + 1}`}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <FiChevronLeft /> Prev
              </button>

              <div className="page-numbers">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="dots">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`page-num${page === p ? ' active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                className="page-btn"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
