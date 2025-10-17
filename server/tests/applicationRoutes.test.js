import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import applicationRoutes from "../routes/applicationRoutes.testHelper.js";
import Application from "../models/Application.js";

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = { uid: "test-user-123" };
    next();
  });

  // mount the test-only routes
  app.use("/api/applications", applicationRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Application API Endpoints", () => {
  it("POST /api/applications - should create a new application", async () => {
    const res = await request(app)
      .post("/api/applications")
      .send({
        userId: "12345",
        company: "Meta",
        position: "Backend Developer",
        status: "interview",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.company).toBe("Meta");
  });

  it("GET /api/applications - should return all applications", async () => {
    const res = await request(app).get("/api/applications");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /api/applications/:id - should update an existing application", async () => {
    const appData = await Application.create({
      userId: "12345",
      company: "Apple",
      position: "Frontend Engineer",
      status: "waiting for response",
    });

    const res = await request(app)
      .put(`/api/applications/${appData._id}`)
      .send({ status: "offer received" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("offer received");
  });

  it("DELETE /api/applications/:id - should delete an application", async () => {
    const appData = await Application.create({
      userId: "9999",
      company: "Google",
      position: "SWE",
      status: "denied",
    });

    const res = await request(app).delete(
      `/api/applications/${appData._id}`
    );
    expect(res.statusCode).toBe(200);
  });
});
