import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Create a new family
router.post(
    '/',
    authenticateToken,
    [
        body('name').trim().notEmpty(),
        body('description').optional().trim()
    ],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        try {
            // Create family
            const familyResult = await pool.query(
                'INSERT INTO families (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
                [name, description, req.userId]
            );

            const family = familyResult.rows[0];

            // Add creator as admin member
            await pool.query(
                'INSERT INTO family_members (family_id, user_id, role) VALUES ($1, $2, $3)',
                [family.id, req.userId, 'admin']
            );

            res.status(201).json({
                message: 'Family created successfully',
                family: {
                    id: family.id,
                    name: family.name,
                    description: family.description,
                    createdBy: family.created_by,
                    createdAt: family.created_at
                }
            });
        } catch (error) {
            console.error('Create family error:', error);
            res.status(500).json({ error: 'Failed to create family' });
        }
    }
);

// Get all families for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT f.*, fm.role, u.full_name as creator_name,
        (SELECT COUNT(*) FROM family_members WHERE family_id = f.id) as member_count
       FROM families f
       JOIN family_members fm ON f.id = fm.family_id
       LEFT JOIN users u ON f.created_by = u.id
       WHERE fm.user_id = $1
       ORDER BY f.created_at DESC`,
            [req.userId]
        );

        res.json({
            families: result.rows.map((f: any) => ({
                id: f.id,
                name: f.name,
                description: f.description,
                role: f.role,
                creatorName: f.creator_name,
                memberCount: parseInt(f.member_count),
                createdAt: f.created_at
            }))
        });
    } catch (error) {
        console.error('Get families error:', error);
        res.status(500).json({ error: 'Failed to get families' });
    }
});

// Get family details with members
router.get('/:familyId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { familyId } = req.params;

    try {
        // Check if user is member
        const memberCheck = await pool.query(
            'SELECT role FROM family_members WHERE family_id = $1 AND user_id = $2',
            [familyId, req.userId]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You are not a member of this family' });
        }

        // Get family details
        const familyResult = await pool.query(
            'SELECT f.*, u.full_name as creator_name FROM families f LEFT JOIN users u ON f.created_by = u.id WHERE f.id = $1',
            [familyId]
        );

        if (familyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Family not found' });
        }

        // Get members
        const membersResult = await pool.query(
            `SELECT u.id, u.email, u.full_name, u.avatar_url, fm.role, fm.joined_at
       FROM family_members fm
       JOIN users u ON fm.user_id = u.id
       WHERE fm.family_id = $1
       ORDER BY fm.joined_at ASC`,
            [familyId]
        );

        const family = familyResult.rows[0];

        res.json({
            family: {
                id: family.id,
                name: family.name,
                description: family.description,
                creatorName: family.creator_name,
                createdAt: family.created_at,
                members: membersResult.rows.map((m: any) => ({
                    id: m.id,
                    email: m.email,
                    fullName: m.full_name,
                    avatarUrl: m.avatar_url,
                    role: m.role,
                    joinedAt: m.joined_at
                }))
            }
        });
    } catch (error) {
        console.error('Get family details error:', error);
        res.status(500).json({ error: 'Failed to get family details' });
    }
});

// Add member to family
router.post(
    '/:familyId/members',
    authenticateToken,
    [body('email').isEmail().normalizeEmail()],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { familyId } = req.params;
        const { email } = req.body;

        try {
            // Check if current user is admin
            const adminCheck = await pool.query(
                'SELECT role FROM family_members WHERE family_id = $1 AND user_id = $2',
                [familyId, req.userId]
            );

            if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
                return res.status(403).json({ error: 'Only admins can add members' });
            }

            // Find user by email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'User not found with this email' });
            }

            const newMemberId = userResult.rows[0].id;

            // Check if already a member
            const existingMember = await pool.query(
                'SELECT id FROM family_members WHERE family_id = $1 AND user_id = $2',
                [familyId, newMemberId]
            );

            if (existingMember.rows.length > 0) {
                return res.status(400).json({ error: 'User is already a member of this family' });
            }

            // Add member
            await pool.query(
                'INSERT INTO family_members (family_id, user_id, role) VALUES ($1, $2, $3)',
                [familyId, newMemberId, 'member']
            );

            res.status(201).json({
                message: 'Member added successfully'
            });
        } catch (error) {
            console.error('Add member error:', error);
            res.status(500).json({ error: 'Failed to add member' });
        }
    }
);

// Remove member from family
router.delete('/:familyId/members/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { familyId, userId } = req.params;

    try {
        // Check if current user is admin
        const adminCheck = await pool.query(
            'SELECT role FROM family_members WHERE family_id = $1 AND user_id = $2',
            [familyId, req.userId]
        );

        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can remove members' });
        }

        // Remove member
        const result = await pool.query(
            'DELETE FROM family_members WHERE family_id = $1 AND user_id = $2 RETURNING *',
            [familyId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

export default router;
