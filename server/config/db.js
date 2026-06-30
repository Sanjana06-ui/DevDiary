// ============================================================
// config/db.js
// Handles the connection to MongoDB using Mongoose.
// This function is called once when the server starts.
// ============================================================

const mongoose = require("mongoose");

/**
 * connectDB – Establishes a connection to MongoDB.
 *
 * - Reads the connection string from the MONGO_URI environment variable.
 * - Logs a success message with the host name on successful connection.
 * - If the connection fails, logs the error and exits the process with
 *   a non-zero code (1) so the OS / process manager knows it crashed.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log the host we connected to (e.g., cluster0.mongodb.net)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error message in red so it stands out
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit the Node process with failure code
    // This prevents the server from running without a database
    process.exit(1);
  }
};

module.exports = connectDB;
