import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Upload Your Memories',
            description: 'Share your life stories through text, voice, or video. Our guided prompts help you capture meaningful moments.',
            icon: '📝',
            details: ['Text stories', 'Voice recordings', 'Video narratives', 'Guided prompts']
        },
        {
            number: '02',
            title: 'AI Processing',
            description: 'Advanced AI analyzes your memories, extracting values, patterns, and emotional context.',
            icon: '⚙️',
            details: ['NLP analysis', 'Value extraction', 'Pattern detection', 'Emotion recognition']
        },
        {
            number: '03',
            title: 'Knowledge Structuring',
            description: 'Your memories are organized into a knowledge graph, connecting events, values, and lessons.',
            icon: '🕸️',
            details: ['Knowledge graph', 'Timeline creation', 'Relationship mapping', 'Semantic linking']
        },
        {
            number: '04',
            title: 'Visualize & Share',
            description: 'Explore your life journey through interactive visualizations and share your legacy.',
            icon: '🎨',
            details: ['Interactive charts', 'Emotional timeline', 'Legacy book', 'Secure sharing']
        }
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title animate-fade-in">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="section-subtitle animate-fade-in">
                        Four simple steps to preserve your legacy forever
                    </p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="step-item animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="step-content glass-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                                <ul className="step-details">
                                    {step.details.map((detail, i) => (
                                        <li key={i} className="step-detail-item">
                                            <span className="detail-check">✓</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <div className="connector-line"></div>
                                    <div className="connector-arrow">→</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
