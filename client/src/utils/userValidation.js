export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RE =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;

export const PHONE_IL_RE = /^0\d{1,2}-?\d{7}$/;

export function validateRegister(values) {
  const errors = {};

  // Name
  const first = (values.first || "").trim();
  const last = (values.last || "").trim();

  if (first.length < 2) errors.first = "שם פרטי חייב להכיל לפחות 2 תווים";
  else if (first.length > 50) errors.first = "שם פרטי ארוך מדי (מקסימום 50)";

  if (last.length < 2) errors.last = "שם משפחה חייב להכיל לפחות 2 תווים";
  else if (last.length > 50) errors.last = "שם משפחה ארוך מדי (מקסימום 50)";

  // Phone (required by BE)
  const phone = (values.phone || "").trim();
  if (!PHONE_IL_RE.test(phone)) {
    errors.phone = "טלפון חייב להיות ישראלי תקין (לדוגמה: 03-1234567)";
  }

  // Email
  const email = (values.email || "").trim();
  if (!EMAIL_RE.test(email)) errors.email = "אימייל לא תקין";

  // Password (must match BE)
  if (!values.password || !PASSWORD_RE.test(values.password)) {
    errors.password =
      "סיסמה חייבת להיות 8–64 תווים ולכלול אות גדולה, אות קטנה, מספר ותו מיוחד";
  }

  // Confirm password (comparison only, no regex)
  if (!values.confirmPassword) {
    errors.confirmPassword = "אישור סיסמה הוא שדה חובה";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "הסיסמאות אינן תואמות";
  }

  // Address fields (Israel-only: country is implicit, not in UI)
  const city = (values.city || "").trim();
  const street = (values.street || "").trim();

  if (city.length < 2) errors.city = "עיר היא שדה חובה (לפחות 2 תווים)";
  else if (city.length > 100) errors.city = "עיר ארוכה מדי (מקסימום 100)";

  if (street.length < 2) errors.street = "רחוב הוא שדה חובה (לפחות 2 תווים)";
  else if (street.length > 120) errors.street = "רחוב ארוך מדי (מקסימום 120)";

  const houseNumber = Number(values.houseNumber);
  if (
    !Number.isInteger(houseNumber) ||
    houseNumber < 1 ||
    houseNumber > 99999
  ) {
    errors.houseNumber = "מספר בית חייב להיות מספר שלם בין 1 ל-99999";
  }

  const zip = Number(values.zip);
  if (!Number.isInteger(zip) || zip < 0 || zip > 9999999) {
    errors.zip = "מיקוד חייב להיות מספר שלם בין 0 ל-9999999";
  }

  return errors;
}

export function validateLogin(values) {
  const errors = {};
  const email = (values.email || "").trim();

  if (!EMAIL_RE.test(email)) errors.email = "אימייל לא תקין";
  if (!values.password) errors.password = "סיסמה היא שדה חובה";

  return errors;
}
