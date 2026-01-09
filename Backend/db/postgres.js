import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon DB
    },
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL (Neon DB)');
        release();
    }
});

export const query = (text, params) => pool.query(text, params);
export default pool;
