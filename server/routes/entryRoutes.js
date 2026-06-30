// ============================================================
// routes/entryRoutes.js
// Maps HTTP endpoints to entry controller functions.
//
// ALL routes here are PROTECTED – a valid JWT is required.
// The 'protect' middleware is applied to every route.
//
// Base path (mounted in server.js): /api/entries
//
//   POST   /api/entries        → createEntry
//   GET    /api/entries        → getEntries
//   GET    /api/entries/:id    → getEntryById
//   PUT    /api/entries/:id    → updateEntry
//   DELETE /api/entries/:id    → deleteEntry
// ============================================================

const express = require("express");
const router = express.Router();

const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");

const { protect } = require("../middleware/authMiddleware");

// All entry routes require authentication
router.route("/")
  .post(protect, createEntry)   // Create a new entry
  .get(protect, getEntries);    // Get all entries for the logged-in user

router.route("/:id")
  .get(protect, getEntryById)   // Get a single entry
  .put(protect, updateEntry)    // Update an entry
  .delete(protect, deleteEntry); // Delete an entry

module.exports = router;
