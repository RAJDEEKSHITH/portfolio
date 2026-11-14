import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";

// Stub — built out in Step 11.
export default function Projects() {
  return (
    <Container>
      <title>{`Projects — ${site.name}`}</title>
      <PageHeader title="Projects" />
    </Container>
  );
}
