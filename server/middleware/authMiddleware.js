// ============================================================
// middleware/authMiddleware.js
// Protects private routes by verifying the JWT in the request header.
//
// How it works:
//   1. Looks for:  Authorization: Bearer <token>
//   2. Verifies the token using JWT_SECRET
//   3. Fetches the user from DB (excluding password)
//   4. Attaches the user to req.user for downstream handlers
//   5. Calls next() to continue to the route handler
//
// Usage (in a route file):
//   const { protect } = require('../middleware/authMiddleware');
//   router.get('/private', protect, myController);
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect – middleware that guards private routes
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (remove the "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify the token; throws an error if expired or tampered with
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from DB using the ID embedded in the token
      // .select('-password') ensures the hashed password is NOT returned
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Token is valid, proceed to the next middleware/controller
      next();
    } catch (error) {
      // Token verification failed (expired, invalid signature, etc.)
      return res.status(401).json({ message: "Not authorised, token failed" });
    }
  }

  // No token was provided at all
  if (!token) {
    return res.status(401).json({ message: "Not authorised, no token provided" });
  }
};

module.exports = { protect };
