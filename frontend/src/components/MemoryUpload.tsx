import { useState, useEffect } from 'react';
import { memoryAPI, familyAPI } from '../services/api';
import { geminiService } from '../services/gemini';
import './MemoryUpload.css';

interface Family {
    id: number;
    name: string;
}

const MemoryUpload = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [memoryData, setMemoryData] = useState({
        title: '',
        category: 'Education',
        description: '',
        memoryDate: '',
        emotionalTags: [] as string[],
        coreValues: [] as string[],
        visibility: 'personal' as 'personal' | 'family' | 'universal',
        familyId: null as number | null
    });

    useEffect(() => {
        loadFamilies();
    }, []);

    const loadFamilies = async () => {
        try {
            const response = await familyAPI.getAll();
            setFamilies(response.data.families);
        } catch (error) {
            console.error('Failed to load families:', error);
        }
    };

    const categories = ['Education', 'Career', 'Family', 'Travel', 'Achievement', 'Challenge'];
    const emotions = ['Joy', 'Sadness', 'Excitement', 'Nervousness', 'Pride', 'Gratitude', 'Love', 'Fear'];
    const values = ['Growth', 'Courage', 'Compassion', 'Integrity', 'Resilience', 'Creativity', 'Family', 'Learning'];

    // AI Analysis function
    const handleAIAnalysis = async () => {
        if (!memoryData.description || memoryData.description.length < 50) {
            alert('Please write at least 50 characters in your memory to analyze it with AI.');
            return;
        }

        setAnalyzing(true);
        try {
            const insights = await geminiService.analyzeMemory(memoryData.description);
            setAiInsights(insights);

            // Auto-populate tags based on AI insights
            const suggestedEmotions = insights.emotions.filter((e: string) =>
                emotions.some(emotion => emotion.toLowerCase() === e.toLowerCase())
            );
            const suggestedValues = insights.values.filter((v: string) =>
                values.some(value => value.toLowerCase() === v.toLowerCase())
            );

            setMemoryData(prev => ({
                ...prev,
                emotionalTags: [...new Set([...prev.emotionalTags, ...suggestedEmotions])],
                coreValues: [...new Set([...prev.coreValues, ...suggestedValues])]
            }));

            alert('✨ AI Analysis complete! Check the suggested tags and insights below.');
        } catch (error) {
            console.error('AI Analysis failed:', error);
            alert('Failed to analyze memory with AI. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await memoryAPI.create({
                title: memoryData.title,
                description: memoryData.description,
                memoryDate: memoryData.memoryDate,
                category: memoryData.category,
                visibility: memoryData.visibility,
                familyId: memoryData.visibility === 'family' ? memoryData.familyId : null,
                emotionalTags: memoryData.emotionalTags,
                coreValues: memoryData.coreValues,
                aiAnalysis: aiInsights
            });

            setSuccess(true);
            // Reset form
            setMemoryData({
                title: '',
                category: 'Education',
                description: '',
                memoryDate: '',
                emotionalTags: [],
                coreValues: [],
                visibility: 'personal',
                familyId: null
            });
            setAiInsights(null);

            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            console.error('Failed to save memory:', error);
            alert(error.response?.data?.error || 'Failed to save memory');
        } finally {
            setLoading(false);
        }
    };

    const toggleTag = (tag: string, type: 'emotion' | 'value') => {
        if (type === 'emotion') {
            setMemoryData(prev => ({
                ...prev,
                emotionalTags: prev.emotionalTags.includes(tag)
                    ? prev.emotionalTags.filter(t => t !== tag)
                    : [...prev.emotionalTags, tag]
            }));
        } else {
            setMemoryData(prev => ({
                ...prev,
                coreValues: prev.coreValues.includes(tag)
                    ? prev.coreValues.filter(t => t !== tag)
                    : [...prev.coreValues, tag]
            }));
        }
    };

    return (
        <section className="memory-upload">
            <div className="container">
                <div className="upload-header">
                    <h1 className="upload-title animate-fade-in">
                        Add Your <span className="text-gradient">Memory</span>
                    </h1>
                    <p className="upload-subtitle animate-fade-in">
                        Preserve your story with AI-powered insights
                    </p>
                </div>

                {success && (
                    <div className="success-message">
                        ✅ Memory saved successfully!
                    </div>
                )}

                <div className="upload-container glass-card animate-fade-in">
                    <form onSubmit={handleSubmit} className="upload-form">
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Memory Title</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Give your memory a meaningful title..."
                                value={memoryData.title}
                                onChange={(e) => setMemoryData({ ...memoryData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label className="form-label">When did this happen?</label>
                            <input
                                type="date"
                                className="input"
                                value={memoryData.memoryDate}
                                onChange={(e) => setMemoryData({ ...memoryData, memoryDate: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="input"
                                value={memoryData.category}
                                onChange={(e) => setMemoryData({ ...memoryData, category: e.target.value })}
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <div className="label-with-action">
                                <label className="form-label">Your Story</label>
                                <button
                                    type="button"
                                    className={`btn-ai ${analyzing ? 'analyzing' : ''}`}
                                    onClick={handleAIAnalysis}
                                    disabled={analyzing || !memoryData.description}
                                >
                                    {analyzing ? 'Analyzing...' : '✨ Analyze with AI'}
                                </button>
                            </div>
                            <textarea
                                className="textarea"
                                placeholder="Write your memory here... Be as detailed as you'd like."
                                value={memoryData.description}
                                onChange={(e) => setMemoryData({ ...memoryData, description: e.target.value })}
                                rows={10}
                                required
                            />
                        </div>

                        {/* AI Insights Display */}
                        {aiInsights && (
                            <div className="ai-insights-card animate-fade-in">
                                <h3 className="insights-title">✨ AI Insights</h3>
                                <div className="insight-item">
                                    <span className="insight-label">Summary:</span>
                                    <p>{aiInsights.summary}</p>
                                </div>
                                <div className="insight-item">
                                    <span className="insight-label">Life Lesson:</span>
                                    <p className="highlight">{aiInsights.lifeLesson}</p>
                                </div>
                                <div className="insight-tags">
                                    <div className="insight-group">
                                        <span className="insight-label">Themes:</span>
                                        <div className="tag-list">
                                            {aiInsights.themes?.map((theme: string, i: number) => (
                                                <span key={i} className="ai-tag">{theme}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Emotional Tags */}
                        <div className="form-group">
                            <label className="form-label">Emotions (Select all that apply)</label>
                            <div className="emotions-grid">
                                {emotions.map((emotion) => (
                                    <button
                                        key={emotion}
                                        type="button"
                                        className={`emotion-button ${memoryData.emotionalTags.includes(emotion) ? 'active' : ''}`}
                                        onClick={() => toggleTag(emotion, 'emotion')}
                                    >
                                        {emotion}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Core Values */}
                        <div className="form-group">
                            <label className="form-label">Core Values</label>
                            <div className="emotions-grid">
                                {values.map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`emotion-button ${memoryData.coreValues.includes(value) ? 'active' : ''}`}
                                        onClick={() => toggleTag(value, 'value')}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="form-group">
                            <label className="form-label">Who can see this?</label>
                            <div className="privacy-options">
                                <label className="privacy-option">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="personal"
                                        checked={memoryData.visibility === 'personal'}
                                        onChange={(e) => setMemoryData({ ...memoryData, visibility: e.target.value as any })}
                                    />
                                    <span className="privacy-label">
                                        <span className="privacy-icon">🔒</span>
                                        <span>Personal (Only you)</span>
                                    </span>
                                </label>
                                <label className="privacy-option">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="family"
                                        checked={memoryData.visibility === 'family'}
                                        onChange={(e) => setMemoryData({ ...memoryData, visibility: e.target.value as any })}
                                    />
                                    <span className="privacy-label">
                                        <span className="privacy-icon">👨‍👩‍👧‍👦</span>
                                        <span>Family</span>
                                    </span>
                                </label>
                                <label className="privacy-option">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="universal"
                                        checked={memoryData.visibility === 'universal'}
                                        onChange={(e) => setMemoryData({ ...memoryData, visibility: e.target.value as any })}
                                    />
                                    <span className="privacy-label">
                                        <span className="privacy-icon">🌍</span>
                                        <span>Universal (Public)</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Family Selection */}
                        {memoryData.visibility === 'family' && families.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Select Family</label>
                                <select
                                    className="input"
                                    value={memoryData.familyId || ''}
                                    onChange={(e) => setMemoryData({ ...memoryData, familyId: e.target.value ? Number(e.target.value) : null })}
                                    required={memoryData.visibility === 'family'}
                                >
                                    <option value="">Choose a family...</option>
                                    {families.map((family) => (
                                        <option key={family.id} value={family.id}>{family.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                                <span>{loading ? 'Saving...' : 'Save Memory'}</span>
                                <span>✨</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default MemoryUpload;
