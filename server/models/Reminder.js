import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  notes: { type: String },
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Reminder", reminderSchema);
