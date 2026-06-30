// ============================================================
// server.js
// Entry point for the DevDiary backend server.
// Responsibilities:
//   1. Load environment variables from .env
//   2. Connect to MongoDB
//   3. Configure Express (middleware)
//   4. Mount routes
//   5. Start listening on the configured PORT
// ============================================================

// ----------------------------
// 1. Load Environment Variables
// ----------------------------
// dotenv reads the .env file and injects its key-value pairs into
// process.env so we can safely use them throughout the app.
require("dotenv").config();

// ----------------------------
// 2. Import Dependencies
// ----------------------------
const express = require("express"); // Web framework for Node.js
const cors = require("cors");       // Enables Cross-Origin Resource Sharing

// ----------------------------
// 3. Import Internal Modules
// ----------------------------
const connectDB = require("./config/db"); // MongoDB connection helper

// ----------------------------
// 4. Initialise the Express App
// ----------------------------
const app = express();

// ----------------------------
// 5. Connect to MongoDB
// ----------------------------
// We call connectDB() at startup. If it fails, the process exits (see db.js).
connectDB();

// ----------------------------
// 6. Configure Middleware
// ----------------------------

// Enable CORS so the frontend (running on a different origin/port) can
// communicate with this API without being blocked by the browser.
app.use(cors());

// Parse incoming requests with JSON payloads (application/json).
// This populates req.body for POST / PUT / PATCH requests.
app.use(express.json());

// Parse incoming requests with URL-encoded payloads (HTML form data).
// extended: false uses the built-in querystring library.
app.use(express.urlencoded({ extended: false }));

// ----------------------------
// 7. Routes
// ----------------------------

// Health-check route – useful for verifying the API is running
// and for load-balancer / uptime monitoring pings.
app.get("/", (req, res) => {
  res.status(200).json({ message: "DevDiary Backend Running" });
});

// ----------------------------
// 8. 404 Handler
// ----------------------------
// Catch-all for any route that is not defined above.
// Must be placed AFTER all other routes.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------------
// 9. Start the Server
// ----------------------------
// process.env.PORT is set in .env; fall back to 5000 for local dev
// when .env is missing or PORT is not defined.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 DevDiary server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
