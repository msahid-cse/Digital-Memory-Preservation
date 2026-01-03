import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// AI Analysis service (using Google Gemini API)
const analyzeMemoryWithAI = async (memory: any) => {
    try {
        // This is a placeholder for actual AI integration
        // You would integrate with Google Gemini API here
        const analysis = {
            sentiment: 'positive',
            themes: ['growth', 'learning', 'achievement'],
            keyPeople: [],
            significance: 8,
            lifeStage: 'young_adult',
            suggestedTags: memory.emotional_tags || [],
            insights: `This memory represents an important milestone in your educational journey.`
        };

        return analysis;
    } catch (error) {
        console.error('AI analysis error:', error);
        return null;
    }
};

// Create a new memory
router.post(
    '/',
    authenticateToken,
    [
        body('title').trim().notEmpty(),
        body('description').trim().notEmpty(),
        body('memoryDate').isISO8601(),
        body('category').optional().trim(),
        body('visibility').optional().isIn(['personal', 'family', 'universal']),
        body('familyId').optional().isInt()
    ],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            description,
            memoryDate,
            category,
            visibility = 'personal',
            familyId,
            emotionalTags = [],
            coreValues = [],
            aiAnalysis
        } = req.body;

        try {
            // If family visibility, verify user is member
            if (visibility === 'family' && familyId) {
                const memberCheck = await pool.query(
                    'SELECT id FROM family_members WHERE family_id = $1 AND user_id = $2',
                    [familyId, req.userId]
                );

                if (memberCheck.rows.length === 0) {
                    return res.status(403).json({ error: 'You must be a family member to share memories with this family' });
                }
            }

            // Use provided AI analysis or perform server-side analysis
            const finalAiAnalysis = aiAnalysis || await analyzeMemoryWithAI({
                title,
                description,
                memoryDate,
                category,
                emotional_tags: emotionalTags,
                core_values: coreValues
            });

            // Create memory
            const result = await pool.query(
                `INSERT INTO memories 
         (user_id, family_id, title, description, memory_date, category, visibility, emotional_tags, core_values, ai_analysis)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
                [
                    req.userId,
                    familyId || null,
                    title,
                    description,
                    memoryDate,
                    category,
                    visibility,
                    emotionalTags,
                    coreValues,
                    JSON.stringify(finalAiAnalysis)
                ]
            );

            const memory = result.rows[0];

            res.status(201).json({
                message: 'Memory created successfully',
                memory: {
                    id: memory.id,
                    title: memory.title,
                    description: memory.description,
                    memoryDate: memory.memory_date,
                    category: memory.category,
                    visibility: memory.visibility,
                    emotionalTags: memory.emotional_tags,
                    coreValues: memory.core_values,
                    aiAnalysis: memory.ai_analysis,
                    createdAt: memory.created_at
                }
            });
        } catch (error) {
            console.error('Create memory error:', error);
            res.status(500).json({ error: 'Failed to create memory' });
        }
    }
);

// Get memories (with feed filtering)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { feed = 'personal', familyId, limit = 50, offset = 0 } = req.query;

    try {
        let query = '';
        let params: any[] = [];

        if (feed === 'personal') {
            // Personal feed - only user's own memories
            query = `
        SELECT m.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM memories m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = $1
        ORDER BY m.memory_date DESC, m.created_at DESC
        LIMIT $2 OFFSET $3
      `;
            params = [req.userId, limit, offset];
        } else if (feed === 'family') {
            // Family feed - memories from user's families
            query = `
        SELECT DISTINCT m.*, u.full_name as author_name, u.avatar_url as author_avatar, f.name as family_name
        FROM memories m
        JOIN users u ON m.user_id = u.id
        LEFT JOIN families f ON m.family_id = f.id
        WHERE m.family_id IN (
          SELECT family_id FROM family_members WHERE user_id = $1
        ) AND m.visibility IN ('family', 'universal')
        ${familyId ? 'AND m.family_id = $4' : ''}
        ORDER BY m.memory_date DESC, m.created_at DESC
        LIMIT $2 OFFSET $3
      `;
            params = familyId ? [req.userId, limit, offset, familyId] : [req.userId, limit, offset];
        } else if (feed === 'universal') {
            // Universal feed - all public memories
            query = `
        SELECT m.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM memories m
        JOIN users u ON m.user_id = u.id
        WHERE m.visibility = 'universal'
        ORDER BY m.memory_date DESC, m.created_at DESC
        LIMIT $1 OFFSET $2
      `;
            params = [limit, offset];
        }

        const result = await pool.query(query, params);

        res.json({
            memories: result.rows.map((m: any) => ({
                id: m.id,
                title: m.title,
                description: m.description,
                memoryDate: m.memory_date,
                category: m.category,
                visibility: m.visibility,
                emotionalTags: m.emotional_tags,
                coreValues: m.core_values,
                aiAnalysis: m.ai_analysis,
                authorName: m.author_name,
                authorAvatar: m.author_avatar,
                familyName: m.family_name,
                createdAt: m.created_at
            })),
            feed,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Failed to get memories' });
    }
});

// Get single memory
router.get('/:memoryId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { memoryId } = req.params;

    try {
        const result = await pool.query(
            `SELECT m.*, u.full_name as author_name, u.avatar_url as author_avatar, f.name as family_name
       FROM memories m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN families f ON m.family_id = f.id
       WHERE m.id = $1`,
            [memoryId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        const memory = result.rows[0];

        // Check access permissions
        if (memory.visibility === 'personal' && memory.user_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (memory.visibility === 'family') {
            const memberCheck = await pool.query(
                'SELECT id FROM family_members WHERE family_id = $1 AND user_id = $2',
                [memory.family_id, req.userId]
            );

            if (memberCheck.rows.length === 0 && memory.user_id !== req.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        res.json({
            memory: {
                id: memory.id,
                title: memory.title,
                description: memory.description,
                memoryDate: memory.memory_date,
                category: memory.category,
                visibility: memory.visibility,
                emotionalTags: memory.emotional_tags,
                coreValues: memory.core_values,
                aiAnalysis: memory.ai_analysis,
                authorName: memory.author_name,
                authorAvatar: memory.author_avatar,
                familyName: memory.family_name,
                createdAt: memory.created_at
            }
        });
    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({ error: 'Failed to get memory' });
    }
});

// Update memory
router.put('/:memoryId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { memoryId } = req.params;
    const { title, description, memoryDate, category, visibility, emotionalTags, coreValues } = req.body;

    try {
        // Check ownership
        const ownerCheck = await pool.query('SELECT user_id FROM memories WHERE id = $1', [memoryId]);

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        if (ownerCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'You can only edit your own memories' });
        }

        const result = await pool.query(
            `UPDATE memories SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        memory_date = COALESCE($3, memory_date),
        category = COALESCE($4, category),
        visibility = COALESCE($5, visibility),
        emotional_tags = COALESCE($6, emotional_tags),
        core_values = COALESCE($7, core_values),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
            [title, description, memoryDate, category, visibility, emotionalTags, coreValues, memoryId]
        );

        res.json({
            message: 'Memory updated successfully',
            memory: result.rows[0]
        });
    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({ error: 'Failed to update memory' });
    }
});

// Delete memory
router.delete('/:memoryId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { memoryId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM memories WHERE id = $1 AND user_id = $2 RETURNING *',
            [memoryId, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found or access denied' });
        }

        res.json({ message: 'Memory deleted successfully' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
});

// Get AI insights for user
router.get('/ai/insights', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        // Get user's memories for analysis
        const memories = await pool.query(
            'SELECT * FROM memories WHERE user_id = $1 ORDER BY memory_date ASC',
            [req.userId]
        );

        // Generate insights based on memories
        const insights = {
            totalMemories: memories.rows.length,
            emotionalPatterns: {},
            topValues: {},
            lifeStages: {},
            suggestions: [
                'You have a strong pattern of growth-oriented memories',
                'Consider adding more memories from your early childhood',
                'Your emotional journey shows resilience and adaptability'
            ]
        };

        res.json({ insights });
    } catch (error) {
        console.error('Get insights error:', error);
        res.status(500).json({ error: 'Failed to get insights' });
    }
});

export default router;
