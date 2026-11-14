import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import NotFound from "@/pages/NotFound";

type RootLayoutProps = { error?: boolean };

export function RootLayout({ error = false }: RootLayoutProps) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      {/* <Header /> — Step 7 */}
      <main id="main" className="flex-1 pb-20 pt-10 sm:pt-16">
        <div key={pathname} className="animate-fade-in motion-reduce:animate-none">
          {error ? <NotFound /> : <Outlet />}
        </div>
      </main>
      {/* <Footer /> — Step 8 */}
      <ScrollRestoration />
    </div>
  );
}
