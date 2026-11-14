import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";

// Stub — built out in Step 10.
export default function Experience() {
  return (
    <Container>
      <title>{`Experience — ${site.name}`}</title>
      <PageHeader title="Experience" />
    </Container>
  );
}
