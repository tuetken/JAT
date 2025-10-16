import express from "express";
import Reminder from "../models/Reminder.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// CREATE reminder
router.post("/", verifyToken, async (req, res) => {
  try {
    const reminder = await Reminder.create({
      userId: req.user.uid,
      title: req.body.title,
      dueDate: req.body.dueDate,
      notes: req.body.notes,
    });
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(400).json({ message: error.message });
  }
});

// READ all reminders for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user.uid,
    }).sort({
      dueDate: 1,
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE reminder
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      {
        title: req.body.title,
        dueDate: req.body.dueDate,
        notes: req.body.notes,
        completed: req.body.completed,
      },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE reminder
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
