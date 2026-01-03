import './Features.css';

const Features = () => {
    const features = [
        {
            icon: '🎙️',
            title: 'Multi-Format Input',
            description: 'Upload memories via text, voice recordings, or video. Our AI processes all formats seamlessly.',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: '🧠',
            title: 'AI Value Extraction',
            description: 'Advanced NLP extracts core values like honesty, resilience, empathy from your stories.',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            icon: '📊',
            title: 'Pattern Recognition',
            description: 'Identify habits, decision-making patterns, and emotional arcs across your lifetime.',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: '💡',
            title: 'Life Lesson Generation',
            description: 'Automatically generate meaningful lessons and wisdom from your experiences.',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            icon: '🕸️',
            title: 'Knowledge Graph',
            description: 'Visualize connections between events, values, and lessons in an interactive graph.',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            icon: '📚',
            title: 'Digital Legacy Book',
            description: 'Auto-generate a beautiful digital book of your life wisdom for future generations.',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        },
        {
            icon: '🔒',
            title: 'Privacy & Security',
            description: 'End-to-end encryption, role-based access, and ethical consent management.',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        },
        {
            icon: '📈',
            title: 'Emotional Timeline',
            description: 'Track your emotional journey over time with beautiful visualizations.',
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        },
        {
            icon: '🔍',
            title: 'Semantic Search',
            description: 'Search memories by values, emotions, or lessons using advanced AI embeddings.',
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        }
    ];

    return (
        <section className="features" id="features">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title animate-fade-in">
                        Powerful Features for
                        <span className="text-gradient"> Memory Preservation</span>
                    </h2>
                    <p className="section-subtitle animate-fade-in">
                        Advanced AI technology meets human storytelling to create lasting digital legacies
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card glass-card animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>
                                <div className="feature-icon">{feature.icon}</div>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <div className="feature-link">
                                Learn more →
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
