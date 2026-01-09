import { query } from './postgres.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        console.log('🔄 Starting timezone migration...');

        // 1. Update doctor_slots table
        console.log('📝 Converting doctor_slots.date_time to TIMESTAMPTZ...');
        await query(`
      ALTER TABLE doctor_slots 
      ALTER COLUMN date_time TYPE TIMESTAMPTZ 
      USING date_time AT TIME ZONE 'UTC'
    `);
        console.log('✅ doctor_slots.date_time converted');

        // 2. Update appointments table
        console.log('📝 Converting appointments.slot_date_time to TIMESTAMPTZ...');
        await query(`
      ALTER TABLE appointments 
      ALTER COLUMN slot_date_time TYPE TIMESTAMPTZ 
      USING slot_date_time AT TIME ZONE 'UTC'
    `);
        console.log('✅ appointments.slot_date_time converted');

        // 3. Verify the changes
        console.log('\n📊 Verifying column types...');
        const result = await query(`
      SELECT 
        table_name, 
        column_name, 
        data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('doctor_slots', 'appointments') 
        AND column_name IN ('date_time', 'slot_date_time')
      ORDER BY table_name, column_name
    `);

        console.table(result.rows);
        console.log('\n✨ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
