// middleware/verifyToken.js
import admin from "firebase-admin";

export const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Grab the token from the request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided." });
    }

    const idToken = authHeader.split(" ")[1];

    // 2️⃣ Verify token with Firebase Admin
    const decodedToken = await admin
      .auth()
      .verifyIdToken(idToken);

    // 3️⃣ Attach user info to request for later use
    req.user = decodedToken;
    next(); // move to the next middleware or route
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(403)
      .json({ message: "Unauthorized or invalid token." });
  }
};
