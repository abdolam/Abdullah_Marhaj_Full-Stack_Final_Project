export function extractErrorMessage(err) {
  const data = err?.response?.data;

  // Most common: { message: "..." }
  if (typeof data?.message === "string") return data.message;

  // Sometimes: { error: "..." } or { msg: "..." }
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.msg === "string") return data.msg;

  // Sometimes: { message: [ "a", "b" ] } or { errors: [ ... ] }
  if (Array.isArray(data?.message)) return data.message.join(", ");
  if (Array.isArray(data?.errors))
    return data.errors
      .map((e) => (typeof e === "string" ? e : e?.message || "שגיאה"))
      .join(", ");

  // Fallback: if data itself is string
  if (typeof data === "string") return data;

  // Axios generic message
  if (typeof err?.message === "string") return err.message;

  return "";
}
