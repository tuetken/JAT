import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Application from "../models/Application.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Application Model Validation", () => {
  it("should create a valid application", async () => {
    const app = new Application({
      userId: "12345",
      company: "Spotify",
      position: "Software Engineer",
      status: "waiting for response",
    });

    const saved = await app.save();
    expect(saved._id).toBeDefined();
    expect(saved.company).toBe("Spotify");
  });

  it("should fail validation if required fields are missing", async () => {
    const app = new Application({});
    let err;
    try {
      await app.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(
      mongoose.Error.ValidationError
    );
  });
});
