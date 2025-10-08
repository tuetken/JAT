// models/Application.js
import mongoose from "mongoose";

// 1️⃣ Define the structure (schema) for a Job Application
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID Is Required"],
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: [
        2,
        "Company Name Must Be At Least 2 Characters",
      ],
      maxlength: [
        100,
        "Company Names Cannot Exceed 100 Characters",
      ],
    },
    position: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "Applied",
        "Awaiting Response",
        "Interview",
        "Offer Received",
        "Offer Sent",
        "Rejected",
      ],
      default: "Applied",
    },
    dateApplied: { type: Date, default: Date.now },
    notes: {
      type: String,
      maxlength: [
        1000,
        "Notes Cannot Exceed 1000 Characters",
      ],
    },
  },
  { timestamps: true }
);

// 2️⃣ Turn that schema into a Model
const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;
