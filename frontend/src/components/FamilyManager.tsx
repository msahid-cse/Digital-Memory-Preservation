import React, { useState, useEffect } from 'react';
import { familyAPI } from '../services/api';
import './FamilyManager.css';

interface Family {
    id: number;
    name: string;
    description: string;
    role: string;
    memberCount: number;
    creatorName: string;
}

const FamilyManager: React.FC = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAddMember, setShowAddMember] = useState<number | null>(null);
    const [newFamily, setNewFamily] = useState({ name: '', description: '' });
    const [memberEmail, setMemberEmail] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleCreateFamily = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await familyAPI.create(newFamily);
            setNewFamily({ name: '', description: '' });
            setShowCreateForm(false);
            loadFamilies();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to create family');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (familyId: number) => {
        if (!memberEmail) return;

        setLoading(true);
        try {
            await familyAPI.addMember(familyId, memberEmail);
            setMemberEmail('');
            setShowAddMember(null);
            alert('Member added successfully!');
            loadFamilies();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="family-manager">
            <div className="family-header">
                <h1>Family Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : '+ Create Family'}
                </button>
            </div>

            {showCreateForm && (
                <div className="create-family-form glass-card">
                    <h2>Create New Family</h2>
                    <form onSubmit={handleCreateFamily}>
                        <div className="form-group">
                            <label>Family Name</label>
                            <input
                                type="text"
                                value={newFamily.name}
                                onChange={(e) => setNewFamily({ ...newFamily, name: e.target.value })}
                                placeholder="Enter family name..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea
                                value={newFamily.description}
                                onChange={(e) => setNewFamily({ ...newFamily, description: e.target.value })}
                                placeholder="Describe your family..."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Family'}
                        </button>
                    </form>
                </div>
            )}

            <div className="families-grid">
                {families.length === 0 ? (
                    <div className="empty-state">
                        <h3>No families yet</h3>
                        <p>Create your first family to start sharing memories!</p>
                    </div>
                ) : (
                    families.map((family) => (
                        <div key={family.id} className="family-card glass-card">
                            <div className="family-info">
                                <h3>{family.name}</h3>
                                {family.description && <p className="family-description">{family.description}</p>}
                                <div className="family-meta">
                                    <span className="member-count">👥 {family.memberCount} members</span>
                                    <span className="role-badge">{family.role}</span>
                                </div>
                                <p className="creator">Created by {family.creatorName}</p>
                            </div>

                            {family.role === 'admin' && (
                                <div className="family-actions">
                                    {showAddMember === family.id ? (
                                        <div className="add-member-form">
                                            <input
                                                type="email"
                                                value={memberEmail}
                                                onChange={(e) => setMemberEmail(e.target.value)}
                                                placeholder="Member's email..."
                                            />
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleAddMember(family.id)}
                                                disabled={loading}
                                            >
                                                Add
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => setShowAddMember(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setShowAddMember(family.id)}
                                        >
                                            + Add Member
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FamilyManager;
