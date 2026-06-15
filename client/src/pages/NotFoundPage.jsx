import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</div>
    <h1 style={{ fontSize: '2rem', marginBottom: '.75rem' }}>Page Not Found</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.7 }}>
      Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" className="btn btn-primary"><FiHome /> Go Home</Link>
      <Link to="/products" className="btn btn-outline"><FiShoppingBag /> Browse Products</Link>
    </div>
  </div>
);

export default NotFoundPage;
