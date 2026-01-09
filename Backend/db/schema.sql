-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'doctor', 'admin')) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    specialization VARCHAR(255), -- Only for doctors
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Slots Table (Normalized from User.availableSlots)
CREATE TABLE IF NOT EXISTS doctor_slots (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    slot_date_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'delayed')),
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Null if manual upload
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    prescription TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_manual_upload BOOLEAN DEFAULT FALSE,
    external_doctor_name VARCHAR(255),
    external_hospital_name VARCHAR(255),
    attachments JSONB, -- Stores array of file objects {url, publicId, format}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Leaves Table
CREATE TABLE IF NOT EXISTS medical_leaves (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    health_record_id INTEGER REFERENCES health_records(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    supporting_documents JSONB,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('appointment', 'leave')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
