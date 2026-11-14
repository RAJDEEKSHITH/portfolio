import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";

// Stub — built out in Step 13.
export default function NotFound() {
  return (
    <Container>
      <title>{`Page not found — ${site.name}`}</title>
      <PageHeader title="404" />
    </Container>
  );
}
