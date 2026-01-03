import './Navbar.css';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    currentView: string;
    setCurrentView: (view: 'home' | 'upload' | 'dashboard' | 'visualize' | 'feed') => void;
    isAuthenticated: boolean;
    onLoginClick?: () => void;
}

const Navbar = ({ theme, toggleTheme, currentView, setCurrentView, isAuthenticated, onLoginClick }: NavbarProps) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <div className="navbar-brand" onClick={() => setCurrentView('home')}>
                        <div className="logo-icon">🧠</div>
                        <span className="logo-text">Digital Memory</span>
                    </div>

                    <div className="navbar-menu">
                        <button
                            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                            onClick={() => setCurrentView('home')}
                        >
                            Home
                        </button>
                        {isAuthenticated && (
                            <>
                                <button
                                    className={`nav-link ${currentView === 'feed' ? 'active' : ''}`}
                                    onClick={() => setCurrentView('feed')}
                                >
                                    Feed
                                </button>
                                <button
                                    className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
                                    onClick={() => setCurrentView('upload')}
                                >
                                    Add Memory
                                </button>
                                <button
                                    className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => setCurrentView('dashboard')}
                                >
                                    Dashboard
                                </button>
                                <button
                                    className={`nav-link ${currentView === 'visualize' ? 'active' : ''}`}
                                    onClick={() => setCurrentView('visualize')}
                                >
                                    Visualize
                                </button>
                            </>
                        )}
                    </div>

                    <div className="navbar-actions">
                        {isAuthenticated && user && <span className="user-name">👤 {user.fullName}</span>}
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        {isAuthenticated ? (
                            <button className="logout-btn" onClick={logout}>
                                Logout
                            </button>
                        ) : (
                            <button className="login-btn" onClick={onLoginClick}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
