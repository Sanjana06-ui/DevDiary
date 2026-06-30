// ============================================================
// utils/generateToken.js
// A simple helper utility that creates a signed JWT for a user.
//
// Usage:
//   const token = generateToken(user._id);
//
// The token is returned to the client after successful register/login.
// The client must send it in the Authorization header for protected routes:
//   Authorization: Bearer <token>
// ============================================================

const jwt = require("jsonwebtoken");

/**
 * generateToken
 *
 * @param {string} id - The MongoDB ObjectId of the authenticated user
 * @returns {string}  - A signed JWT string
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: only the user's ID is embedded in the token
    process.env.JWT_SECRET, // Secret key from .env
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Default expiry: 7 days
    }
  );
};

module.exports = generateToken;
