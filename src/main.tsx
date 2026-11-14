import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Step 1 placeholder — replaced by the router in Step 6.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <p>Hello</p>
  </StrictMode>,
);
