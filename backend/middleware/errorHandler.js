export function notFound(_req, res) {
  res.status(404).json({ message: "API route not found." });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body exceeds the 1 MB limit." });
  }
  console.error("API request failed:", error);
  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier." });
  }
  res.status(error.status || 500).json({
    message: error.status ? error.message : "An unexpected server error occurred.",
  });
}
