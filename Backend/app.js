import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import Routes from "./routes/index.js";
import testRoutes from "./routes/testRoutes.js";
import "./db/postgres.js"; // Initialize DB connection

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:5001",
      process.env.FRONTEND_URL // Allow production frontend
    ].filter(Boolean), // Remove undefined/null values
    credentials: true,
  })
);

// Configure Socket.io with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:5001",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  
  // Handle custom events
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

// Attach io to app for access in routes
app.io = io;

app.use("/api/v1", Routes);

// Vercel requires exporting the app
export default app;

// Only listen if not running in Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3053;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✅ Socket.io is ready`);
  });
}


