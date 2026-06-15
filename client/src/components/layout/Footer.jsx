import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <Link to="/" className="footer-logo">◈ ShopSphere</Link>
            <p>Your one-stop destination for premium products. Quality, convenience, and unbeatable prices.</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Clothing">Clothing</Link></li>
              <li><Link to="/products?category=Books">Books</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/dashboard">My Account</Link></li>
              <li><Link to="/dashboard?tab=orders">Order History</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiMail />
                <span>support@shopsphere.com</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>123, MG Road, Palacode, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} ShopSphere. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
