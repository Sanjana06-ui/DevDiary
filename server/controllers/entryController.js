// ============================================================
// controllers/entryController.js
// Business logic for Learning Entry CRUD operations.
//
// All functions require req.user to be set by authMiddleware.
// Ownership is enforced at the DB query level:
//   every findOne/findById includes { user: req.user._id }
//   so a non-owned entry is indistinguishable from a missing one → 404.
//
// Routes:
//   POST   /api/entries        → createEntry
//   GET    /api/entries        → getEntries
//   GET    /api/entries/:id    → getEntryById
//   PUT    /api/entries/:id    → updateEntry
//   DELETE /api/entries/:id    → deleteEntry
// ============================================================

const LearningEntry = require("../models/LearningEntry");

// @desc    Create a new learning entry
// @route   POST /api/entries
// @access  Private
const createEntry = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const entry = await LearningEntry.create({
      user: req.user._id,
      title,
      content,
      mood,
      tags,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all learning entries for the logged-in user
// @route   GET /api/entries
// @access  Private
const getEntries = async (req, res) => {
  try {
    // Filter by userId so users can only see their own entries
    const entries = await LearningEntry.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single learning entry by ID
// @route   GET /api/entries/:id
// @access  Private
const getEntryById = async (req, res) => {
  try {
    // Include userId in the query – if the entry belongs to a different user
    // it will not be found, returning 404 (no information leak via 403)
    const entry = await LearningEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a learning entry
// @route   PUT /api/entries/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    // Include userId so only the owner can find (and therefore update) the entry
    const entry = await LearningEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Apply only the fields that were actually sent in the request body
    const { title, content, mood, tags } = req.body;
    entry.title   = title   ?? entry.title;
    entry.content = content ?? entry.content;
    entry.mood    = mood    ?? entry.mood;
    entry.tags    = tags    ?? entry.tags;

    const updatedEntry = await entry.save();

    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a learning entry
// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    // Include userId so only the owner can find (and therefore delete) the entry
    const entry = await LearningEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await entry.deleteOne();

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};
