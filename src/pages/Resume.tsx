import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";

// Stub — built out in Step 13.
export default function Resume() {
  return (
    <Container>
      <title>{`Resume — ${site.name}`}</title>
      <PageHeader title="Resume" />
    </Container>
  );
}
