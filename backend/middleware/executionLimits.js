const requestsByClient = new Map();
const RATE_WINDOW_MS = 60_000;
const MAX_TRACKED_CLIENTS = 10_000;
const MAX_CONCURRENT_EXECUTIONS = 4;
let activeExecutions = 0;

export function limitExecutionRequests(req, res, next) {
  const now = Date.now();
  const key = `${req.ip}:${req.path}`;
  const limit = req.path.endsWith("/submit") ? 5 : 10;
  const current = requestsByClient.get(key);
  const bucket = current && now - current.startedAt < RATE_WINDOW_MS
    ? current
    : { startedAt: now, count: 0 };

  if (bucket.count >= limit) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - bucket.startedAt)) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({ message: "Too many code execution requests. Please wait and try again." });
  }

  bucket.count += 1;
  requestsByClient.set(key, bucket);
  if (requestsByClient.size > MAX_TRACKED_CLIENTS) {
    for (const [clientKey, value] of requestsByClient) {
      if (now - value.startedAt >= RATE_WINDOW_MS) requestsByClient.delete(clientKey);
    }
    while (requestsByClient.size > MAX_TRACKED_CLIENTS) {
      requestsByClient.delete(requestsByClient.keys().next().value);
    }
  }
  next();
}

export function limitConcurrentExecutions(_req, res, next) {
  if (activeExecutions >= MAX_CONCURRENT_EXECUTIONS) {
    return res.status(503).json({ message: "The code execution service is busy. Please try again shortly." });
  }

  activeExecutions += 1;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeExecutions -= 1;
  };
  res.once("finish", release);
  res.once("close", release);
  next();
}
