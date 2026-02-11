#!/usr/bin/env node
/**
 * Seed test data into SQLite database
 */

import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../health_vault.db');

console.log('🌱 Seeding test data...\n');

const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }

    try {
        // Hash passwords
        const password = await bcrypt.hash('password123', 10);
        
        // Insert test doctors
        const doctors = [
            {
                name: 'Dr. Rajesh Kumar',
                email: 'rajesh@hospital.com',
                role: 'doctor',
                specialization: 'Cardiology',
                phone: '+91-9876543210'
            },
            {
                name: 'Dr. Priya Sharma',
                email: 'priya@hospital.com',
                role: 'doctor',
                specialization: 'Dermatology',
                phone: '+91-9876543211'
            },
            {
                name: 'Dr. Amit Patel',
                email: 'amit@hospital.com',
                role: 'doctor',
                specialization: 'General Medicine',
                phone: '+91-9876543212'
            },
            {
                name: 'Dr. Sarah Wilson',
                email: 'sarah@hospital.com',
                role: 'doctor',
                specialization: 'Pediatrics',
                phone: '+91-9876543213'
            }
        ];

        // Insert students
        const students = [
            {
                name: 'John Doe',
                email: 'john@student.com',
                role: 'student',
                phone: '+91-8765432100'
            },
            {
                name: 'Jane Smith',
                email: 'jane@student.com',
                role: 'student',
                phone: '+91-8765432101'
            }
        ];

        // Insert admin
        const admin = {
            name: 'Admin User',
            email: 'admin@hospital.com',
            role: 'admin',
            phone: '+91-9000000000'
        };

        db.serialize(() => {
            // Insert doctors
            doctors.forEach(doc => {
                db.run(
                    'INSERT OR IGNORE INTO users (name, email, password, role, specialization, phone) VALUES (?, ?, ?, ?, ?, ?)',
                    [doc.name, doc.email, password, doc.role, doc.specialization, doc.phone],
                    function(err) {
                        if (!err) console.log(`✅ Added doctor: ${doc.name}`);
                    }
                );
            });

            // Insert students
            students.forEach(student => {
                db.run(
                    'INSERT OR IGNORE INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
                    [student.name, student.email, password, student.role, student.phone],
                    function(err) {
                        if (!err) console.log(`✅ Added student: ${student.name}`);
                    }
                );
            });

            // Insert admin
            db.run(
                'INSERT OR IGNORE INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
                [admin.name, admin.email, password, admin.role, admin.phone],
                function(err) {
                    if (!err) console.log(`✅ Added admin: ${admin.name}`);
                    
                    console.log('\n✨ Seed data added successfully!');
                    console.log('\n📝 Test Credentials:');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Doctors:');
                    doctors.forEach(d => console.log(`  ${d.email} / password123`));
                    console.log('\nStudents:');
                    students.forEach(s => console.log(`  ${s.email} / password123`));
                    console.log('\nAdmin:');
                    console.log(`  ${admin.email} / password123`);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                    
                    db.close();
                    process.exit(0);
                }
            );
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        db.close();
        process.exit(1);
    }
});
