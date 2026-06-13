// ============================================================
// RegisterPage
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate    = useNavigate();
  const { register } = useAuth();

  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = 'Full name is required';
    if (!form.email)        e.email   = 'Email is required';
    if (!form.password)     e.password= 'Password is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
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
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (pw) => {
    let s = 0;
    if (pw.length >= 6)        s++;
    if (/[A-Z]/.test(pw))     s++;
    if (/[0-9]/.test(pw))     s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const pwStrength = strength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">◈ ShopSphere</Link>
          <h2>Join ShopSphere</h2>
          <p>Create your account and start shopping thousands of premium products.</p>
        </div>
        <div className="auth-decoration">
          <div className="auth-deco-circle c1" />
          <div className="auth-deco-circle c2" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Already have an account? <Link to="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit} noValidate>
            {errors.general && <div className="form-error-banner">{errors.general}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" size={16} />
                <input
                  className={`form-control icon-input${errors.name ? ' error' : ''}`}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

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
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-bars">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="pw-bar" style={{ background: i <= pwStrength ? strengthColors[pwStrength] : var(--border) }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColors[pwStrength], fontSize: '.75rem', fontWeight: 600 }}>
                    {strengthLabels[pwStrength]}
                  </span>
                </div>
              )}
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" size={16} />
                <input
                  className={`form-control icon-input${errors.confirm ? ' error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Creating Account...</> : 'Create Account'}
            </button>

            <p className="terms-note">
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
