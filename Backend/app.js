import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import Routes from "./routes/index.js";
import testRoutes from "./routes/testRoutes.js";
import "./db/postgres.js"; // Initialize DB connection

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.FRONTEND_URL // Allow production frontend
    ].filter(Boolean), // Remove undefined/null values
    credentials: true,
  })
);

app.use("/api/v1", Routes);

// Vercel requires exporting the app
export default app;

// Only listen if not running in Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3053;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


