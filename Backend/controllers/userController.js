import { query } from "../db/postgres.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT Token & Set Cookie
const generateToken = (res, user) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", token, { httpOnly: true });
  return token;
};

// User Signup
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      dateOfBirth,
      gender,
      specialization,
    } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields (name, email, password, role)." });
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // 3. Password Strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // 4. Check if user exists
    const userExistsResult = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert User
    const insertUserQuery = `
      INSERT INTO users (name, email, password, role, phone, date_of_birth, gender, specialization)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const newUserResult = await query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      role,
      phone,
      dateOfBirth,
      gender,
      role === "doctor" ? specialization : null,
    ]);

    const user = newUserResult.rows[0];

    generateToken(res, user);
    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(res, user);
    return res.status(200).json({
      token,
      role: user.role,
      userData: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// User Logout
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
};

export const getAllDoctors = async (req, res) => {
  try {
    const result = await query("SELECT * FROM users WHERE role = $1", ["doctor"]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAvailableTimeSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const doctorResult = await query("SELECT * FROM users WHERE id = $1 AND role = 'doctor'", [doctorId]);
    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // In SQL, we query the doctor_slots table
    // Assuming date is 'YYYY-MM-DD'
    const slotsResult = await query(`
      SELECT id, date_time, is_booked 
      FROM doctor_slots 
      WHERE doctor_id = $1 
      AND date_time::date = $2::date
      AND is_booked = FALSE
      ORDER BY date_time ASC
    `, [doctorId, date]);

    const availableSlots = slotsResult.rows.map(slot => {
      const date = new Date(slot.date_time);
      // Use UTC hours and minutes to avoid timezone issues
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();

      // Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;

      return {
        id: slot.id,
        time: timeStr
      };
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};
