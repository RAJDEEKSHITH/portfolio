import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export const pageLoaders = {
  experience: () => import("@/pages/Experience"),
  projects: () => import("@/pages/Projects"),
  resume: () => import("@/pages/Resume"),
} as const;

const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) =>
  async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootLayout error />,
    // First load of a lazy route renders nothing until its chunk arrives (a few ms). Declaring it
    // explicitly keeps that behaviour and silences React Router's "No HydrateFallback" warning.
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Home /> },
      { path: "experience", lazy: lazyPage(pageLoaders.experience) },
      { path: "work", element: <Navigate to="/experience" replace /> },
      { path: "projects", lazy: lazyPage(pageLoaders.projects) },
      { path: "resume", lazy: lazyPage(pageLoaders.resume) },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
