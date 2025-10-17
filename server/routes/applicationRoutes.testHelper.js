import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const newApp = await Application.create({
      userId: req.user?.uid || "test-user",
      company: req.body.company,
      position: req.body.position,
      status: req.body.status?.toLowerCase(),
      notes: req.body.notes,
      reminder: req.body.reminder || null,
      reminderMessage: req.body.reminderMessage || "",
    });
    res.status(201).json(newApp);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(400).json({ message: error.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user?.uid || "test-user",
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(400)
      .json({ message: "Failed to fetch applications." });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      {
        company: req.body.company,
        position: req.body.position,
        status: req.body.status?.toLowerCase(),
        notes: req.body.notes,
        reminder: req.body.reminder,
        reminderMessage: req.body.reminderMessage,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating application:", error);
    res
      .status(400)
      .json({ message: "Failed to update application." });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Application deleted" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res
      .status(400)
      .json({ message: "Failed to delete application." });
  }
});

export default router;
