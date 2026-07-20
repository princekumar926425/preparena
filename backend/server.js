import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadStore, saveStore } from "./store.js";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "prep-arena-secret";

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const store = loadStore();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = store.users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hashedPassword, role: "student" };
  store.users.push(user);
  saveStore(store);

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const store = loadStore();
  const user = store.users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get("/api/contests", (_req, res) => {
  const store = loadStore();
  res.json(store.contests);
});

app.post("/api/contests", (req, res) => {
  const store = loadStore();
  const contest = { id: Date.now(), ...req.body };
  store.contests.push(contest);
  saveStore(store);
  res.status(201).json(contest);
});

app.get("/api/lectures", (_req, res) => {
  const store = loadStore();
  res.json(store.lectures.length ? store.lectures : []);
});

app.post("/api/lectures", (req, res) => {
  const store = loadStore();
  const lecture = { id: Date.now().toString(), ...req.body };
  store.lectures.push(lecture);
  saveStore(store);
  res.status(201).json(lecture);
});

app.post("/run", (req, res) => {
  const { code, language } = req.body;

  try {
    if (language === "cpp") {
      fs.writeFileSync("temp.cpp", code);
      exec("g++ temp.cpp -o temp.exe && temp.exe", (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr || "Compilation Error" });
        res.json({ output: stdout });
      });
    } else if (language === "python") {
      fs.writeFileSync("temp.py", code);
      exec("python temp.py", (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr });
        res.json({ output: stdout });
      });
    } else if (language === "java") {
      fs.writeFileSync("Main.java", code);
      exec("javac Main.java && java Main", (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr });
        res.json({ output: stdout });
      });
    } else {
      res.json({ output: "Unsupported language" });
    }
  } catch (error) {
    res.json({ output: "Execution error" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));