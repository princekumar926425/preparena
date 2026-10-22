import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured. Set JWT_SECRET." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Administrator access is required." });
  }
  next();
}
