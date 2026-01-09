import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './postgres.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrate = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await pool.query(schemaSql);
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
