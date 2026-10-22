import { Router } from "express";
import { isValidTwoSumOutput, problemTestCases } from "../data/problemTestCases.js";
import { limitConcurrentExecutions, limitExecutionRequests } from "../middleware/executionLimits.js";
import { executeWithJudge0 } from "../services/judge0Service.js";

const router = Router();
const SUPPORTED_LANGUAGES = new Set(["cpp", "java", "python"]);
const MAX_CODE_BYTES = 50_000;
const MAX_STDIN_BYTES = 16_000;
const MAX_OUTPUT_CHARS = 20_000;

function validateRequest(body, needsStdin) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object.";
  }
  if (typeof body.code !== "string" || !body.code.trim()) {
    return "Source code is required.";
  }
  if (Buffer.byteLength(body.code, "utf8") > MAX_CODE_BYTES) {
    return "Source code must not exceed 50 KB.";
  }
  if (!SUPPORTED_LANGUAGES.has(body.language)) {
    return "Language must be cpp, java, or python.";
  }
  if (typeof body.problemId !== "string" || !/^[a-z0-9-]{1,80}$/.test(body.problemId)) {
    return "A valid problem ID is required.";
  }
  if (!problemTestCases[body.problemId]) {
    return "Code execution is not yet configured for this problem.";
  }
  if (needsStdin && typeof body.stdin !== "string") {
    return "Standard input must be a string.";
  }
  if (needsStdin && Buffer.byteLength(body.stdin, "utf8") > MAX_STDIN_BYTES) {
    return "Standard input must not exceed 16 KB.";
  }
  return null;
}

function limitOutput(value) {
  return value.length > MAX_OUTPUT_CHARS
    ? `${value.slice(0, MAX_OUTPUT_CHARS)}\n[Output truncated]`
    : value;
}

async function runCode(req, res) {
  const validationError = validateRequest(req.body, true);
  if (validationError) {
    const status = validationError.startsWith("Code execution is not yet") ? 422 : 400;
    return res.status(status).json({ message: validationError });
  }

  const config = problemTestCases[req.body.problemId];
  const result = await executeWithJudge0({
    code: req.body.code,
    language: req.body.language,
    stdin: req.body.stdin,
    timeLimitSeconds: config.timeLimitSeconds,
    memoryLimitKb: config.memoryLimitKb,
  });
  return res.json({
    verdict: result.verdict,
    stdout: limitOutput(result.stdout),
    stderr: limitOutput(result.stderr),
    time: result.time,
    memory: result.memory,
  });
}

async function submitCode(req, res) {
  const validationError = validateRequest(req.body, false);
  if (validationError) {
    const status = validationError.startsWith("Code execution is not yet") ? 422 : 400;
    return res.status(status).json({ message: validationError });
  }

  const config = problemTestCases[req.body.problemId];
  const results = [];
  let passed = 0;
  for (const [index, testCase] of config.cases.entries()) {
    const execution = await executeWithJudge0({
      code: req.body.code,
      language: req.body.language,
      stdin: testCase.input,
      timeLimitSeconds: config.timeLimitSeconds,
      memoryLimitKb: config.memoryLimitKb,
    });

    let verdict = execution.verdict;
    if (verdict === "Accepted") {
      verdict = isValidTwoSumOutput(testCase.input, execution.stdout) ? "Accepted" : "Wrong Answer";
    }
    if (verdict === "Accepted") passed += 1;

    const result = {
      testCase: index + 1,
      hidden: testCase.hidden,
      verdict,
    };
    if (!testCase.hidden) {
      result.input = testCase.input;
      result.expectedOutput = testCase.expectedOutput;
      result.actualOutput = limitOutput(execution.stdout);
      result.error = execution.stderr ? limitOutput(execution.stderr) : null;
      result.time = execution.time;
      result.memory = execution.memory;
    } else if (verdict === "Compilation Error") {
      result.error = limitOutput(execution.stderr || "Compilation failed.");
    }
    results.push(result);

    if (verdict === "Compilation Error") {
      break;
    }
  }

  const verdict = results.find((result) => result.verdict !== "Accepted")?.verdict || "Accepted";
  return res.json({
    verdict,
    passed,
    total: config.cases.length,
    message: `${passed}/${config.cases.length} test cases passed.`,
    results,
  });
}

router.post("/code/run", limitExecutionRequests, limitConcurrentExecutions, runCode);
router.post("/code/submit", limitExecutionRequests, limitConcurrentExecutions, submitCode);
router.post("/run", limitExecutionRequests, limitConcurrentExecutions, (req, res) => (
  req.body?.mode === "judge" ? submitCode(req, res) : runCode(req, res)
));

export default router;
