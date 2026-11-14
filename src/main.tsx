import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";

// Placeholder — replaced by the router in Step 6.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-dvh bg-bg p-6 text-fg">
      <p className="text-3xl font-semibold tracking-tight">Hello</p>
      <p className="mt-2 text-[15px] text-muted">Muted text on bg-bg.</p>
      <p className="mt-2 font-mono text-sm text-accent">font-mono · text-accent</p>
    </div>
  </StrictMode>,
);
