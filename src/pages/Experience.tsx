import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

// Stub — built out in Step 10.
export default function Experience() {
  return (
    <Container>
      <title>{`Experience — ${site.name}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Experience</h1>
    </Container>
  );
}
