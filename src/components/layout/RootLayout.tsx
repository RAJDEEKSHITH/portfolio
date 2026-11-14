import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import NotFound from "@/pages/NotFound";

type RootLayoutProps = { error?: boolean };

export function RootLayout({ error = false }: RootLayoutProps) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-20 pt-10 sm:pt-16">
        <div key={pathname} className="animate-fade-in motion-reduce:animate-none">
          {error ? <NotFound /> : <Outlet />}
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
