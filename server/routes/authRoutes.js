// ============================================================
// routes/authRoutes.js
// Maps HTTP endpoints to auth controller functions.
//
// All routes here are PUBLIC (no JWT required).
//
// Base path (mounted in server.js): /api/auth
//
//   POST /api/auth/register  → registerUser
//   POST /api/auth/login     → loginUser
// ============================================================

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginLimiter, loginUser);

module.exports = router;
