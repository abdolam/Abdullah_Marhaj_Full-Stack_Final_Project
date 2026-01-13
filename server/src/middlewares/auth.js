import jwt from "jsonwebtoken";

import { appConfig } from "../config/env.js";
import { User } from "../modules/user/models/user.model.js";

function localDayKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // e.g. 2025-12-24
}

function isWriteMethod(method) {
  const m = String(method || "").toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

/** Require Authorization: Bearer <token> and attach req.user */
export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  }

  try {
    const payload = jwt.verify(token, appConfig.jwtSecert);

    // Load full user to check inactivity window + rate limiting
    const user = await User.findById(payload._id);
    if (!user) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const now = new Date();
    const maxInactiveMs = (appConfig.autoLogoutMinutes || 240) * 60 * 1000;

    // Fallbacks: if lastActivityAt is missing, use updatedAt/createdAt
    const lastActivity =
      user.lastActivityAt || user.updatedAt || user.createdAt || now;

    const inactiveMs = now - lastActivity;

    if (inactiveMs > maxInactiveMs) {
      // Do NOT update lastActivityAt when session is already expired
      return next(
        Object.assign(
          new Error("Session expired due to inactivity. Please log in again."),
          { status: 401 }
        )
      );
    }

    // ── Per-user / 24h rate limiting (00:00 -> 23:59 LOCAL) ─────────────
    // IMPORTANT: count only WRITE requests (mutations) to avoid burning quota on UI reads.
    const limit = appConfig.requestsLimit ?? 0;
    if (limit > 0 && isWriteMethod(req.method)) {
      const todayKey = localDayKey(now);

      const windowStart = user.requestWindowStart;
      let windowKey = null;

      if (windowStart instanceof Date) {
        windowKey = localDayKey(windowStart);
      }

      // New day -> reset counter and window start
      if (windowKey !== todayKey) {
        user.requestWindowStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
        user.requestCount24h = 0;
      }

      const count = Number(user.requestCount24h || 0);

      if (count >= limit) {
        // Do NOT update lastActivityAt when already blocked by rate limit
        return next(
          Object.assign(
            new Error(
              "Rate limit exceeded for today. Please try again tomorrow."
            ),
            { status: 429 }
          )
        );
      }

      user.requestCount24h = count + 1;
    }

    // Always update activity for authenticated requests (used by inactivity auto logout)
    user.lastActivityAt = now;

    // Avoid extra validation cost on every request
    await user.save({ validateBeforeSave: false });

    req.user = user;
    return next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    // Invalid token, expired token, etc.
    return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  }
}
