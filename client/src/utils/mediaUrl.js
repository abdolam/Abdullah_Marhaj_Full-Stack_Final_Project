function isRelativeUploadsPath(p) {
  return typeof p === "string" && p.startsWith("/uploads/");
}

export function toAbsoluteUrl(p) {
  if (!p) return null;

  // If already absolute URL
  if (p.startsWith("http://") || p.startsWith("https://")) return p;

  // If backend-relative uploads path
  if (isRelativeUploadsPath(p)) {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    return `${base}${p}`;
  }

  return p;
}
