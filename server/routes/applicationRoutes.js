// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * CREATE - Add a new job application
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const newApplication = await Application.create({
      userId: req.user.uid, // userId from Firebase
      company: req.body.company,
      position: req.body.position,
      status: req.body.status,
      notes: req.body.notes,
    });
    res.status(201).json(newApplication);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * READ - Get all job applications
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    // Only fetch applications that belong to the current user
    const applications = await Application.find({
      userId: req.user.uid,
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch applications." });
  }
});

// UPDATE an application
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedApp = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      {
        company: req.body.company,
        position: req.body.position,
        status: req.body.status.toLowerCase(),
        notes: req.body.notes,
      },
      { new: true, runValidators: true }
    );

    if (!updatedApp) {
      return res
        .status(404)
        .json({ message: "Application not found" });
    }

    res.json(updatedApp);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE - Remove a specific job application
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // Only delete if this user's UID matches the stored one
    const deletedApp = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid, // ✅ ensures they can only delete their own
    });

    if (!deletedApp) {
      return res.status(404).json({
        message: "Application not found or unauthorized.",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      message: "Server error while deleting application.",
    });
  }
});

export default router;
