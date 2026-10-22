const LANGUAGE_IDS = Object.freeze({
  cpp: 54,
  java: 62,
  python: 71,
});

const REQUEST_TIMEOUT_MS = 5000;
const POLL_INTERVAL_MS = 500;
const MAX_POLL_DURATION_MS = 20000;
const MAX_PROVIDER_RESPONSE_BYTES = 1024 * 1024;

export class Judge0Error extends Error {
  constructor(message, statusCode = 503) {
    super(message);
    this.name = "Judge0Error";
    this.statusCode = statusCode;
  }
}

function getProviderConfig() {
  const configuredUrl = process.env.JUDGE0_API_URL?.trim();
  if (!configuredUrl) {
    throw new Judge0Error("Code execution is not configured. Set JUDGE0_API_URL to a trusted Judge0 service.", 503);
  }

  let baseUrl;
  try {
    baseUrl = new URL(configuredUrl);
  } catch {
    throw new Judge0Error("JUDGE0_API_URL must be a valid HTTP or HTTPS URL.", 503);
  }
  if (!["http:", "https:"].includes(baseUrl.protocol) || baseUrl.search || baseUrl.hash) {
    throw new Judge0Error("JUDGE0_API_URL must be a valid HTTP or HTTPS base URL.", 503);
  }

  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const apiKey = process.env.JUDGE0_API_KEY?.trim();
  const apiHost = process.env.JUDGE0_API_HOST?.trim();
  if (apiKey && apiHost) {
    headers["X-RapidAPI-Key"] = apiKey;
    headers["X-RapidAPI-Host"] = apiHost;
  } else if (apiKey) {
    headers["X-Auth-Token"] = apiKey;
  }

  return { baseUrl, headers };
}

function submissionUrl(baseUrl, token) {
  const url = new URL("submissions", baseUrl.href.endsWith("/") ? baseUrl : `${baseUrl.href}/`);
  url.searchParams.set("base64_encoded", "false");
  if (token) url.pathname = `${url.pathname.replace(/\/$/, "")}/${encodeURIComponent(token)}`;
  return url;
}

async function requestJson(url, options, headers) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    const text = await response.text();
    if (Buffer.byteLength(text, "utf8") > MAX_PROVIDER_RESPONSE_BYTES) {
      throw new Judge0Error("The compiler service returned an oversized response.");
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Judge0Error("The compiler service returned an invalid response.");
    }
    if (!response.ok) {
      throw new Judge0Error(`Compiler service request failed (HTTP ${response.status}).`);
    }
    return data;
  } catch (error) {
    if (error instanceof Judge0Error) throw error;
    if (error?.name === "AbortError") {
      throw new Judge0Error("The compiler service did not respond in time.");
    }
    throw new Judge0Error("The compiler service is unavailable. Check its URL and network connectivity.");
  } finally {
    clearTimeout(timeout);
  }
}

function mapStatus(statusId, statusDescription) {
  if (statusId === 3) return "Accepted";
  if (statusId === 4) return "Wrong Answer";
  if (statusId === 5) return "Time Limit Exceeded";
  if (statusId === 6) return "Compilation Error";
  if (statusId >= 7 && statusId <= 12) return "Runtime Error";
  if (statusId === 13 || statusId === 14) return "Internal Error";
  return statusDescription || "Internal Error";
}

export async function executeWithJudge0({ code, language, stdin, timeLimitSeconds, memoryLimitKb }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Judge0Error("Unsupported language.", 400);
  const { baseUrl, headers } = getProviderConfig();
  const url = submissionUrl(baseUrl);
  const submission = await requestJson(
    url,
    {
      method: "POST",
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin,
        cpu_time_limit: timeLimitSeconds,
        wall_time_limit: Math.max(timeLimitSeconds + 1, timeLimitSeconds * 2),
        memory_limit: memoryLimitKb,
      }),
    },
    headers,
  );

  if (typeof submission.token !== "string" || !submission.token) {
    throw new Judge0Error("The compiler service did not return a submission token.");
  }

  const deadline = Date.now() + MAX_POLL_DURATION_MS;
  let result = submission;
  while (result.status?.id === 1 || result.status?.id === 2) {
    if (Date.now() >= deadline) {
      throw new Judge0Error("Code execution timed out while waiting for the compiler service.");
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    result = await requestJson(submissionUrl(baseUrl, submission.token), { method: "GET" }, headers);
  }

  if (!Number.isInteger(result.status?.id)) {
    throw new Judge0Error("The compiler service returned an invalid execution status.");
  }

  return {
    verdict: mapStatus(result.status.id, result.status.description),
    stdout: typeof result.stdout === "string" ? result.stdout : "",
    stderr: result.status.id === 6 && typeof result.compile_output === "string"
      ? result.compile_output
      : typeof result.stderr === "string" ? result.stderr : "",
    time: result.time ?? null,
    memory: result.memory ?? null,
  };
}
