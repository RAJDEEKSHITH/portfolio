import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

// Stub — built out in Step 11.
export default function Projects() {
  return (
    <Container>
      <title>{`Projects — ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
    </Container>
  );
}
