import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import applicationRoutes from "./routes/applicationRoutes.js";
import admin from "firebase-admin";
import { createRequire } from "module";
import reminderRoutes from "./routes/reminderRoutes.js";

const require = createRequire(import.meta.url);
const serviceAccount = require("./config/firebaseServiceAccount.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) =>
    console.error("MongoDB Connection Error", err)
  );

// Test route
app.get("/", (req, res) => {
  res.send("Job Application Tracker Backend Is Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`);
});

// Reminders
app.use("/api/reminders", reminderRoutes);
