import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // 🔥 Get Authorization header
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // 🔥 debug

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 🔥 Extract token
    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token); // 🔥 debug

    // 🔥 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 🔥 debug

    // 🔥 Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Attach user
    req.user = user;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};