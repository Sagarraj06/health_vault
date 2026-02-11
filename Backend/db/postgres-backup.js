import pg from 'pg';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let sqliteDb = null;
let dbConnected = false;
let dbType = 'none';

// Try to connect to PostgreSQL first
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 3000,
});

// Test PostgreSQL connection
pgPool.connect((err, client, release) => {
    if (err) {
        console.error('\n⚠️  PostgreSQL Connection Failed');
        console.log('Error:', err.message);
        console.log('Falling back to SQLite for local development...\n');
        
        // Use SQLite instead
        dbType = 'sqlite';
        const dbPath = path.join(__dirname, '../../health_vault.db');
        sqliteDb = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ SQLite Error:', err.message);
            } else {
                console.log(`✅ Connected to SQLite (${dbPath})`);
                console.log('ℹ️  Local development mode - data will be stored locally\n');
                dbConnected = true;
            }
        });
    } else {
        console.log('✅ Connected to PostgreSQL (Neon DB)');
        pool = pgPool;
        dbType = 'postgresql';
        dbConnected = true;
        release();
    }
});

// Handle PostgreSQL pool errors
pgPool.on('error', (err) => {
    console.error('Database pool error:', err.message);
});

// Export query function that works with both databases
export const query = async (text, params) => {
    if (dbType === 'postgresql' && pool) {
        return pool.query(text, params);
    } else if (dbType === 'sqlite' && sqliteDb) {
        // For SQLite, execute the query
        return new Promise((resolve, reject) => {
            sqliteDb.all(text, params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows: rows || [] });
            });
        });
    } else {
        throw new Error('No database connection available');
    }
};

export const isDbConnected = () => dbConnected;
export const getDbType = () => dbType;
export default pool || sqliteDb;
