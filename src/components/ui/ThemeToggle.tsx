import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/cn";

const ICON = "size-4.5 [grid-area:1/1] transition-[opacity,transform] duration-300";
const HIDDEN = "scale-75 rotate-45 opacity-0";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
    >
      <LuSun aria-hidden className={cn(ICON, isDark && HIDDEN)} />
      <LuMoon aria-hidden className={cn(ICON, !isDark && HIDDEN)} />
    </button>
  );
}
