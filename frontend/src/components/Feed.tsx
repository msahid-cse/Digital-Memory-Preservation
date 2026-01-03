import React, { useState, useEffect } from 'react';
import { memoryAPI, familyAPI } from '../services/api';
import './Feed.css';

interface Memory {
    id: number;
    title: string;
    description: string;
    memoryDate: string;
    category: string;
    visibility: string;
    emotionalTags: string[];
    coreValues: string[];
    authorName: string;
    familyName?: string;
    createdAt: string;
}

interface Family {
    id: number;
    name: string;
    role: string;
    memberCount: number;
}

const Feed: React.FC = () => {
    const [feedType, setFeedType] = useState<'personal' | 'family' | 'universal'>('personal');
    const [memories, setMemories] = useState<Memory[]>([]);
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFamilies();
    }, []);

    useEffect(() => {
        loadMemories();
    }, [feedType, selectedFamily]);

    const loadFamilies = async () => {
        try {
            const response = await familyAPI.getAll();
            setFamilies(response.data.families);
        } catch (error) {
            console.error('Failed to load families:', error);
        }
    };

    const loadMemories = async () => {
        setLoading(true);
        try {
            const params: any = { feed: feedType };
            if (feedType === 'family' && selectedFamily) {
                params.familyId = selectedFamily;
            }

            const response = await memoryAPI.getAll(params);
            setMemories(response.data.memories);
        } catch (error) {
            console.error('Failed to load memories:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="feed-container">
            <div className="feed-header">
                <h1>Memory Feed</h1>

                <div className="feed-tabs">
                    <button
                        className={feedType === 'personal' ? 'active' : ''}
                        onClick={() => setFeedType('personal')}
                    >
                        <span className="icon">👤</span>
                        Personal
                    </button>
                    <button
                        className={feedType === 'family' ? 'active' : ''}
                        onClick={() => setFeedType('family')}
                    >
                        <span className="icon">👨‍👩‍👧‍👦</span>
                        Family
                    </button>
                    <button
                        className={feedType === 'universal' ? 'active' : ''}
                        onClick={() => setFeedType('universal')}
                    >
                        <span className="icon">🌍</span>
                        Universal
                    </button>
                </div>

                {feedType === 'family' && families.length > 0 && (
                    <div className="family-selector">
                        <select
                            value={selectedFamily || ''}
                            onChange={(e) => setSelectedFamily(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">All Families</option>
                            {families.map((family) => (
                                <option key={family.id} value={family.id}>
                                    {family.name} ({family.memberCount} members)
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="memories-grid">
                {loading ? (
                    <div className="loading">Loading memories...</div>
                ) : memories.length === 0 ? (
                    <div className="empty-state">
                        <h3>No memories yet</h3>
                        <p>Start adding memories to see them here!</p>
                    </div>
                ) : (
                    memories.map((memory) => (
                        <div key={memory.id} className="memory-card">
                            <div className="memory-header">
                                <div className="memory-meta">
                                    <span className="author">{memory.authorName}</span>
                                    {memory.familyName && (
                                        <span className="family-badge">{memory.familyName}</span>
                                    )}
                                </div>
                                <span className="memory-date">{formatDate(memory.memoryDate)}</span>
                            </div>

                            <h3 className="memory-title">{memory.title}</h3>
                            <p className="memory-description">{memory.description}</p>

                            {memory.category && (
                                <span className="category-badge">{memory.category}</span>
                            )}

                            {memory.emotionalTags && memory.emotionalTags.length > 0 && (
                                <div className="tags">
                                    {memory.emotionalTags.map((tag, index) => (
                                        <span key={index} className="tag emotional">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {memory.coreValues && memory.coreValues.length > 0 && (
                                <div className="tags">
                                    {memory.coreValues.map((value, index) => (
                                        <span key={index} className="tag value">
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;
