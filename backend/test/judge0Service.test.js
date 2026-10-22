import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { isValidTwoSumOutput, parseTwoSumInput, problemTestCases } from "../data/problemTestCases.js";
import { executeWithJudge0, Judge0Error } from "../services/judge0Service.js";

const originalFetch = globalThis.fetch;
const originalEnv = {
  JUDGE0_API_URL: process.env.JUDGE0_API_URL,
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
  JUDGE0_API_HOST: process.env.JUDGE0_API_HOST,
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("requires an explicitly configured Judge0 service", async () => {
  delete process.env.JUDGE0_API_URL;
  await assert.rejects(
    executeWithJudge0({
      code: "print(1)",
      language: "python",
      stdin: "",
      timeLimitSeconds: 2,
      memoryLimitKb: 128000,
    }),
    (error) => error instanceof Judge0Error && error.statusCode === 503,
  );
});

test("maps C++, Java, and Python to Judge0 IDs and returns real provider output", async () => {
  process.env.JUDGE0_API_URL = "https://judge0.example/";
  process.env.JUDGE0_API_KEY = "test-auth-token";
  delete process.env.JUDGE0_API_HOST;
  const expectedIds = { cpp: 54, java: 62, python: 71 };

  for (const [language, languageId] of Object.entries(expectedIds)) {
    let submitted;
    let requestUrl;
    globalThis.fetch = async (url, options) => {
      requestUrl = String(url);
      submitted = JSON.parse(options.body);
      assert.equal(options.headers["X-Auth-Token"], "test-auth-token");
      return new Response(JSON.stringify({
        token: "submission-token",
        status: { id: 3, description: "Accepted" },
        stdout: "actual output\n",
        stderr: "",
        time: "0.01",
        memory: 4096,
      }), { status: 201, headers: { "Content-Type": "application/json" } });
    };

    const result = await executeWithJudge0({
      code: "source",
      language,
      stdin: "custom input",
      timeLimitSeconds: 2,
      memoryLimitKb: 128000,
    });

    assert.equal(submitted.language_id, languageId);
    assert.equal(submitted.stdin, "custom input");
    assert.equal(submitted.cpu_time_limit, 2);
    assert.equal(submitted.memory_limit, 128000);
    assert.match(requestUrl, /\/submissions\?base64_encoded=false$/);
    assert.equal(result.verdict, "Accepted");
    assert.equal(result.stdout, "actual output\n");
    assert.equal(result.time, "0.01");
    assert.equal(result.memory, 4096);
  }
});

test("uses RapidAPI credentials only when both key and host are configured", async () => {
  process.env.JUDGE0_API_URL = "https://judge0.example";
  process.env.JUDGE0_API_KEY = "rapid-api-key";
  process.env.JUDGE0_API_HOST = "judge0.p.rapidapi.com";
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers["X-RapidAPI-Key"], "rapid-api-key");
    assert.equal(options.headers["X-RapidAPI-Host"], "judge0.p.rapidapi.com");
    return new Response(JSON.stringify({
      token: "token",
      status: { id: 6, description: "Compilation Error" },
      stderr: "compiler diagnostic",
    }), { status: 201 });
  };

  const result = await executeWithJudge0({
    code: "invalid",
    language: "java",
    stdin: "",
    timeLimitSeconds: 2,
    memoryLimitKb: 128000,
  });
  assert.equal(result.verdict, "Compilation Error");
  assert.equal(result.stderr, "compiler diagnostic");
});

test("polls a Judge0 token until execution finishes and maps timeouts", async () => {
  process.env.JUDGE0_API_URL = "https://judge0.example/";
  delete process.env.JUDGE0_API_KEY;
  delete process.env.JUDGE0_API_HOST;
  let polls = 0;
  globalThis.fetch = async (url, options) => {
    if (options.method === "POST") {
      return new Response(JSON.stringify({
        token: "queued-token",
        status: { id: 2, description: "Processing" },
      }), { status: 201 });
    }
    polls += 1;
    assert.match(String(url), /\/submissions\/queued-token\?base64_encoded=false$/);
    return new Response(JSON.stringify({
      status: { id: 5, description: "Time Limit Exceeded" },
      stdout: "",
      stderr: "",
    }), { status: 200 });
  };

  const result = await executeWithJudge0({
    code: "while (true) {}",
    language: "cpp",
    stdin: "",
    timeLimitSeconds: 2,
    memoryLimitKb: 128000,
  });
  assert.equal(polls, 1);
  assert.equal(result.verdict, "Time Limit Exceeded");
});

test("turns provider outages into a clear service error", async () => {
  process.env.JUDGE0_API_URL = "https://judge0.example";
  globalThis.fetch = async () => { throw new Error("network down"); };
  await assert.rejects(
    executeWithJudge0({
      code: "print(1)",
      language: "python",
      stdin: "",
      timeLimitSeconds: 2,
      memoryLimitKb: 128000,
    }),
    (error) => error instanceof Judge0Error && error.statusCode === 503 && /unavailable/i.test(error.message),
  );
});

test("validates the trusted Two Sum input and accepts either valid index order", () => {
  assert.deepEqual(parseTwoSumInput("4\n2 7 11 18\n9\n"), {
    numbers: [2, 7, 11, 18],
    target: 9,
  });
  assert.equal(isValidTwoSumOutput("4\n2 7 11 18\n9\n", "0 1\n"), true);
  assert.equal(isValidTwoSumOutput("4\n2 7 11 18\n9\n", "[1, 0]"), true);
  assert.equal(isValidTwoSumOutput("4\n2 7 11 18\n9\n", "0 2"), false);
  assert.equal(isValidTwoSumOutput("4\n2 7 11 18\n9\n", "0 0"), false);
  assert.equal(isValidTwoSumOutput("2\n1 2\n3\n", "0 1"), true);
});

test("keeps trusted grading cases on the backend with hidden cases", () => {
  const config = problemTestCases["two-sum"];
  assert.equal(config.cases.length, 6);
  assert.equal(config.cases[0].hidden, false);
  assert.ok(config.cases.slice(1).every((testCase) => testCase.hidden));
  assert.ok(config.cases.every((testCase) => isValidTwoSumOutput(testCase.input, testCase.expectedOutput)));
  assert.equal(config.timeLimitSeconds, 2);
  assert.equal(config.memoryLimitKb, 128000);
});
