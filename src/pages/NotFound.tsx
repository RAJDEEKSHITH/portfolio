import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

// Stub — built out in Step 13.
export default function NotFound() {
  return (
    <Container>
      <title>{`Page not found — ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">404</h1>
    </Container>
  );
}
