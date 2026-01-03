import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Auto-create all database tables
export const initializeDatabase = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Families table
        await client.query(`
      CREATE TABLE IF NOT EXISTS families (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Family members junction table
        await client.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(family_id, user_id)
      )
    `);

        // Memories table
        await client.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        family_id INTEGER,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        memory_date DATE NOT NULL,
        category VARCHAR(100),
        visibility VARCHAR(20) DEFAULT 'personal',
        emotional_tags TEXT[],
        core_values TEXT[],
        ai_analysis JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Memory media table (for images, videos, etc.)
        await client.query(`
      CREATE TABLE IF NOT EXISTS memory_media (
        id SERIAL PRIMARY KEY,
        memory_id INTEGER REFERENCES memories(id) ON DELETE CASCADE,
        media_url TEXT NOT NULL,
        media_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Life events table (extracted from AI analysis)
        await client.query(`
      CREATE TABLE IF NOT EXISTS life_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        memory_id INTEGER REFERENCES memories(id) ON DELETE CASCADE,
        event_type VARCHAR(100),
        event_date DATE,
        significance_score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Relationships table (for knowledge graph)
        await client.query(`
      CREATE TABLE IF NOT EXISTS relationships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        source_memory_id INTEGER REFERENCES memories(id) ON DELETE CASCADE,
        target_memory_id INTEGER REFERENCES memories(id) ON DELETE CASCADE,
        relationship_type VARCHAR(100),
        strength DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Insights table (AI-generated insights)
        await client.query(`
      CREATE TABLE IF NOT EXISTS insights (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        insight_type VARCHAR(100),
        content TEXT NOT NULL,
        related_memories INTEGER[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create indexes for better performance
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);
      CREATE INDEX IF NOT EXISTS idx_memories_family_id ON memories(family_id);
      CREATE INDEX IF NOT EXISTS idx_memories_visibility ON memories(visibility);
      CREATE INDEX IF NOT EXISTS idx_memories_date ON memories(memory_date);
      CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
      CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
    `);

        await client.query('COMMIT');
        console.log('✅ Database tables created successfully!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error creating database tables:', error);
        throw error;
    } finally {
        client.release();
    }
};

export default pool;
