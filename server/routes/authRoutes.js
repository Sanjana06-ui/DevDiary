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

const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
