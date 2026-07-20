import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { exec } from "child_process";
import fs from "fs";

dotenv.config();
const app = express();
const memoryUsers = [];
const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getUserByEmail = (email) => {
  return memoryUsers.find((user) => user.email === email) || null;
};

const createUser = (userData) => {
  const newUser = {
    ...userData,
    _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryUsers.push(newUser);
  return newUser;
};

const parsePayload = (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return {};
};

const isPasswordMatch = async (inputPassword, storedPassword) => {
  if (!inputPassword || !storedPassword) return false;

  if (typeof storedPassword === "string" && storedPassword.startsWith("$2")) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  return inputPassword === storedPassword;
};

const execPromise = (cmd, options = {}) => {
  return new Promise((resolve) => {
    exec(cmd, options, (err, stdout, stderr) => {
      resolve({ err, stdout: stdout?.toString() || "", stderr: stderr?.toString() || "" });
    });
  });
};

const judgeProblems = {
  "two-sum": {
    tests: [
      { input: "4 2 7 11 15 9", expectedOutput: "0 1" },
      { input: "4 3 2 4 6 6", expectedOutput: "1 2" },
      { input: "4 0 4 3 0 0", expectedOutput: "0 4" },
    ],
  },
  "best-time-to-buy-sell": {
    tests: [
      { input: "6 7 1 5 3 6 4", expectedOutput: "5" },
      { input: "5 7 6 4 3 1", expectedOutput: "0" },
      { input: "6 1 2 3 4 5 6", expectedOutput: "5" },
    ],
  },
  "maximum-subarray": {
    tests: [
      { input: "9 -2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "5 -1 -2 -3 -4 -5", expectedOutput: "5" },
      { input: "5 -2 1 -3 2 1 -1", expectedOutput: "3" },
    ],
  },
  "merge-intervals": {
    tests: [
      { input: "4 1 3 2 6 8 10 15 18", expectedOutput: "1 6 8 10 15 18" },
      { input: "1 1 4", expectedOutput: "1 4" },
      { input: "4 1 4 2 3 5 6 8 10", expectedOutput: "1 6 8 10" },
    ],
  },
  "valid-parentheses": {
    tests: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
    ],
  },
  "binary-search": {
    tests: [
      { input: "6 -1 0 3 5 9 12 9", expectedOutput: "4" },
      { input: "6 -1 0 3 5 9 12 2", expectedOutput: "-1" },
      { input: "7 -1 0 3 5 9 12 13 13", expectedOutput: "6" },
    ],
  },
};

const executeCode = async (code, language, stdin) => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (language === "cpp") {
    const sourceFile = `temp-${id}.cpp`;
    const exeFile = `temp-${id}.exe`;
    fs.writeFileSync(sourceFile, code || "");

    const compileResult = await execPromise(`g++ ${sourceFile} -o ${exeFile}`);
    if (compileResult.err) {
      fs.unlinkSync(sourceFile);
      return { output: "", error: compileResult.stderr || compileResult.err.message };
    }

    const runResult = await execPromise(`.${exeFile}`, { input: stdin, timeout: 5000 });
    fs.unlinkSync(sourceFile);
    fs.unlinkSync(exeFile);

    return { output: runResult.stdout, error: runResult.stderr };
  }

  if (language === "python") {
    const sourceFile = `temp-${id}.py`;
    fs.writeFileSync(sourceFile, code || "");

    const runResult = await execPromise(`python ${sourceFile}`, { input: stdin, timeout: 5000 });
    fs.unlinkSync(sourceFile);

    return { output: runResult.stdout, error: runResult.stderr };
  }

  if (language === "java") {
    const sourceFile = `Main.java`;
    fs.writeFileSync(sourceFile, code || "");

    const compileResult = await execPromise(`javac ${sourceFile}`);
    if (compileResult.err) {
      fs.unlinkSync(sourceFile);
      return { output: "", error: compileResult.stderr || compileResult.err.message };
    }

    const runResult = await execPromise(`java Main`, { input: stdin, timeout: 5000 });
    fs.unlinkSync(sourceFile);
    fs.unlinkSync("Main.class");

    return { output: runResult.stdout, error: runResult.stderr };
  }

  return { output: "", error: "Unsupported language" };
};

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= SIGNUP =================
app.post("/api/signup", async (req, res) => {
  try {
    const payload = parsePayload(req);
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "").trim();
    const confirmPassword = String(payload.confirmPassword || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (getUserByEmail(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = createUser({
      name: name || email.split("@")[0],
      email,
      password,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      message: "Signup successful 🎉",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================= RUN CODE =================
app.post("/run", async (req, res) => {
  try {
    const { code, language, problemId, mode } = parsePayload(req);

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }

    if (mode === "judge") {
      const problem = judgeProblems[problemId];
      if (!problem) {
        return res.status(400).json({ message: "No judge test cases for this problem" });
      }

      const results = [];
      for (const test of problem.tests) {
        const { output, error } = await executeCode(code, language, test.input);
        const actual = error ? error.trim() : output.trim();
        const pass = !error && actual === test.expectedOutput;
        results.push({
          input: test.input,
          expectedOutput: test.expectedOutput,
          actualOutput: actual,
          verdict: pass ? "Passed" : "Failed",
          error: error || null,
        });
      }

      return res.json({ results });
    }

    const { output, error } = await executeCode(code, language, "");
    if (error) {
      return res.json({ output: "", error });
    }

    return res.json({ output: output.trim() });
  } catch (error) {
    return res.status(500).json({ message: "Execution error", error: error.message });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  try {
    console.log("login route hit", req.body);
    const payload = parsePayload(req);
    console.log("login parsed payload", payload);
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "").trim();

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful 🔥",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================= 🔐 AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= 🔐 PROTECTED ROUTE =================
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route access granted 🔐",
    user: req.user,
  });
});

// ================= SERVER =================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});