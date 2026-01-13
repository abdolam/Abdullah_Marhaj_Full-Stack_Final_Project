import { useEffect, useState } from "react";

const STORAGE_KEY = "ecostore_theme"; // "dark" | "light"

function normalizeTheme(value) {
  return value === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeTheme(saved);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}
