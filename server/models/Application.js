import mongoose from "mongoose";

// Define the structure (schema) for a Job Application
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },

    company: {
      type: String,
      trim: true,
      minlength: [
        2,
        "Company name must be at least 2 characters",
      ],
      maxlength: [
        100,
        "Company name cannot exceed 100 characters",
      ],
      required: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "waiting for response",
        "interview",
        "offer received",
        "accepted",
        "denied",
      ],
      default: "waiting for response",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    reminder: {
      type: Date,
      default: null,
    },

    // ✅ New Field — allows per-application custom messages
    reminderMessage: {
      type: String,
      trim: true,
      default: "",
    },

    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Application",
  applicationSchema
);
