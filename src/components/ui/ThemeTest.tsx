import { useTheme } from "@/context/ThemeContext";

// TEMPORARY (Step 3) — theme test button. Delete in Step 6.
export function ThemeTest() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mt-6 h-10 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
    >
      Theme: {theme} (click to toggle)
    </button>
  );
}
