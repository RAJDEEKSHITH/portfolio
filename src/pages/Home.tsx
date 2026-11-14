import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

// Stub — built out in Step 12.
export default function Home() {
  return (
    <Container>
      <title>{`${site.name} — ${site.role}`}</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.name}</h1>
    </Container>
  );
}
