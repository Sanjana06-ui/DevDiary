// ============================================================
// server.js
// Entry point for the DevDiary backend server.
//
// Responsibilities:
//   1. Load environment variables from .env
//   2. Connect to MongoDB
//   3. Configure Express middleware (cors, json parsing)
//   4. Mount API routes
//   5. Mount error-handling middleware (must come LAST)
//   6. Start listening on the configured PORT
// ============================================================

// ----------------------------
// 1. Load Environment Variables
// ----------------------------
require("dotenv").config();

// ----------------------------
// 2. Import Dependencies
// ----------------------------
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ----------------------------
// 3. Import Internal Modules
// ----------------------------
const connectDB = require("./config/db");

// Route files
const authRoutes  = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");

// Error-handling middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ----------------------------
// 4. Initialise the Express App
// ----------------------------
const app = express();

// ----------------------------
// 5. Connect to MongoDB
// ----------------------------
connectDB();

// ----------------------------
// 6. Configure Middleware
// ----------------------------

// Set security HTTP headers
app.use(helmet());

// Apply global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Parse incoming JSON request bodies → populates req.body
app.use(express.json());

// Enable CORS so the frontend (on a different origin) can reach this API
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// ----------------------------
// 7. API Routes
// ----------------------------

// Health-check – useful for uptime monitoring / confirming the server is alive
app.get("/", (req, res) => {
  res.status(200).json({ message: "DevDiary Backend Running" });
});

// Auth routes (register, login)       → /api/auth
app.use("/api/auth", authRoutes);

// Diary Entry CRUD routes             → /api/entries
app.use("/api/entries", entryRoutes);

// ----------------------------
// 8. Error-Handling Middleware
// ----------------------------
// IMPORTANT: These MUST be mounted after all routes.

// Catch requests to routes that don't exist → 404
app.use(notFound);

// Global error handler – formats all errors as JSON
app.use(errorHandler);

// ----------------------------
// 9. Start the Server
// ----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 DevDiary server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
