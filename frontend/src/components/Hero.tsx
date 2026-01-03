import './Hero.css';

interface HeroProps {
    setCurrentView: (view: 'home' | 'upload' | 'dashboard' | 'visualize') => void;
}

const Hero = ({ setCurrentView }: HeroProps) => {
    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}></div>
                    ))}
                </div>
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <div className="hero-badge animate-fade-in">
                        <span className="badge">🚀 Preserving Human Legacy</span>
                    </div>

                    <h1 className="hero-title animate-slide-in-left">
                        Digital Memory
                        <span className="text-gradient"> Preservation</span>
                    </h1>

                    <p className="hero-subtitle animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                        Preserving Human Values, Thinking Patterns & Life Lessons Digitally
                    </p>

                    <p className="hero-description animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                        Transform your life stories into structured knowledge. Our AI-powered platform extracts values,
                        habits, and wisdom from your memories, creating a digital legacy for future generations.
                    </p>

                    <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <button className="btn btn-primary" onClick={() => setCurrentView('upload')}>
                            <span>Start Preserving</span>
                            <span>→</span>
                        </button>
                        <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')}>
                            <span>View Demo</span>
                            <span>🎯</span>
                        </button>
                    </div>

                    <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="stat-item">
                            <div className="stat-value">10K+</div>
                            <div className="stat-label">Memories Preserved</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">5K+</div>
                            <div className="stat-label">Life Lessons Extracted</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">98%</div>
                            <div className="stat-label">User Satisfaction</div>
                        </div>
                    </div>
                </div>

                <div className="hero-visual animate-slide-in-right">
                    <div className="visual-container">
                        <div className="visual-card card-1">
                            <div className="card-icon">💭</div>
                            <div className="card-title">Voice Memories</div>
                            <div className="card-description">Record your stories</div>
                        </div>
                        <div className="visual-card card-2">
                            <div className="card-icon">🧠</div>
                            <div className="card-title">AI Analysis</div>
                            <div className="card-description">Extract insights</div>
                        </div>
                        <div className="visual-card card-3">
                            <div className="card-icon">📚</div>
                            <div className="card-title">Knowledge Graph</div>
                            <div className="card-description">Connect wisdom</div>
                        </div>
                        <div className="visual-card card-4">
                            <div className="card-icon">🌟</div>
                            <div className="card-title">Legacy Book</div>
                            <div className="card-description">Share forever</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
