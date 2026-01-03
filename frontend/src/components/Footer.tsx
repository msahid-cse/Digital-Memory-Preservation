import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="logo-icon">🧠</span>
                                <span className="logo-text">Digital Memory</span>
                            </div>
                            <p className="footer-tagline">
                                Preserving human values, thinking patterns, and life lessons for future generations.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link">🐦</a>
                                <a href="#" className="social-link">📘</a>
                                <a href="#" className="social-link">📷</a>
                                <a href="#" className="social-link">💼</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Platform</h3>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#about">About Us</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Resources</h3>
                        <ul className="footer-links">
                            <li><a href="#docs">Documentation</a></li>
                            <li><a href="#api">API Reference</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#research">Research</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Legal</h3>
                        <ul className="footer-links">
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#ethics">Ethical Guidelines</a></li>
                            <li><a href="#security">Security</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Newsletter</h3>
                        <p className="newsletter-text">Stay updated with our latest features and insights.</p>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button type="submit" className="newsletter-button">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        © 2026 Digital Memory Preservation. All rights reserved.
                    </p>
                    <p className="footer-note">
                        Built with ❤️ for preserving human legacy
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
