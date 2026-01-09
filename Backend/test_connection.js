import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

console.log("Testing MongoDB Connection...");
console.log("URI:", uri ? uri.replace(/:([^:@]+)@/, ':****@') : "Undefined"); // Hide password

if (!uri) {
    console.error("MONGO_URI is undefined. Check your .env file.");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Connection Failed:", err.message);
        console.error("Full Error:", err);
        process.exit(1);
    });
