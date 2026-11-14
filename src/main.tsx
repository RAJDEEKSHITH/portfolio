import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { router, pageLoaders } from "@/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);

// Warm lazy chunks after first paint so later navigations are instant
const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
idle(() => Object.values(pageLoaders).forEach((load) => void load()));

if (import.meta.env.DEV) {
  void import("@/lib/validate").then((m) => m.validateContent());
}
