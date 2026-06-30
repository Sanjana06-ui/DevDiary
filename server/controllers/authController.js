// ============================================================
// controllers/authController.js
// Handles the business logic for user authentication.
//
// Exported functions:
//   - registerUser  → POST /api/auth/register
//   - loginUser     → POST /api/auth/login
// ============================================================

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ----------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ----------------------------
const registerUser = async (req, res) => {
  try {
    // 1. Destructure the expected fields from the request body
    const { name, email, password } = req.body;

    // 2. Basic validation – ensure all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    // 4. Create the user document
    //    The password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    // 5. Respond with user info + a signed JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Pass any unexpected errors to the global error handler (Phase 4)
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// @desc    Authenticate user & return token
// @route   POST /api/auth/login
// @access  Public
// ----------------------------
const loginUser = async (req, res) => {
  try {
    // 1. Pull credentials from the request body
    const { email, password } = req.body;

    // 2. Validate that both fields were provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 3. Look up the user by email.
    // We need +password here because the schema has select:false on that field.
    // This is the ONLY place we ever load the raw hash – solely for comparison.
    const user = await User.findOne({ email }).select("+password");

    // 4. If user not found OR password doesn't match → generic 401
    //    We use a generic message intentionally to avoid user-enumeration attacks
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Credentials are valid – respond with user info + token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
