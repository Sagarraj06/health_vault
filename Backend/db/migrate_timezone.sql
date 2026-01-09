-- Migration to fix timezone handling
-- This converts TIMESTAMP columns to TIMESTAMPTZ

-- 1. Update doctor_slots table
ALTER TABLE doctor_slots 
ALTER COLUMN date_time TYPE TIMESTAMPTZ 
USING date_time AT TIME ZONE 'UTC';

-- 2. Update appointments table
ALTER TABLE appointments 
ALTER COLUMN slot_date_time TYPE TIMESTAMPTZ 
USING slot_date_time AT TIME ZONE 'UTC';

-- Verify the changes
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('doctor_slots', 'appointments') 
  AND column_name IN ('date_time', 'slot_date_time');
