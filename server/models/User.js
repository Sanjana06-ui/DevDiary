// ============================================================
// models/User.js
// Mongoose schema and model for the User resource.
//
// Responsibilities:
//   - Define the shape of a user document in MongoDB
//   - Automatically hash the password before saving (pre-save hook)
//   - Provide a method to compare plain-text passwords with the hash
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ----------------------------
// User Schema Definition
// ----------------------------
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Email must be unique across the collection
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Store emails in lower-case for consistency
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    // Password is stored as a bcrypt hash – never plain text.
    // select: false ensures it is never returned in API responses unless
    // explicitly requested with .select('+password').
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
  },
  {
    // Mongoose automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ----------------------------
// Pre-Save Hook – Hash Password
// ----------------------------
// This middleware runs automatically before every .save() call.
// We only re-hash if the password field was actually modified
// (so updating name/email doesn't trigger an unnecessary re-hash).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if password hasn't changed
  }

  // Generate a salt with 10 rounds (good balance of security vs. speed)
  const salt = await bcrypt.genSalt(10);

  // Replace the plain-text password with the hash
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ----------------------------
// Instance Method – matchPassword
// ----------------------------
// Called during login to compare the submitted plain-text password
// against the stored hash. Returns a boolean.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ----------------------------
// Export the Model
// ----------------------------
module.exports = mongoose.model("User", userSchema);
