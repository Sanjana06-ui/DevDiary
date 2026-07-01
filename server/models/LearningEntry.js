// ============================================================
// models/LearningEntry.js
// Mongoose schema and model for a Learning Entry resource.
//
// Each entry belongs to exactly one User (via a ref).
// Fields: title, content, mood (enum), tags (string array).
// ============================================================

const mongoose = require("mongoose");

const learningEntrySchema = new mongoose.Schema(
  {
    // Reference to the User who owns this entry
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Short title for the learning entry
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    // Main body / content of the learning entry
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },

    // Mood captures the user's emotional state for this entry
    mood: {
      type: String,
      enum: {
        values: ["Happy", "Sad", "Neutral", "Excited", "Anxious", "Angry", "Grateful"],
        message: "{VALUE} is not a supported mood",
      },
      default: "Neutral",
    },

    // Tags allow users to categorise entries (e.g. "work", "react")
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model("LearningEntry", learningEntrySchema);
