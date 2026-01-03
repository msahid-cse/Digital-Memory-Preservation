import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth.tsx';
import Hero from './components/Hero.tsx';
import Features from './components/Features.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import MemoryUpload from './components/MemoryUpload.tsx';
import Dashboard from './components/Dashboard.tsx';
import Visualization from './components/Visualization.tsx';
import Feed from './components/Feed.tsx';
import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'dashboard' | 'visualize' | 'feed'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Handle navigation - redirect to auth if trying to access protected routes
  const handleNavigation = (view: 'home' | 'upload' | 'dashboard' | 'visualize' | 'feed') => {
    const protectedViews = ['upload', 'dashboard', 'visualize', 'feed'];

    if (protectedViews.includes(view) && !isAuthenticated) {
      // Show auth modal instead of changing view
      setShowAuthModal(true);
      return;
    }

    setCurrentView(view);
  };

  // Handle login button click
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  // Close auth modal when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthModal(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentView={currentView}
        setCurrentView={handleNavigation}
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
      />

      {showAuthModal && <Auth />}

      {currentView === 'home' && (
        <>
          <Hero setCurrentView={handleNavigation} />
          <Features />
          <HowItWorks />
        </>
      )}

      {isAuthenticated && (
        <>
          {currentView === 'upload' && <MemoryUpload />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'visualize' && <Visualization />}
          {currentView === 'feed' && <Feed />}
        </>
      )}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
