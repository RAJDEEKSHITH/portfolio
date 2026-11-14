import type { NavItem } from "@/types/content";

/** Header nav. `to` must match a route in router.tsx. */
export const navigation = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Resume", to: "/resume" },
] satisfies NavItem[];
