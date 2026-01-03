import { useState } from 'react';
import './Visualization.css';

const Visualization = () => {
    const [activeView, setActiveView] = useState<'timeline' | 'graph' | 'emotions'>('timeline');

    // Sample data for visualizations
    const timelineData = [
        { year: 1990, event: "Birth", category: "milestone", emotion: "joy" },
        { year: 1995, event: "First Day of School", category: "education", emotion: "anxious" },
        { year: 2005, event: "Learned from Failure", category: "career", emotion: "reflective" },
        { year: 2010, event: "First Job", category: "career", emotion: "excited" },
        { year: 2015, event: "Marriage", category: "family", emotion: "joy" },
        { year: 2020, event: "Career Pivot", category: "career", emotion: "determined" },
        { year: 2025, event: "Present Day", category: "milestone", emotion: "peaceful" }
    ];

    const emotionalJourney = [
        { period: "Childhood", joy: 85, sadness: 20, anxiety: 30, peace: 70 },
        { period: "Teenage", joy: 60, sadness: 40, anxiety: 60, peace: 40 },
        { period: "Young Adult", joy: 55, sadness: 50, anxiety: 70, peace: 35 },
        { period: "Adult", joy: 75, sadness: 30, anxiety: 40, peace: 80 },
        { period: "Present", joy: 85, sadness: 15, anxiety: 25, peace: 90 }
    ];

    return (
        <section className="visualization">
            <div className="container">
                <div className="viz-header">
                    <h1 className="viz-title animate-fade-in">
                        Life <span className="text-gradient">Visualizations</span>
                    </h1>
                    <p className="viz-subtitle animate-fade-in">
                        Explore your journey through interactive charts and timelines
                    </p>
                </div>

                {/* View Selector */}
                <div className="view-selector glass-card">
                    <button
                        className={`view-button ${activeView === 'timeline' ? 'active' : ''}`}
                        onClick={() => setActiveView('timeline')}
                    >
                        <span className="view-icon">📅</span>
                        <span>Life Timeline</span>
                    </button>
                    <button
                        className={`view-button ${activeView === 'graph' ? 'active' : ''}`}
                        onClick={() => setActiveView('graph')}
                    >
                        <span className="view-icon">🕸️</span>
                        <span>Knowledge Graph</span>
                    </button>
                    <button
                        className={`view-button ${activeView === 'emotions' ? 'active' : ''}`}
                        onClick={() => setActiveView('emotions')}
                    >
                        <span className="view-icon">📊</span>
                        <span>Emotional Journey</span>
                    </button>
                </div>

                {/* Timeline View */}
                {activeView === 'timeline' && (
                    <div className="timeline-view glass-card animate-fade-in">
                        <h2 className="view-title">Your Life Timeline</h2>
                        <p className="view-description">Key moments and milestones throughout your journey</p>

                        <div className="timeline">
                            {timelineData.map((item, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker">
                                        <div className="marker-dot"></div>
                                        <div className="marker-line"></div>
                                    </div>
                                    <div className="timeline-content glass-card">
                                        <div className="timeline-year">{item.year}</div>
                                        <h3 className="timeline-event">{item.event}</h3>
                                        <div className="timeline-meta">
                                            <span className="timeline-category badge">{item.category}</span>
                                            <span className="timeline-emotion">{item.emotion}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Knowledge Graph View */}
                {activeView === 'graph' && (
                    <div className="graph-view glass-card animate-fade-in">
                        <h2 className="view-title">Knowledge Graph</h2>
                        <p className="view-description">Connections between your values, events, and lessons</p>

                        <div className="graph-container">
                            <svg className="knowledge-graph" viewBox="0 0 800 600">
                                {/* Central Node */}
                                <g className="node central-node">
                                    <circle cx="400" cy="300" r="60" fill="url(#gradient1)" />
                                    <text x="400" y="305" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                                        You
                                    </text>
                                </g>

                                {/* Value Nodes */}
                                <g className="node value-node">
                                    <line x1="400" y1="300" x2="200" y2="150" stroke="url(#gradient2)" strokeWidth="2" />
                                    <circle cx="200" cy="150" r="45" fill="url(#gradient2)" />
                                    <text x="200" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                        Honesty
                                    </text>
                                </g>

                                <g className="node value-node">
                                    <line x1="400" y1="300" x2="600" y2="150" stroke="url(#gradient3)" strokeWidth="2" />
                                    <circle cx="600" cy="150" r="45" fill="url(#gradient3)" />
                                    <text x="600" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                        Resilience
                                    </text>
                                </g>

                                <g className="node value-node">
                                    <line x1="400" y1="300" x2="200" y2="450" stroke="url(#gradient4)" strokeWidth="2" />
                                    <circle cx="200" cy="450" r="45" fill="url(#gradient4)" />
                                    <text x="200" y="455" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                        Empathy
                                    </text>
                                </g>

                                <g className="node value-node">
                                    <line x1="400" y1="300" x2="600" y2="450" stroke="url(#gradient5)" strokeWidth="2" />
                                    <circle cx="600" cy="450" r="45" fill="url(#gradient5)" />
                                    <text x="600" y="455" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                        Courage
                                    </text>
                                </g>

                                {/* Lesson Nodes */}
                                <g className="node lesson-node">
                                    <line x1="200" y1="150" x2="100" y2="50" stroke="#667eea" strokeWidth="1" strokeDasharray="5,5" />
                                    <circle cx="100" cy="50" r="30" fill="#667eea" opacity="0.8" />
                                    <text x="100" y="55" textAnchor="middle" fill="white" fontSize="10">
                                        Lesson
                                    </text>
                                </g>

                                {/* Gradients */}
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f093fb" />
                                        <stop offset="100%" stopColor="#f5576c" />
                                    </linearGradient>
                                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#4facfe" />
                                        <stop offset="100%" stopColor="#00f2fe" />
                                    </linearGradient>
                                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#43e97b" />
                                        <stop offset="100%" stopColor="#38f9d7" />
                                    </linearGradient>
                                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fa709a" />
                                        <stop offset="100%" stopColor="#fee140" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="graph-legend">
                                <div className="legend-item">
                                    <div className="legend-color" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                                    <span>Central Identity</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}></div>
                                    <span>Core Values</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color" style={{ background: '#667eea', opacity: 0.8 }}></div>
                                    <span>Life Lessons</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Emotional Journey View */}
                {activeView === 'emotions' && (
                    <div className="emotions-view glass-card animate-fade-in">
                        <h2 className="view-title">Emotional Journey</h2>
                        <p className="view-description">How your emotions have evolved over time</p>

                        <div className="emotions-chart">
                            {emotionalJourney.map((period, index) => (
                                <div key={index} className="emotion-period">
                                    <h3 className="period-name">{period.period}</h3>
                                    <div className="emotion-bars">
                                        <div className="emotion-bar-item">
                                            <div className="emotion-label">
                                                <span className="emotion-icon">😊</span>
                                                <span>Joy</span>
                                            </div>
                                            <div className="emotion-bar-bg">
                                                <div
                                                    className="emotion-bar-fill joy"
                                                    style={{ width: `${period.joy}%` }}
                                                >
                                                    <span className="bar-value">{period.joy}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="emotion-bar-item">
                                            <div className="emotion-label">
                                                <span className="emotion-icon">😢</span>
                                                <span>Sadness</span>
                                            </div>
                                            <div className="emotion-bar-bg">
                                                <div
                                                    className="emotion-bar-fill sadness"
                                                    style={{ width: `${period.sadness}%` }}
                                                >
                                                    <span className="bar-value">{period.sadness}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="emotion-bar-item">
                                            <div className="emotion-label">
                                                <span className="emotion-icon">😰</span>
                                                <span>Anxiety</span>
                                            </div>
                                            <div className="emotion-bar-bg">
                                                <div
                                                    className="emotion-bar-fill anxiety"
                                                    style={{ width: `${period.anxiety}%` }}
                                                >
                                                    <span className="bar-value">{period.anxiety}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="emotion-bar-item">
                                            <div className="emotion-label">
                                                <span className="emotion-icon">😌</span>
                                                <span>Peace</span>
                                            </div>
                                            <div className="emotion-bar-bg">
                                                <div
                                                    className="emotion-bar-fill peace"
                                                    style={{ width: `${period.peace}%` }}
                                                >
                                                    <span className="bar-value">{period.peace}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Visualization;
