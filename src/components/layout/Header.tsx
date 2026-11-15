import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navigation } from "@/data/navigation";
import { cn } from "@/lib/cn";

export function Header() {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  // When the links overflow (320px), keep the active one visible after every navigation.
  // Instant, and the header is sticky at the top, so block: "nearest" never scrolls the page.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <nav aria-label="Primary" className="min-w-0">
          {/* Scrolls sideways (scrollbar hidden) only when the links don't fit, e.g. at 320px.
              p-1/-mx-1 + scroll-px-1 keep focus rings from being clipped by the scroll container. */}
          <ul
            ref={listRef}
            className="-mx-1 flex scroll-px-1 items-center gap-4 overflow-x-auto p-1 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {navigation.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  // Browsers skip scrolling a partly visible focused link into view; do it explicitly
                  onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
                  className={({ isActive }) =>
                    cn(
                      "whitespace-nowrap text-sm transition-colors sm:text-[15px]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg focus-visible:transition-none",
                      isActive ? "font-medium text-fg" : "text-muted hover:text-fg",
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </Container>
    </header>
  );
}
