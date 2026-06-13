// ============================================================
// LoginPage
// ============================================================
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPages.css';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [form,     setForm]     = useState({ email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Demo fill
  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@shopsphere.com', password: 'Admin@123' });
    else setForm({ email: 'user@demo.com', password: 'Demo@123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">◈ ShopSphere</Link>
          <h2>Welcome back!</h2>
          <p>Sign in to continue your shopping journey.</p>
        </div>
        <div className="auth-decoration">
          <div className="auth-deco-circle c1" />
          <div className="auth-deco-circle c2" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Don't have an account? <Link to="/register">Create one</Link></p>

          {/* Demo Buttons */}
          <div className="demo-btns">
            <button className="demo-btn" onClick={() => fillDemo('user')}>Demo User</button>
            <button className="demo-btn admin" onClick={() => fillDemo('admin')}>Demo Admin</button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {errors.general && <div className="form-error-banner">{errors.general}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" size={16} />
                <input
                  className={`form-control icon-input${errors.email ? ' error' : ''}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" size={16} />
                <input
                  className={`form-control icon-input${errors.password ? ' error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Signing In...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
