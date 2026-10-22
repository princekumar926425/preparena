import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    const error = new Error("Authentication is not configured. Set JWT_SECRET.");
    error.status = 503;
    throw error;
  }
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function signup(req, res) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (name.length > 80 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid name and email address." });
  }
  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
  }
  if (req.body.confirmPassword !== undefined && req.body.confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match." });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured. Set JWT_SECRET." });
  }
  if (await User.exists({ email })) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  try {
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    throw error;
  }
}

export async function login(req, res) {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured. Set JWT_SECRET." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  return res.json({ token: createToken(user), user: publicUser(user) });
}
