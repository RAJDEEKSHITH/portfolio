export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — ignore */
  }
}

export function getDomTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add("no-transitions");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  void root.offsetHeight; // force reflow so the change applies without transitions
  requestAnimationFrame(() => root.classList.remove("no-transitions"));
}
