import { useState } from 'react';
import FamilyManager from './FamilyManager';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'families'>('overview');
    const [selectedMemory, setSelectedMemory] = useState<number | null>(null);

    const memories = [
        {
            id: 1,
            title: "Learning from Failure",
            category: "Career",
            date: "2020-03-15",
            emotions: ["😰 Anxious", "🤔 Reflective"],
            extractedValues: ["Resilience", "Growth Mindset", "Perseverance"],
            lessons: ["Failure is a stepping stone to success", "Patience leads to mastery"],
            content: "When I failed my first startup, I learned that failure isn't the opposite of success..."
        },
        {
            id: 2,
            title: "Grandmother's Wisdom",
            category: "Family",
            date: "1995-07-22",
            emotions: ["😊 Happy", "😌 Peaceful"],
            extractedValues: ["Kindness", "Empathy", "Patience"],
            lessons: ["Small acts of kindness create lasting impact", "Listen more than you speak"],
            content: "My grandmother always said that the best gift you can give someone is your time..."
        }
    ];

    const stats = [
        { label: "Total Memories", value: "127", icon: "📚", color: "#667eea" },
        { label: "Values Identified", value: "43", icon: "💎", color: "#f093fb" },
        { label: "Life Lessons", value: "89", icon: "💡", color: "#4facfe" },
        { label: "Days Tracked", value: "1,245", icon: "📅", color: "#43e97b" }
    ];

    const topValues = [
        { value: "Honesty", count: 45, percentage: 85 },
        { value: "Resilience", count: 38, percentage: 72 },
        { value: "Empathy", count: 35, percentage: 66 },
        { value: "Courage", count: 28, percentage: 53 },
        { value: "Patience", count: 25, percentage: 47 }
    ];

    return (
        <section className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title animate-fade-in">
                        Your Memory <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="dashboard-subtitle animate-fade-in">
                        Explore your preserved memories and manage your families
                    </p>
                </div>

                {/* Dashboard Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'families' ? 'active' : ''}`}
                        onClick={() => setActiveTab('families')}
                    >
                        👨‍👩‍👧‍👦 Families
                    </button>
                </div>

                {activeTab === 'families' ? (
                    <FamilyManager />
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="stat-card glass-card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="stat-icon" style={{ background: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-value">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="dashboard-grid">
                            {/* Memories List */}
                            <div className="memories-section">
                                <h2 className="section-title">Recent Memories</h2>
                                <div className="memories-list">
                                    {memories.map((memory) => (
                                        <div
                                            key={memory.id}
                                            className={`memory-card glass-card ${selectedMemory === memory.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedMemory(memory.id)}
                                        >
                                            <div className="memory-header">
                                                <h3 className="memory-title">{memory.title}</h3>
                                                <span className="memory-category badge">{memory.category}</span>
                                            </div>
                                            <div className="memory-date">📅 {memory.date}</div>
                                            <div className="memory-emotions">
                                                {memory.emotions.map((emotion, i) => (
                                                    <span key={i} className="emotion-tag">{emotion}</span>
                                                ))}
                                            </div>
                                            <div className="memory-values">
                                                <strong>Values:</strong>
                                                <div className="values-list">
                                                    {memory.extractedValues.map((value, i) => (
                                                        <span key={i} className="value-badge">{value}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Memory Details */}
                            <div className="details-section">
                                {selectedMemory ? (
                                    <div className="memory-details glass-card">
                                        {memories.filter(m => m.id === selectedMemory).map((memory) => (
                                            <div key={memory.id}>
                                                <h2 className="details-title">{memory.title}</h2>
                                                <div className="details-meta">
                                                    <span className="meta-item">
                                                        <span className="meta-icon">📅</span>
                                                        {memory.date}
                                                    </span>
                                                    <span className="meta-item">
                                                        <span className="meta-icon">🏷️</span>
                                                        {memory.category}
                                                    </span>
                                                </div>

                                                <div className="details-section-block">
                                                    <h3 className="block-title">📖 Story</h3>
                                                    <p className="memory-content">{memory.content}</p>
                                                </div>

                                                <div className="details-section-block">
                                                    <h3 className="block-title">💎 Extracted Values</h3>
                                                    <div className="values-grid">
                                                        {memory.extractedValues.map((value, i) => (
                                                            <div key={i} className="value-item">
                                                                <span className="value-icon">✓</span>
                                                                <span>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="details-section-block">
                                                    <h3 className="block-title">💡 Life Lessons</h3>
                                                    <ul className="lessons-list">
                                                        {memory.lessons.map((lesson, i) => (
                                                            <li key={i} className="lesson-item">{lesson}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="details-section-block">
                                                    <h3 className="block-title">😊 Emotions</h3>
                                                    <div className="emotions-list">
                                                        {memory.emotions.map((emotion, i) => (
                                                            <span key={i} className="emotion-badge">{emotion}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-selection glass-card">
                                        <div className="no-selection-icon">📚</div>
                                        <h3>Select a memory to view details</h3>
                                        <p>Click on any memory card to see the full story and AI analysis</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Values */}
                        <div className="top-values-section glass-card">
                            <h2 className="section-title">Your Core Values</h2>
                            <p className="section-description">Based on AI analysis of all your memories</p>
                            <div className="values-chart">
                                {topValues.map((item, index) => (
                                    <div key={index} className="value-row">
                                        <div className="value-info">
                                            <span className="value-name">{item.value}</span>
                                            <span className="value-count">{item.count} mentions</span>
                                        </div>
                                        <div className="value-bar-container">
                                            <div
                                                className="value-bar"
                                                style={{ width: `${item.percentage}%` }}
                                            >
                                                <span className="value-percentage">{item.percentage}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
