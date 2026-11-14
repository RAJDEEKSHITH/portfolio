import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

// Stub — built out in Step 13.
export default function Resume() {
  return (
    <Container>
      <title>{`Resume — ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Resume</h1>
    </Container>
  );
}
