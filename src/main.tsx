import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeTest } from "@/components/ui/ThemeTest"; // TEMPORARY (Step 3) — remove in Step 6

// Placeholder — replaced by the router in Step 6.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="min-h-dvh bg-bg p-6 text-fg">
        <p className="text-3xl font-semibold tracking-tight">Hello</p>
        <p className="mt-2 text-[15px] text-muted">Muted text on bg-bg.</p>
        <p className="mt-2 font-mono text-sm text-accent">font-mono · text-accent</p>
        <ThemeTest />
      </div>
    </ThemeProvider>
  </StrictMode>,
);

if (import.meta.env.DEV) {
  void import("@/lib/validate").then((m) => m.validateContent());
}
