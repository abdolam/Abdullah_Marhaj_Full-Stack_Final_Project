const isDev = process.env.NODE_ENV !== "production";
const logDenied = (req, reason) => {
  if (!isDev) return;
  const uid = req.user?._id ? String(req.user._id) : "anonymous";
  // small, single-line, grep-able
  console.warn(
    `[roles] DENY uid=${uid} method=${req.method} url=${req.originalUrl} reason="${reason}"`
  );
};

/** Allow only admins */
export function requireAdmin(req, _res, next) {
  if (req.user?.isAdmin) return next();

  logDenied(req, "admin privileges required");
  const err = new Error("Access denied: admin privileges are required.");
  err.status = 403;
  next(err);
}
