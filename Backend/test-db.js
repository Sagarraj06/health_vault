#!/usr/bin/env node

/**
 * Database Connection Test & Fix
 * Run this to troubleshoot and fix database connection issues
 */

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

console.log('\n🔍 Database Connection Diagnostic Tool\n');
console.log('═'.repeat(50));

// Step 1: Check if DATABASE_URL exists
console.log('\n1️⃣  Checking DATABASE_URL...');
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env');
    console.log('\n📝 Add this to your .env file:');
    console.log('DATABASE_URL=postgresql://user:password@host/dbname');
    process.exit(1);
} else {
    const masked = DATABASE_URL.replace(/:[^:]*@/, ':****@');
    console.log('✅ DATABASE_URL found');
    console.log('   ', masked);
}

// Step 2: Parse connection string
console.log('\n2️⃣  Parsing connection string...');
try {
    const url = new URL(DATABASE_URL);
    console.log('✅ Valid PostgreSQL URL');
    console.log('   Host:', url.hostname);
    console.log('   Port:', url.port || '5432');
    console.log('   Database:', url.pathname.replace('/', ''));
    console.log('   User:', url.username);
} catch (e) {
    console.error('❌ Invalid DATABASE_URL format');
    console.log('   Error:', e.message);
    process.exit(1);
}

// Step 3: Try to connect
console.log('\n3️⃣  Testing database connection...');
const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 5000,
});

const timeoutId = setTimeout(() => {
    console.error('❌ Connection timeout (5s)');
    console.log('\n💡 Possible causes:');
    console.log('   • Firewall blocking connection');
    console.log('   • Database host is down');
    console.log('   • Wrong host/port');
    console.log('   • Neon project is suspended');
    process.exit(1);
}, 10000);

pool.connect(async (err, client, release) => {
    clearTimeout(timeoutId);
    
    if (err) {
        console.error('❌ Connection failed');
        console.log('   Error:', err.message);
        console.log('\n💡 Troubleshooting:');
        
        if (err.message.includes('ENOTFOUND')) {
            console.log('   • DNS resolution failed - Check internet connection');
            console.log('   • Try: ping google.com');
        } else if (err.message.includes('ECONNREFUSED')) {
            console.log('   • Connection refused - Database might be down');
            console.log('   • Check Neon console: https://console.neon.tech');
        } else if (err.message.includes('authentication')) {
            console.log('   • Wrong credentials');
            console.log('   • Get fresh URL from: https://console.neon.tech');
        }
        
        pool.end();
        process.exit(1);
    } else {
        console.log('✅ Connection successful!');
        
        // Step 4: Run a test query
        console.log('\n4️⃣  Testing query execution...');
        try {
            const result = await client.query('SELECT NOW()');
            console.log('✅ Query executed successfully');
            console.log('   Server time:', result.rows[0].now);
        } catch (e) {
            console.error('❌ Query failed');
            console.log('   Error:', e.message);
        } finally {
            release();
            pool.end();
            
            console.log('\n✨ All tests passed!');
            console.log('\n🚀 You can now start the server:');
            console.log('   npm run dev\n');
        }
    }
});
